const express = require('express');
const router = express.Router();
const { pool } = require('../db'); // adjust path as needed

// GET /api/entry
router.get('/get', async (req, res) => {
	try {
		const [rows] = await pool.query(
			'SELECT id, date, type, description, amount FROM spendings WHERE user_id = ? ORDER BY date DESC',
			[req.session.user_id]
		);

        const sanitizedRows = rows.map(entry => {
            const d = entry.date;
            // Format date as YYYY-MM-DD using local date parts to avoid timezone shifts
            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, '0'); // months 0-11
            const day = String(d.getDate()).padStart(2, '0');
            return {
                ...entry,
                date: `${year}-${month}-${day}`,
            };
        });

		res.json(sanitizedRows);
	} catch (error) {
		console.error("Failed to retrieve entries:", error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
});

router.post('/add', async (req, res) => {
    const { date, desc, amount, type } = req.body;
    if (!date || !desc || !amount || !type) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        await pool.query(
            'INSERT INTO spendings (user_id, date, type, description, amount) VALUES (?, ?, ?, ?, ?)',
            [req.session.user_id, date, type, desc, amount]
        );
        res.status(201).json({ message: 'Entry added successfully' });
    } catch (error) {
        console.error("Failed to add entry:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.delete('/delete', async (req, res) => {
    const { id } = req.body;
    if (!id) {
        return res.status(400).json({ error: 'ID is required' });
    }

    try {
        const [result] = await pool.query
            ('DELETE FROM spendings WHERE id = ? AND user_id = ?',
            [id, req.session.user_id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Entry not found or does not belong to user' });     
        }

        res.status(200).json({success: true, message: 'Entry deleted successfully' });
    } catch (error) {
        console.error("Failed to delete entry:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.put('/update', async (req, res) => {
    const { id, desc, amount, type } = req.body;
    if (!id || !desc || !amount || !type) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const [result] = await pool.query(
            'UPDATE spendings SET type = ?, description = ?, amount = ? WHERE id = ? AND user_id = ?',
            [type, desc, amount, id, req.session.user_id]
        );

        if (result.changedRows === 0) {
            return res.status(200).json({ success: false, message: 'No changes made to the entry.' });
        }

        res.status(200).json({ message: 'Entry updated successfully' });
    } catch (error) {
        console.error("Failed to update entry:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
