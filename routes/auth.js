// routes/auth.js
const express = require('express');
const passport = require('passport');
const { body, validationResult } = require('express-validator'); // Import express-validator
const router = express.Router();
const User = require('../models/User');
const argon2 = require('argon2'); // Import argon2 for password hashing
const csrf = require('csurf');

// CSRF Protection Middleware
const csrfProtection = csrf({
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Set to true in production
        sameSite: 'strict'
    }
});

// Apply CSRF protection to all routes in this router
router.use(csrfProtection);

// Register Route
router.get('/register', (req, res) => {
    res.render('register', { title: 'Register', message: req.flash('error'), csrfToken: req.csrfToken(), user: req.user  });
});

router.post('/register', [
    body('username').isLength({ min: 3 }).withMessage('Username must be at least 3 characters long.'),
    body('password').isLength({ min: 5 }).withMessage('Password must be at least 5 characters long.')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        req.flash('error', errors.array().map(err => err.msg).join(', '));
        return res.redirect('/register');
    }

    const { username, password } = req.body;
    try {
        // Check if the username already exists
        const existingUser  = await User.findOne({ username });
        if (existingUser ) {
            req.flash('error', 'Username already exists');
            return res.redirect('/register');
        }

        // Hash the password before saving
        const hashedPassword = await argon2.hash(password);
        const newUser  = new User({ username, password: hashedPassword });
        await newUser .save();
        res.redirect('/login');
    } catch (err) {
        console.error(err);
        req.flash('error', 'An error occurred while registering. Please try again.');
        res.redirect('/register');
    }
});

// Login Route
router.get('/login', (req, res) => {
    res.render('login', { title: 'login', message: req.flash('error'), csrfToken: req.csrfToken(), user: req.user  });
});

router.post('/login', async (req, res, next) => {
    console.log('Login attempt:', req.body); // Log the login attempt
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            console.error('Error during authentication:', err);
            return next(err);
        }
        if (!user) {
            console.log('Authentication failed:', info.message); // Log the failure reason
            return res.redirect('/login');
        }
        req.logIn(user, (err) => {
            if (err) {
                console.error('Error during login:', err);
                return next(err);
            }
            return res.redirect('/'); // Redirect to the home page or wherever you want
        });
    })(req, res, next);
});

// Logout Route
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/login');
});

// User Profile Route
router.get('/profile', async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/login');
    }
    try {
        const user = await User.findById(req.user._id).populate('posts');
        res.render('profile', { title: 'Profile', user });
    } catch (err) {
        console.error(err);
        req.flash('error', 'An error occurred while fetching your profile.');
        res.redirect('/');
    }
});

module.exports = router;
