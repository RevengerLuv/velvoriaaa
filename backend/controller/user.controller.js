import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client("233054564282-9bkk084dbqombdtinrbpdn9utmd1636k.apps.googleusercontent.com");

// Register user
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Please fill all the fields", success: false });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists", success: false });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const userName = `user_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;

    const user = new User({
      name,
      email,
      password: hashedPassword,
      userName: userName,
    });
    
    await user.save();
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    
    res.status(201).json({
      message: "User registered successfully",
      success: true,
      user: {
        name: user.name,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    console.error("Error in registerUser:", error);
    
    if (error.code === 11000 && error.keyPattern && error.keyPattern.userName) {
      return res.status(400).json({ 
        message: "Registration failed due to technical issue. Please try again.",
        success: false 
      });
    }
    
    res.status(500).json({ message: "Internal server error" });
  }
};

// Login user
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please fill all the fields", success: false });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "User does not exist", success: false });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Invalid credentials", success: false });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(200).json({
      message: "Logged in successfull",
      success: true,
      user: {
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Error in loginUser:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Check auth
export const checkAuth = async (req, res) => {
  try {
    const userId = req.user;

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Error in checkAuth:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Google auth
export const googleAuth = async (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Google token is required"
      });
    }

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: "233054564282-9bkk084dbqombdtinrbpdn9utmd1636k.apps.googleusercontent.com"
    });
    
    const payload = ticket.getPayload();
    
    let user = await User.findOne({ email: payload.email });
    
    if (!user) {
      user = new User({
        name: payload.name,
        email: payload.email,
        profilePicture: payload.picture,
        isGoogleAuth: true,
        isActive: true
      });
      await user.save();
    }

    const authToken = jwt.sign(
      { _id: user._id }, 
      process.env.JWT_SECRET, 
      { expiresIn: '7d' }
    );
    
    res.cookie('token', authToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({
      success: true,
      message: 'Google authentication successful',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture,
        isGoogleAuth: user.isGoogleAuth,
        cartItems: user.cartItems || {}
      },
      token: authToken
    });
    
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(500).json({
      success: false,
      message: 'Google authentication failed'
    });
  }
};

// Update user profile
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user;
    const { name, phone } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { 
        name,
        phone 
      },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.json({
      success: true,
      message: "Profile updated successfully",
      user
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

// Change password
// Change password - FIXED VERSION
export const changePassword = async (req, res) => {
  try {
    const userId = req.user;
    const { currentPassword, newPassword } = req.body;

    // Find user without modifying
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Check if user has password (not Google auth)
    if (!user.password) {
      return res.status(400).json({
        success: false,
        message: "Google authenticated users cannot change password here"
      });
    }

    // Check current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect"
      });
    }

    // Hash new password and update only password field
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Use findByIdAndUpdate to avoid validation issues
    await User.findByIdAndUpdate(
      userId,
      { password: hashedPassword },
      { runValidators: false } // Skip validation for password change
    );

    res.json({
      success: true,
      message: "Password changed successfully"
    });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

// Save user location
export const saveUserLocation = async (req, res) => {
  try {
    const userId = req.user;
    const { latitude, longitude, address } = req.body;

    await User.findByIdAndUpdate(
      userId,
      { 
        location: { latitude, longitude },
        savedLocation: address
      },
      { new: true }
    );

    res.json({
      success: true,
      message: "Location saved successfully"
    });
  } catch (error) {
    console.error("Error saving location:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

// Logout user
export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "Strict",
    });
    return res.status(200).json({
      message: "Logged out successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error in logout:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};