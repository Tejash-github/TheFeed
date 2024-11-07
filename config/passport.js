const LocalStrategy = require('passport-local').Strategy;
const passport = require('passport');
const User = require('../models/User');
const argon2 = require('argon2');


const passportConfig = (passport) => {  
    passport.use(new LocalStrategy(
        async (username, password, done) => {
            try {
                // Find the user by username
                const user = await User.findOne({ username: username.toLowerCase() });
                console.log('Searching for user:', username.toLowerCase());
                console.log('User found:', user);

                if (!user) {
                    return done(null, false, { message: 'Invalid username or password.' });
                }
    
                // Verify the password using argon2
                try {
                    const isMatch = await argon2.verify(user.password, password);
                    console.log('Password match:', isMatch);

                    if (!isMatch) {
                        return done(null, false, { message: 'Invalid username or password.' });
                    }
        
                    // If everything is okay, return the user
                    return done(null, user);
                } catch (verifyError) {
                    console.error('Password verification error:', verifyError);
                    return done(null, false, { message: 'Error verifying password.' });
                }
            } catch (err) {
                console.error('Authentication error:', err);
                return done(err);
            }
        }
    ));

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (err) {
            done(err, null);
        }
    });
};

module.exports = passportConfig;
