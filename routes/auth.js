const express = require('express');
const router = express.Router();
const { pool } = require('../db');
const bcrypt = require('bcrypt'); // for password hashing, see next step

// Login route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE user = ?', [username]);
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (match) {
      req.session.user = user.user;  // store the username in session
      req.session.user_id = user.id; // store the user ID in session
      return res.status(200).json({ message: 'Login successful' });
    } else {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});


// Create account route
router.post('/create', async (req, res) => {
  const { username, password } = req.body;
  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE user = ?', [username]);
    if (rows.length > 0) {
      return res.status(409).json({ error: 'Username exists' });  // Conflict
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await pool.query('INSERT INTO users (user, password) VALUES (?, ?)',  [username, hashedPassword]);
    return res.status(201).json({ message: 'Account created' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/user', (req, res) => {
  if (req.session && req.session.user) {
    return res.status(200).json({ user: req.session.user });
  }
  return res.status(401).json({ error: 'Unauthorized' });
});

router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Logout error:', err);
            return res.status(500).json({ error: 'Failed to logout' });
        }

        console.log('User logged out successfully');
        res.clearCookie('connect.sid');
        res.status(200).json({ message: 'Logged out successfully' });
    });
});


module.exports = router;
