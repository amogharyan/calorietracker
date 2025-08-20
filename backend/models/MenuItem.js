import mongoose from 'mongoose';

const nutritionSchema = new mongoose.Schema(
  {
    calories: { type: Number, required: true, min: 0 },
    protein: { type: Number, default: 0, min: 0 },
    carbs: { type: Number, default: 0, min: 0 },
    fat: { type: Number, default: 0, min: 0 },
    fiber: { type: Number, default: 0, min: 0 },
    sugar: { type: Number, default: 0, min: 0 },
    sodium: { type: Number, default: 0, min: 0 }, // mg
    servingSize: { type: String, default: '1 serving' }, // original serving-size string
  },
  {
    _id: false,
  }
);

const menuItemSchema = new mongoose.Schema(
  {
    // canonicalized name used for deduplication and fuzzy lookups
    canonicalName:
    {
      type: String,
      trim: true,
      lowercase: true,
      index: true,
    },

    name:
    {
      type: String,
      required: [true, 'Menu item name is required'],
      trim: true,
      maxlength: [100, 'Menu item name cannot exceed 100 characters'],
    },

    description:
    {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },

    category:
    {
      type: String,
      enum: ['appetizer', 'main-course', 'dessert', 'beverage', 'side', 'snack', 'salad', 'soup'],
      required: true,
    },

    // nested nutrition block (keep as-is for detailed nutrients)
    nutrition:
    {
      type: nutritionSchema,
      required: true,
    },

    // canonical confidence value for calorie/metadata reliability (0-1)
    confidence:
    {
      type: Number,
      min: 0,
      max: 1,
      default: 1,
    },

    // legacy/compatibility score previously used in codebase
    confidenceScore:
    {
      type: Number,
      min: 0,
      max: 1,
      default: 1,
    },

    allergens:
    [
      {
        type: String,
        enum: ['dairy', 'eggs', 'fish', 'shellfish', 'nuts', 'peanuts', 'soy', 'wheat', 'gluten'],
      }
    ],

    dietaryTags:
    [
      {
        type: String,
        enum: ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'nut-free', 'keto', 'paleo', 'low-sodium', 'organic'],
      }
    ],

    restaurant:
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: true,
    },

    price:
    {
      type: Number,
      min: 0,
    },

    availability:
    {
      type: String,
      enum: ['breakfast', 'lunch', 'dinner', 'all-day'],
      default: 'all-day',
    },

    isActive:
    {
      type: Boolean,
      default: true,
    },

    lastUpdated:
    {
      type: Date,
      default: Date.now,
    },

    lastScraped:
    {
      type: Date,
      default: Date.now,
    },

    // url where the item was found
    sourceUrl:
    {
      type: String,
      trim: true,
    },

    imageUrl:
    {
      type: String,
      trim: true,
    },

    // serving size numeric + unit for normalized calorie calculations (e.g., 1.5, 'cup')
    servingSize:
    {
      type: Number,
      min: 0,
    },

    servingUnit:
    {
      type: String,
      trim: true,
    },

    // origin of calorie data
    caloriesSource:
    {
      type: String,
      enum: ['scraper', 'usda', 'manual'],
      default: 'scraper',
    },

    // checksum/hash of the raw html used to detect content changes
    rawHtmlHash:
    {
      type: String,
      trim: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// combined text index for name / description / dietary tags to support search
menuItemSchema.index(
  {
    name: 'text',
    description: 'text',
    dietaryTags: 'text',
  }
);

// compound and single-field indexes for common queries
menuItemSchema.index({ restaurant: 1, category: 1 });
menuItemSchema.index({ dietaryTags: 1 });
menuItemSchema.index({ isActive: 1, availability: 1 });
menuItemSchema.index({ 'nutrition.calories': 1 });
menuItemSchema.index({ canonicalName: 1 });
menuItemSchema.index({ rawHtmlHash: 1 });

export const MenuItem = mongoose.models.MenuItem || mongoose.model('MenuItem', menuItemSchema);