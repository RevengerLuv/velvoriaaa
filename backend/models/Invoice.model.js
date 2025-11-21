// backend/models/Invoice.model.js
import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema({
  invoiceNumber: {
    type: String,
    required: true,
    unique: true
  },
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  customer: {
    name: String,
    email: String
  },
  items: [{
    name: String,
    quantity: Number,
    price: Number,
    total: Number
  }],
  subtotal: Number,
  tax: Number,
  shipping: Number,
  total: Number,
  status: {
    type: String,
    enum: ['draft', 'sent', 'paid', 'overdue', 'cancelled'],
    default: 'draft'
  },
  dueDate: Date,
  paidDate: Date
}, {
  timestamps: true
});

export default mongoose.model('Invoice', invoiceSchema);