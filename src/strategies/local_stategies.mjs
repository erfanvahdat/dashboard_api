import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import User from '../mongoose/schemas/userschemas.mjs'; // Import User model
import { hashpassword,comparepassword } from '../utils/hash.mjs';


// Serialize user information to store in session
passport.serializeUser((user, done) => {
  console.log("Inside Serialize User:");
  console.log(user._id); 
  done(null, user._id); 
});

// Deserialize user by retrieving user info from the database
passport.deserializeUser(async (id, done) => {
  console.log("Inside Deserialize User");

  try {
    const findUser = await User.findById(id); // Fetch the user by _id from the database
    if (!findUser) {
      throw new Error('User not found!');
    }
    done(null, findUser); // Successfully found the user
  } catch (err) {
    console.log(`Error during deserialization: ${err.message}`);
    done(err, null); // Handle errors
  }
});

// Local Strategy for authenticating users
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      console.log(`Username: ${username}, Password: ${password}`);

      const user = await User.findOne({ username }); // Find user by username

      if (!user) return done(null, false, { message: 'User not found' }); // Return with message
      

      if(!comparepassword(password,user.password)) throw new Error ('Invalid credentials')
  
      return done(null, user); // User authenticated successfully
    } catch (err) {
      return done(err, null); // Handle errors during authentication
    }
  })
);

export default passport;
