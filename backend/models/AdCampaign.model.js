// backend/models/AdCampaign.model.js
import mongoose from "mongoose";

const adCampaignSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  platform: {
    type: String,
    enum: ['facebook', 'instagram', 'google', 'pinterest'],
    required: true
  },
  status: {
    type: String,
    enum: ['draft', 'active', 'paused', 'completed', 'cancelled'],
    default: 'draft'
  },
  budget: {
    type: Number,
    required: true
  },
  spent: {
    type: Number,
    default: 0
  },
  duration: Number,
  startDate: Date,
  endDate: Date,
  target: {
    type: String,
    enum: ['conversions', 'traffic', 'engagement', 'awareness']
  },
  metrics: {
    impressions: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 },
    conversions: { type: Number, default: 0 },
    ctr: { type: Number, default: 0 },
    cpc: { type: Number, default: 0 }
  }
}, {
  timestamps: true
});

export default mongoose.model('AdCampaign', adCampaignSchema);