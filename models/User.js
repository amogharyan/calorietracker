// models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
      trim: true,
      maxlength: [50, 'Name cannot be more than 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: (v) => /^\S+@\S+\.\S+$/.test(v),
        message: (props) => `${props.value} is not a valid email`,
      },
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false,
    },
    joinedDate: {
      type: Date,
      default: Date.now,
    },
    preferences: {
      dietaryRestrictions: [
        {
          type: String,
          enum: ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'nut-free'],
        },
      ],
      dailyCalorieGoal: {
        type: Number,
        default: 2000,
      },
    },
  },
  {
    timestamps: true,
  }
);

userSchema.index({ email: 1 });

export default mongoose.models.User || mongoose.model('User', userSchema);