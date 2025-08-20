import mongoose from 'mongoose';

const restaurantSchema = new mongoose.Schema(
  {
    name:
    {
      type: String,
      required: [true, 'Restaurant name is required'],
      trim: true,
      unique: true,
    },

    description:
    {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },

    // physical location metadata (human-readable address + building/floor)
    // keep address required for display and routing purposes
    location:
    {
      address:
      {
        type: String,
        required: true,
        trim: true,
      },

      building:
      {
        type: String,
        trim: true,
      },

      floor:
      {
        type: String,
        trim: true,
      },

      // geojson point used for proximity queries
      // structure: { type: 'Point', coordinates: [lon, lat] }
      geo:
      {
        type:
        {
          type: String,
          enum: ['Point'],
          default: 'Point',
        },

        coordinates:
        {
          type: [Number], // [longitude, latitude]
          validate:
          {
            validator: arr => Array.isArray(arr) && arr.length === 2,
            message: props => `${props.value} is not a valid geo coordinate pair`,
          },
        },
      },

      // legacy numeric coordinate fields preserved for compatibility/debugging
      coordinates:
      {
        latitude:
        {
          type: Number,
          min: -90,
          max: 90,
        },

        longitude:
        {
          type: Number,
          min: -180,
          max: 180,
        },
      },
    },

    contact:
    {
      phone:
      {
        type: String,
        validate:
        {
          validator: v => /^\+?[\d\s\-()]{7,}$/.test(v),
          message: props => `${props.value} is not a valid phone number`,
        },
      },

      email:
      {
        type: String,
        lowercase: true,
        trim: true,
        validate:
        {
          validator: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
          message: props => `${props.value} is not a valid email`,
        },
      },

      website:
      {
        type: String,
        trim: true,
        validate:
        {
          validator: v => /^https?:\/\/\S+$/.test(v),
          message: props => `${props.value} is not a valid URL`,
        },
      },
    },

    hours:
    {
      monday:
      {
        open: String,
        close: String,
      },

      tuesday:
      {
        open: String,
        close: String,
      },

      wednesday:
      {
        open: String,
        close: String,
      },

      thursday:
      {
        open: String,
        close: String,
      },

      friday:
      {
        open: String,
        close: String,
      },

      saturday:
      {
        open: String,
        close: String,
      },

      sunday:
      {
        open: String,
        close: String,
      },
    },

    cuisine:
    [
      {
        type: String,
        enum: ['american', 'italian', 'mexican', 'chinese', 'indian', 'mediterranean', 'thai', 'japanese', 'korean', 'other'],
        default: 'other',
      }
    ],

    priceRange:
    {
      type: String,
      enum: ['$', '$$', '$$$', '$$$$'],
      default: '$$',
    },

    acceptsMealPlan:
    {
      type: Boolean,
      default: true,
    },

    acceptsFlexDollars:
    {
      type: Boolean,
      default: true,
    },

    rating:
    {
      average:
      {
        type: Number,
        min: 0,
        max: 5,
        default: 0,
      },

      count:
      {
        type: Number,
        default: 0,
      },
    },

    reviews:
    [
      {
        userId:
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },

        rating:
        {
          type: Number,
          min: 1,
          max: 5,
        },

        comment:
        {
          type: String,
          maxlength: 500,
        },

        createdAt:
        {
          type: Date,
          default: Date.now,
        },
      }
    ],

    isActive:
    {
      type: Boolean,
      default: true,
    },

    // timestamp of most recent successful menu scrape for this restaurant
    lastScraped:
    {
      type: Date,
      default: Date.now,
    },

    // timestamp for last manual/menu metadata update (preserve original field name)
    lastMenuUpdate:
    {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// standard indexes for common lookups
restaurantSchema.index({ name: 1 });
restaurantSchema.index({ 'location.building': 1 });
restaurantSchema.index({ cuisine: 1 });
restaurantSchema.index({ isActive: 1 });

// geo index to enable proximity queries (requires geo to be a geojson point)
restaurantSchema.index({ 'location.geo': '2dsphere' });

export default mongoose.models.Restaurant || mongoose.model('Restaurant', restaurantSchema);