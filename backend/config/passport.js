import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import User from "../models/User.js"; // user model for db queries
import bcrypt from "bcrypt";

// configure passport to use local strategy for login authentication
passport.use(
  new LocalStrategy(
    { usernameField: "email" }, // use email instead of username field
    async (email, password, done) => {
      try {
        // find user by email
        const user = await User.findOne({ email });
        if (!user) {
          // no user found with that email
          return done(null, false, { message: "incorrect email." });
        }

        // compare provided password with hashed password in db
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          // password does not match
          return done(null, false, { message: "incorrect password." });
        }

        // authentication successful, return user object
        return done(null, user);
      } catch (err) {
        // error during database query or bcrypt comparison
        return done(err);
      }
    }
  )
);

// note: serializeUser and deserializeUser can be added here if using sessions

export default passport;