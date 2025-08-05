import mongoose from "mongoose";

// async function to connect to MongoDB using connection string from environment variables
const connectDB = async () => {
  // get the mongo uri from env variables
  const uri = process.env.MONGO_URI;

  // check if uri is missing or not a string, then log error and exit process
  if (!uri || typeof uri !== "string") {
    console.error("mongodb connection string is not defined or invalid.");
    process.exit(1);
  }

  try {
    // attempt to connect to mongodb with mongoose
    await mongoose.connect(uri);
    console.log("mongodb connected successfully");
  } catch (error) {
    // if connection fails, log the error and exit process
    console.error("mongodb connection error:", error);
    process.exit(1);
  }
};

export default connectDB;