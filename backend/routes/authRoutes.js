import express from "express";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import passport from "passport";
import jwt from "jsonwebtoken";
import validator from "validator";

const router = express.Router();

// route: POST /api/auth/register
// purpose: register a new user with email and password
router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    // check that both email and password are provided
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // check if email is valid format using basic regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // check if user already exists in the database
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // hash the password before storing it in the database
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // create a new user document
    const newUser = new User({
      email,
      password: hashedPassword,
    });

    await newUser.save();

    // respond with success if user is created
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    // fallback in case something goes wrong
    res.status(500).json({ message: "Server error" });
  }
});

// route: POST /api/auth/login
// purpose: authenticate a user and return a jwt token if successful
router.post("/login", (req, res, next) => {
  const { email, password } = req.body;

  // validate input presence
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  // check if email is valid format using validator package
  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  // use passport local strategy to verify credentials
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err) return next(err);

    // if no user found or credentials wrong
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // generate a jwt token with user id and email
    const payload = { id: user._id, email: user.email };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

    // respond with the token and success message
    return res.json({ token, message: "Logged in successfully" });
  })(req, res, next);
});

export default router;