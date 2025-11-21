import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      default: ""
    },
    password: {
      type: String,
    },
    location: {
      latitude: { type: Number },
      longitude: { type: Number }
    },
    savedLocation: {
      type: String,
      default: "",
    },
    userName: {
      type: String,
      unique: true,
      sparse: true
    },
    isGoogleAuth: {
      type: Boolean,
      default: false
    },
    profilePicture: {
      type: String,
      default: ""
    },
    lastLogin: {
      type: Date,
      default: Date.now
    },
    isActive: {
      type: Boolean,
      default: true
    },
    cartItems: { type: Object, default: {} },
  },
  { minimize: false }
);

const User = mongoose.model("User", userSchema);
export default User;