import mongoose from 'mongoose';

const scrapeLogSchema = new mongoose.Schema(
{
  restaurantId: 
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true,
  },

  status: 
  {
    type: String,
    enum: ['success', 'failed', 'partial'],
    required: true,
  },
  itemsScraped: { type: Number, default: 0 },
  itemsUpdated: { type: Number, default: 0 },
  itemsAdded: { type: Number, default: 0 },

  errors: [
  {
    message: { type: String, trim: true },
    url: { type: String, trim: true },
    timestamp: { type: Date, default: Date.now },
  }],
  duration: { type: Number, min: 0 },
  sourceUrl: 
  {
    type: String,
    required: true,
    match: /^https?:\/\/.+$/i,
  },
  userAgent: { type: String, trim: true },
  metadata: 
  {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
  },
}, 
{
  timestamps: true,
});

scrapeLogSchema.pre('save', function (next) 
{
  if (this.errors && this.errors.length > 50) 
  {
    this.errors = this.errors.slice(0, 50);
  }
  next();
});

scrapeLogSchema.index({ restaurantId: 1, createdAt: -1 });
scrapeLogSchema.index({ status: 1 });
scrapeLogSchema.index({ createdAt: -1 });

export const ScrapeLog = mongoose.models.ScrapeLog || mongoose.model('ScrapeLog', scrapeLogSchema);