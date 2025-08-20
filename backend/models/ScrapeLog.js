import mongoose from 'mongoose';

const scrapeLogSchema = new mongoose.Schema(
  {
    // optional pointer to restaurant record this run targeted
    restaurantId:
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
    },

    // canonical host or source identifier (domain or source slug) for scrape run
    sourceHost:
    {
      type: String,
      trim: true,
      index: true,
    },

    // start and end timestamps for scrape run
    startTime:
    {
      type: Date,
      default: Date.now,
      index: true,
    },

    endTime:
    {
      type: Date,
    },

    // duration in milliseconds computed after run
    durationMs:
    {
      type: Number,
      min: 0,
    },

    // number of items processed in run
    itemsScraped:
    {
      type: Number,
      default: 0,
      min: 0,
    },

    // number of items updated/changed (fingerprint/rawHtmlHash changes)
    fingerprintsChanged:
    {
      type: Number,
      default: 0,
      min: 0,
    },

    // number of items added in this run (new menu items)
    itemsAdded:
    {
      type: Number,
      default: 0,
      min: 0,
    },

    // capture structured errors encountered during run for debugging
    errors:
    [
      {
        message:
        {
          type: String,
          trim: true,
        },

        code:
        {
          type: String,
          trim: true,
        },

        url:
        {
          type: String,
          trim: true,
        },

        // optional serialized stack/short trace for internal debugging
        stack:
        {
          type: String,
        },

        timestamp:
        {
          type: Date,
          default: Date.now,
        },
      }
    ],

    // validated source url (if applicable) where scrape was performed
    sourceUrl:
    {
      type: String,
      match: /^https?:\/\/.+$/i,
      trim: true,
    },

    // user-agent string used by the scraper for this run (if recorded)
    userAgent:
    {
      type: String,
      trim: true,
    },

    // optional pointer to raw snapshot storage (s3 key/gcs path/local path)
    rawSnapshotKey:
    {
      type: String,
      trim: true,
    },

    // run status: started, completed, failed, partial
    status:
    {
      type: String,
      enum: ['started', 'completed', 'failed', 'partial'],
      default: 'started',
      index: true,
    },

    // arbitrary metadata (host-specific counters, rate-limit info, etc.)
    metadata:
    {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
);

// limited stored errors to most recent 50 entries to avoid unbounded arrays
scrapeLogSchema.pre('save', function (next)
{
  if (this.errors && this.errors.length > 50)
  {
    this.errors = this.errors.slice(0, 50);
  }
  next();
});

// indexes for common queries: recent runs by restaurant/host and status
scrapeLogSchema.index({ restaurantId: 1, startTime: -1 });
scrapeLogSchema.index({ sourceHost: 1, startTime: -1 });
scrapeLogSchema.index({ status: 1, startTime: -1 });
scrapeLogSchema.index({ createdAt: -1 });

export const ScrapeLog = mongoose.models.ScrapeLog || mongoose.model('ScrapeLog', scrapeLogSchema);