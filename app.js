const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const ejsLayouts = require('express-ejs-layouts');
const passport = require('passport');
const passportConfig = require('./config/passport');
const flash = require('connect-flash');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const csrf = require('csurf');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const path = require('path');
const User = require('./models/User'); // Ensure you import your User model
const argon2 = require('argon2');
const authRoutes = require('./routes/auth');

const Post = require('./models/Post');
const app = express();
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});

// Middleware
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));
app.use(helmet());
app.use(limiter);
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: process.env.NODE_ENV === 'production' } // Set secure cookies in production
}));

// Passport Config
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
passportConfig(passport);

// CSRF Protection Middleware
const csrfProtection = csrf({ 
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Set to true in production
        sameSite: 'strict'
    }
});
app.use(csrfProtection);

// Set the view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(ejsLayouts);
app.set('layout', 'layout');

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Ensure user is authenticated
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

app.use('/', authRoutes);

// Routes
app.get('/', async (req, res) => {
    try {
        const posts = await Post.find().populate('author');
        res.render('posts/index', { title: 'Home', posts, user: req.user, csrfToken: req.csrfToken() });
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/posts', async (req, res) => {
    try {
        const posts = await Post.find().populate('author');
        res.render('posts/index', { title: 'Blog Posts', posts, user: req.user || {} });
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/new', ensureAuthenticated, async (req, res) => {
    try {
        const posts = await Post.find().populate('author');
        res.render('posts/new', { title: 'Submit New Post', posts, user: req.user, csrfToken: req.csrfToken() });
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Login route
app.get('/login', (req, res) => {
    res.render('login', { title: 'Login', csrfToken: req.csrfToken(), message: req.flash('error') });
});

// Handle login
app.post('/login', async (req, res, next) =>{
    console.log('Login attempt:', req.body);
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
            console.log('User logged in successfully:', user.username)
            return res.redirect('/'); // Redirect to the home page or wherever you want
        });
    })(req, res, next);
});

// Registration route
app.get('/register', (req, res) => {
    res.render('register', { title: 'Register', csrfToken: req.csrfToken(), message: '' });
});

// Handle registration
app.post('/register', async (req, res) => {
    try{
    const { username, password } = req.body;

    // Check if user already exists
    const existingUser  = await User.findOne({ username: username.toLowerCase() });
    if (existingUser ) {
        return res.status(400).send('Username  already exists');
    }

                // Hash the password
                const hashedPassword = await argon2.hash(password, {
                    type: argon2.argon2id,
                    memoryCost: 2 ** 16,
                    timeCost: 3,
                    parallelism: 1
                });

                // Create a new user
                const newUser  = new User({
                    username: username.toLowerCase(),
                    password: hashedPassword // Save the hashed password
                });
        
                await newUser .save();
                res.redirect('/login');
            } catch (err) {
                console.error('Registration error:', err);
                    res.status(500).send('Error registering user'); // Redirect to home after successful registration
                }
        });
        
        // Logout route
        app.get('/logout', (req, res, next) => {
            req.logout((err) => {
                if (err) { return next(err); }
                res.redirect('/login');
            });
        });
        
        // Error handling middleware
        app.use((err, req, res, next) => {
            console.error(err.stack);
            res.status(500).send('Something broke!');
        });
        
        // Start the server
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
       