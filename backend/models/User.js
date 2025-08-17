// backend/models/User.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [50, 'Name cannot be more than 50 characters'],
      validate: {
        validator: (v) => /^[a-zA-Z\s]+$/.test(v),
        message: 'Name can only contain letters and spaces',
      },
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
        message: (props) => `${props.value} is not a valid email address`,
      },
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: [8, 'Password must be at least 8 characters'],
      validate: {
        validator: function(v) {
          // Skip validation for already hashed passwords
          if (this.isModified('password') && !v.startsWith('$2')) {
            return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(v);
          }
          return true;
        },
        message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
      },
    },
    avatar: {
      type: String,
      default: null,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: {
      type: String,
      default: null,
    },
    passwordResetToken: {
      type: String,
      default: null,
    },
    passwordResetExpires: {
      type: Date,
      default: null,
    },
    lastLogin: {
      type: Date,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    preferences: {
      dietaryRestrictions: {
        type: [String],
        enum: ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'nut-free', 'keto', 'paleo', 'low-sodium'],
        default: [],
      },
      dailyCalorieGoal: {
        type: Number,
        default: 2000,
        min: [1000, 'Daily calorie goal must be at least 1000'],
        max: [5000, 'Daily calorie goal cannot exceed 5000'],
      },
      preferredCuisine: {
        type: String,
        enum: ['american', 'italian', 'chinese', 'mexican', 'indian', 'japanese', 'mediterranean'],
        default: 'american',
      },
      activityLevel: {
        type: String,
        enum: ['sedentary', 'lightly-active', 'moderately-active', 'very-active', 'extremely-active'],
        default: 'moderately-active',
      },
      notificationsEnabled: {
        type: Boolean,
        default: true,
      },
      theme: {
        type: String,
        enum: ['light', 'dark', 'auto'],
        default: 'auto',
      },
    },
    profile: {
      age: {
        type: Number,
        min: [13, 'Must be at least 13 years old'],
        max: [120, 'Age cannot exceed 120'],
      },
      profilePicture: {
        type: String,
        default: null,
      },
      bio: {
        type: String,
        maxlength: [250, 'Bio cannot exceed 250 characters'],
        default: '',
      },
      gender: {
        type: String,
        enum: ['male', 'female', 'other', 'prefer-not-to-say'],
      },
      height: {
        value: Number,
        unit: {
          type: String,
          enum: ['cm', 'ft'],
          default: 'ft',
        },
      },
      weight: {
        value: Number,
        unit: {
          type: String,
          enum: ['kg', 'lbs'],
          default: 'lbs',
        },
      },
      goalWeight: {
        value: Number,
        unit: {
          type: String,
          enum: ['kg', 'lbs'],
          default: 'lbs',
        },
      },
    },
    mealPlan: {
      type: {
        type: String,
        enum: ['unlimited', 'premium', 'standard', 'basic'],
        default: 'standard',
      },
      swipesRemaining: {
        type: Number,
        default: 14,
      },
      flexDollars: {
        type: Number,
        default: 150.00,
      },
      flexplusDollars: {
        type: Number,
        default: 150.00,
      },
      weeklySwipeReset: {
        type: Date,
        default: () => {
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
    toJSON: {
      transform: function(doc, ret) {
        delete ret.password;
        delete ret.passwordResetToken;
        delete ret.passwordResetExpires;
        delete ret.emailVerificationToken;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Indexes for performance
userSchema.index({ isActive: 1 });
userSchema.index({ lastLogin: -1 });
userSchema.index({ createdAt: -1 });
userSchema.index({ email: 1, isActive: 1 });

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  if (this.password.startsWith('$2')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Instance methods
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Password comparison failed');
  }
};

userSchema.methods.updateLastLogin = function() {
  this.lastLogin = new Date();
  return this.save({ validateBeforeSave: false });
};

// Static methods
userSchema.statics.findActiveUsers = function() {
  return this.find({ isActive: true });
};

userSchema.statics.findByEmail = function(email) {
  return this.findOne({ 
    email: email.toLowerCase().trim(),
    isActive: true 
  });
};

// Virtual for profile completion percentage
userSchema.virtual('profileCompletion').get(function() {
  let completion = 0;
  const fields = ['name', 'email', 'preferences.dailyCalorieGoal', 'profile.age', 'profile.height.value', 'profile.weight.value'];
  fields.forEach(field => {
    const value = field.split('.').reduce((obj, key) => obj?.[key], this);
    if (value !== undefined && value !== null && value !== '') {
      completion += 1;
    }
  });
  return Math.round((completion / fields.length) * 100);
});

// Export the model
const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;