// order.model.js - Enhanced with delivery features
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      required: true, 
      ref: "User" 
    },
    items: [
      {
        product: { 
          type: mongoose.Schema.Types.ObjectId, 
          required: true, 
          ref: "Product" 
        },
        quantity: { type: Number, required: true },
        price: { type: Number },
        name: { type: String },
        size: { type: String },
        color: { type: String }
      },
    ],
    amount: { type: Number, required: true },
    address: { 
      type: mongoose.Schema.Types.ObjectId, 
      required: true, 
      ref: "Address" 
    },
    status: { type: String, default: "Order Placed" },
    paymentType: { type: String, required: true },
    isPaid: { type: Boolean, required: true, default: false },
    taxAmount: { type: Number, default: 0 },
    shippingFee: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    
    // Enhanced tracking system
    tracking: {
      trackingNumber: { type: String },
      carrier: { type: String },
      estimatedDelivery: { type: Date },
      actualDelivery: { type: Date },
      pickupDate: { type: Date },
      dispatchDate: { type: Date },
      outForDelivery: { type: Date }
    },
    
    // Delivery executive information
    deliveryExecutive: {
      name: { type: String },
      phone: { type: String },
      vehicleNumber: { type: String },
      photo: { type: String }
    },
    
    // Payment details
    advancePaid: { type: Number, default: 0 },
    remainingAmount: { type: Number, default: 0 },
    paymentId: { type: String },
    
    // Order timeline
    statusHistory: [{
      status: { type: String },
      timestamp: { type: Date, default: Date.now },
      note: { type: String },
      updatedBy: { type: String } // system, seller, delivery_executive
    }],
    
    // Delivery preferences
    deliveryPreferences: {
      deliverySlot: { type: String }, // morning, afternoon, evening
      deliveryInstructions: { type: String },
      safePlace: { type: String } // leave_at_door, with_security, etc.
    },
    
    // Customer notifications
    notifications: [{
      type: { type: String },
      message: { type: String },
      timestamp: { type: Date, default: Date.now },
      read: { type: Boolean, default: false }
    }],
    
    // Returns & replacements
    returnInfo: {
      isReturned: { type: Boolean, default: false },
      returnReason: { type: String },
      returnStatus: { type: String },
      returnDate: { type: Date }
    }
  },
  { timestamps: true }
);

orderSchema.pre('save', function(next) {
  if (this.isModified('status')) {
    if (!this.statusHistory) {
      this.statusHistory = [];
    }
    this.statusHistory.push({
      status: this.status,
      timestamp: new Date(),
      updatedBy: 'system'
    });
  }
  next();
});

const Order = mongoose.model("Order", orderSchema);
export default Order;