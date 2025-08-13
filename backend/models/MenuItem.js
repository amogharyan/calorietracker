import mongoose from 'mongoose';

const nutritionSchema = new mongoose.Schema({
  calories: { type: Number, required: true, min: 0 },
  protein: { type: Number, default: 0, min: 0 },
  carbs: { type: Number, default: 0, min: 0 },
  fat: { type: Number, default: 0, min: 0 },
  fiber: { type: Number, default: 0, min: 0 },
  sugar: { type: Number, default: 0, min: 0 },
  sodium: { type: Number, default: 0, min: 0 }, // mg
  servingSize: { type: String, default: '1 serving' },
}, { _id: false });

const menuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Menu item name is required'],
    trim: true,
    maxlength: [100, 'Menu item name cannot exceed 100 characters'],
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters'],
  },
  category: {
    type: String,
    enum: ['appetizer', 'main-course', 'dessert', 'beverage', 'side', 'snack', 'salad', 'soup'],
    required: true,
  },
  nutrition: {
    type: nutritionSchema,
    required: true,
  },
  confidenceScore: {
    type: Number,
    min: 0,
    max: 1,
    default: 1,
  },
  allergens: [{
    type: String,
    enum: ['dairy', 'eggs', 'fish', 'shellfish', 'nuts', 'peanuts', 'soy', 'wheat', 'gluten'],
  }],
  dietaryTags: [{
    type: String,
    enum: ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'nut-free', 'keto', 'paleo', 'low-sodium', 'organic'],
  }],
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true,
  },
  price: {
    type: Number,
    min: 0,
  },
  availability: {
    type: String,
    enum: ['breakfast', 'lunch', 'dinner', 'all-day'],
    default: 'all-day',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
  lastScraped: {
    type: Date,
    default: Date.now,
  },
  sourceUrl: String,
  imageUrl: String,
}, {
  timestamps: true,
});

menuItemSchema.index({ name: 'text', description: 'text' });
menuItemSchema.index({ restaurant: 1, category: 1 });
menuItemSchema.index({ dietaryTags: 1 });
menuItemSchema.index({ isActive: 1, availability: 1 });
menuItemSchema.index({ 'nutrition.calories': 1 });

export const MenuItem = mongoose.models.MenuItem || mongoose.model('MenuItem', menuItemSchema);