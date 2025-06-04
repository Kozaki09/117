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
    secret: 'your-secret-key',       
    resave: false,                   
    saveUninitialized: true,         
    cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 60         // 1 hour
    }
}));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/auth', authRoutes);
app.use('/api/entry', entryRoutes);

// Basic route
app.get('/', authGuard, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'html/index.html'));
});

app.get('/login', authGuard, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html/login.html'));
});

app.get('/index', authGuard, (req, res) => {
    res.redirect('/'); 
});

app.use((req, res) => {
    res.redirect('/login');
});

async function authGuard(req, res, next) {

    if (!req.session || !req.session.user) {
        if (req.originalUrl === '/login') {
            return next();
        } else {
            return res.redirect('/login');
        }
    }

    try {
        const [rows] = await pool.query('SELECT * FROM users WHERE user = ?', [req.session.user]);
        if (rows.length === 0) {
            req.session.destroy();
            if (req.originalUrl === '/login') {
                return next();
            }

            return res.redirect('/login');
        }
    } catch (error) {
        return res.status(500).send('Internal Server Error');
    }

    if (req.originalUrl !== '/') {
        return res.redirect('/');
    }

    return next();
}

// Start server
app.listen(PORT, () => {
    console.log(`\n===Logging Started===\n`)
    console.log(`>> Server Started : http://localhost:${PORT}`);
    console.log(`>> Database       : connecting...`);
    testConnection();
});
