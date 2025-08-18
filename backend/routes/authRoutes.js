import express from "express";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import passport from "passport";
import jwt from "jsonwebtoken";
import validator from "validator";

const router = express.Router();

// route: POST /api/auth/register
// purpose: register a new user with email and password
router.post("/register", async (req, res) => 
{
  try 
  {
    const { email, password } = req.body;

    // check that both email and password are provided
    if (!email || !password) 
    {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // check if email is valid format using basic regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) 
    {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // check if user already exists in the database
    const existingUser = await User.findOne({ email });
    if (existingUser) 
    {
      return res.status(400).json({ message: "User already exists" });
    }

    // hash the password before storing it in the database
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // create a new user document
    const newUser = new User(
    {
      email,
      password: hashedPassword,
    });

    await newUser.save();

    // respond with success if user is created
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) 
  {
    console.error(err);
    // fallback in case something goes wrong
    res.status(500).json({ message: "Server error" });
  }
});

router.post('/login', async (req, res) => 
{
  try 
  {
    const { email, password } = req.body;

    if (!email || !password) 
    {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) 
    {
      return res.status(400).json({ message: 'Please provide a valid email address' });
    }

    const user = await User.findOne({ email });
    if (!user) 
    {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) 
    {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) 
    {
      return res.status(500).json({ message: 'JWT secret not configured' });
    }
    const token = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: '1d' });

    return res.status(200).json(
    {
      token,
      user: 
      {
        email: user.email,
        name: user.name,
      }
    });
  } catch (err) 
  {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;