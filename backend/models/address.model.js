import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User"
    },
    fullName: {
      type: String,
      required: true,
      trim: true
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true
    },
    alternatePhone: {
      type: String,
      trim: true
    },
    houseNo: {
      type: String,
      required: true,
      trim: true
    },
    street: {
      type: String,
      required: true,
      trim: true
    },
    landmark: {
      type: String,
      trim: true
    },
    city: {
      type: String,
      required: true,
      trim: true
    },
    state: {
      type: String,
      required: true,
      trim: true
    },
    pincode: {
      type: String,
      required: true,
      trim: true
    },
    addressType: {
      type: String,
      required: true,
      enum: ['home', 'work', 'other'],
      default: 'home'
    },
    isDefault: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

const Address = mongoose.model("Address", addressSchema);
export default Address;