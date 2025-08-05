import passport from "./backend/config/passport.js";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./backend/config/db.js";
import authRoutes from "./backend/routes/authRoutes.js";
import authMiddleware from "./backend/middleware/authMiddleware.js";

dotenv.config(); // load environment variables from .env file

const app = express();

// protected route example: requires valid jwt token to access
app.get("/api/protected", authMiddleware, (req, res) => {
  // if token is valid, user info is attached to req.user by authMiddleware
  res.json({ message: "Access granted to protected route", user: req.user });
});

// simple logger middleware to log all incoming requests to server console
app.use((req, res, next) => {
  console.log(`incoming ${req.method} request to ${req.url}`);
  next();
});

app.use(cors()); // enable Cross-Origin Resource Sharing for all routes
app.use(express.json()); // parse incoming json requests automatically
app.use(passport.initialize()); // initialize passport authentication middleware

connectDB(); // connect to mongodb database

// mount auth-related routes under /api/auth
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 4000; // use env port or default to 4000
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});