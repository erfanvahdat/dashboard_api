import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import User from '../mongoose/schemas/userschemas.mjs'; // Import User model
import { hashpassword, comparepassword } from '../utils/hash.mjs'; // Hashing utilities

// Serialize user information to store in session
passport.serializeUser((user, done) => {
  console.log("Inside Serialize User:", user._id);
  done(null, user._id); // Store user ID in session
});

// Deserialize user by retrieving user info from the database
passport.deserializeUser(async (id, done) => {
  console.log("Inside Deserialize User");
  try {
    const findUser = await User.findById(id); // Fetch the user by ID
    if (!findUser) {
      return done(new Error('User not found!'), null);
    }
    done(null, findUser); // User found, attach to request
  } catch (err) {
    console.log(`Error during deserialization: ${err.message}`);
    done(err, null); // Pass error to Passport
  }
});

// Local Strategy for authenticating users
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      console.log(`Attempting login: Username: ${username}`);

      // Find user by username
      const user = await User.findOne({ username });

      if (!user) {
        console.log(`User not found: ${username}`);
        return done(null, false, { message: 'User not found' });
      }

    
      // Compare password
      const isMatch = await comparepassword(password, user.password);
      if (!isMatch) {
        console.log(`Password mismatch for user: ${username}`);
        return done(null, false); // Password mismatch
      }

      // User authenticated successfully
      console.log(`User authenticated successfully: ${username}`);
      return done(null, user);
    } catch (err) {
      console.log(`Error during authentication: ${err.message}`);
      return done(err, null); // Handle errors
    }
  })
);
