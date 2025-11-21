// backend/models/Setting.model.js
import mongoose from "mongoose";

const settingSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true
  },
  value: mongoose.Schema.Types.Mixed,
  category: {
    type: String,
    enum: ['general', 'payment', 'shipping', 'notifications', 'security']
  }
}, {
  timestamps: true
});

export default mongoose.model('Setting', settingSchema);