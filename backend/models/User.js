// models/User.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
{
  name: 
  {
    type: String,
    required: [true, 'name is required'],
    trim: true,
    minlength: [2, 'name must be at least 2 characters'],
    maxlength: [50, 'name cannot exceed 50 characters'],
    validate: 
    {
      validator: (v) => /^[a-zA-Z\s]+$/.test(v),
      message: 'name can only contain letters and spaces',
    },
  },

  email: 
  {
    type: String,
    required: [true, 'email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    validate: 
    {
      validator: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
      message: 'invalid email format',
    },
  },

  password: 
  {
    type: String,
    required: [true, 'password is required'],
    minlength: [8, 'password must be at least 8 characters'],
    select: false, // exclude from queries by default
    validate: 
    {
      validator: function(v) 
      {
        // skip validation for already hashed passwords
        if (this.isModified('password') && !v.startsWith('$2')) 
        {
          return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(v);
        }
        return true;
      },
      message: 'password must contain uppercase, lowercase, number, and special character',
    },
  },

  // authentication fields
  isEmailVerified: { type: Boolean, default: false },
  emailVerificationToken: { type: String, default: null },
  passwordResetToken: { type: String, default: null },
  passwordResetExpires: { type: Date, default: null },
  lastLogin: { type: Date, default: null },
  isActive: { type: Boolean, default: true },

  // user preferences
  preferences: 
  {
    dietaryRestrictions: 
    {
      type: [String],
      enum: ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'nut-free', 'keto', 'paleo', 'low-sodium'],
      default: [],
    },
    dailyCalorieGoal: 
    {
      type: Number,
      default: 2000,
      min: [1000, 'calorie goal must be at least 1000'],
      max: [5000, 'calorie goal cannot exceed 5000'],
    },
    activityLevel: 
    {
      type: String,
      enum: ['sedentary', 'lightly-active', 'moderately-active', 'very-active', 'extremely-active'],
      default: 'moderately-active',
    },
    notificationsEnabled: { type: Boolean, default: true },
    theme: 
    {
      type: String,
      enum: ['light', 'dark', 'auto'],
      default: 'auto',
    },
  },

  // meal plan information
  mealPlan: 
  {
    type: 
    {
      type: String,
      enum: ['unlimited', 'premium', 'standard', 'basic'],
      default: 'standard',
    },
    swipesRemaining: { type: Number, default: 14 },
    flexDollars: { type: Number, default: 150.00 },
    weeklySwipeReset: 
    {
      type: Date,
      default: () => 
      {
        const now = new Date();
        const dayOfWeek = now.getDay();
        const daysUntilSunday = dayOfWeek === 0 ? 7 : 7 - dayOfWeek;
        return new Date(now.getTime() + daysUntilSunday * 24 * 60 * 60 * 1000);
      },
    },
  },
}, 
{
  timestamps: true,
  toJSON: 
  {
    transform: function(doc, ret) 
    {
      delete ret.password;
      delete ret.passwordResetToken;
      delete ret.passwordResetExpires;
      delete ret.emailVerificationToken;
      delete ret.__v;
      return ret;
    },
  },
});

// indexes for query optimization
userSchema.index({ email: 1, isActive: 1 });
userSchema.index({ isActive: 1 });
userSchema.index({ lastLogin: -1 });
userSchema.index({ createdAt: -1 });

// pre-save middleware for password hashing
userSchema.pre('save', async function(next) 
{
  if (!this.isModified('password')) return next();
  if (this.password.startsWith('$2')) return next();
  
  try 
  {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) 
  {
    next(error);
  }
});

// instance methods
userSchema.methods.comparePassword = async function(candidatePassword) 
{
  try 
  {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) 
  {
    throw new Error('password comparison failed');
  }
};

userSchema.methods.updateLastLogin = function() 
{
  this.lastLogin = new Date();
  return this.save({ validateBeforeSave: false });
};

// static methods
userSchema.statics.findActiveUsers = function() 
{
  return this.find({ isActive: true });
};

userSchema.statics.findByEmail = function(email) 
{
  return this.findOne(
  { 
    email: email.toLowerCase().trim(),
    isActive: true 
  });
};

// virtual for profile completion percentage
userSchema.virtual('profileCompletion').get(function() 
{
  let completion = 0;
  const fields = ['name', 'email', 'preferences.dailyCalorieGoal'];
  
  fields.forEach(field => 
  {
    const value = field.split('.').reduce((obj, key) => obj?.[key], this);
    if (value !== undefined && value !== null && value !== '') 
    {
      completion += 1;
    }
  });
  
  return Math.round((completion / fields.length) * 100);
});

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;