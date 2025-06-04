const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

const { pool, testConnection } = require('./db');
const authRoutes = require('./routes/auth');
const entryRoutes = require('./routes/entry');

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: 'your-secret-key',       // change this to a secure key in production
    resave: false,                   
    saveUninitialized: true,         
    cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 60         // 1 hour
    }
}));

app.use(express.static(path.join(__dirname, 'public')));

// Basic route
app.get('/', authGuard, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'html/index.html'));
});

app.get('/login.html', authGuard, async (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html/login.html'));
});

app.get('/index.html', authGuard, async (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html/index.html'));
});

app.use('/api/auth', authRoutes);
app.use('/api/entry', entryRoutes);

async function authGuard(req, res, next) {
    if (req.session && req.session.user) {
        try {
            const [rows] = await pool.query('SELECT * FROM users WHERE user = ?', [req.session.user]);
            if (rows.length === 0) {
                req.session.destroy(); 
                return res.redirect('html/login.html');
            }
        } catch (error) {
            console.error('Database query error:', error);
            return res.status(500).send('Internal Server Error');
        }
        
        return next(); // user is authenticated
    }

    return res.sendFile(path.join(__dirname, 'public', 'html/login.html'));
}

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    testConnection();
});
