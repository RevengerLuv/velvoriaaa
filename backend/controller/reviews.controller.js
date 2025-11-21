// controller/reviews.controller.js
import Review from "../models/Review.model.js";
import Product from "../models/product.model.js";
import User from "../models/user.model.js";

// Get all reviews with population
export const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate('user', 'name email')
      .populate('product', 'name images')
      .sort({ createdAt: -1 });

    res.json({ success: true, reviews });
  } catch (error) {
    console.error("Reviews fetch error:", error);
    res.status(500).json({ success: false, message: "Error fetching reviews" });
  }
};

// Update review status
export const updateReviewStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const review = await Review.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate('user', 'name email').populate('product', 'name');

    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }

    res.json({ success: true, review, message: `Review ${status}` });
  } catch (error) {
    console.error("Review update error:", error);
    res.status(500).json({ success: false, message: "Error updating review" });
  }
};

// Add reply to review
export const addReviewReply = async (req, res) => {
  try {
    const { id } = req.params;
    const { reply } = req.body;

    const review = await Review.findByIdAndUpdate(
      id,
      { 
        reply: {
          text: reply,
          repliedAt: new Date()
        }
      },
      { new: true }
    ).populate('user', 'name email').populate('product', 'name');

    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }

    res.json({ success: true, review, message: "Reply added successfully" });
  } catch (error) {
    console.error("Review reply error:", error);
    res.status(500).json({ success: false, message: "Error adding reply" });
  }
};