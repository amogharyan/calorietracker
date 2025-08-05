import mongoose from "mongoose";

// define user schema for mongodb
// contains required unique email and password fields
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// create user model based on the schema
const User = mongoose.model("User", userSchema);

// export user model for use in other parts of the app
export default User;