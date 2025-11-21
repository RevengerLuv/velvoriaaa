// models/deliveryExecutive.model.js
import mongoose from "mongoose";

const deliveryExecutiveSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    vehicleNumber: {
      type: String,
      required: true,
      trim: true
    },
    vehicleType: {
      type: String,
      required: true,
      enum: ['bike', 'scooter', 'car', 'van'],
      default: 'bike'
    },
    photo: {
      type: String // URL to profile photo
    },
    idProof: {
      type: String // URL to ID proof document
    },
    activeAreas: [{
      type: String // Pincodes
    }],
    isActive: {
      type: Boolean,
      default: true
    },
    available: {
      type: Boolean,
      default: true
    },
    currentLocation: {
      latitude: { type: Number },
      longitude: { type: Number },
      lastUpdated: { type: Date }
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    totalDeliveries: {
      type: Number,
      default: 0
    },
    completedDeliveries: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

const DeliveryExecutive = mongoose.model("DeliveryExecutive", deliveryExecutiveSchema);
export default DeliveryExecutive;