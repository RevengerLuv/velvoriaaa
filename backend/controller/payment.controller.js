import Razorpay from "razorpay";
import crypto from "crypto";
import dotenv from 'dotenv';
dotenv.config();

// Initialize Razorpay with better error handling
let razorpay;
try {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error("Razorpay credentials are missing in environment variables");
  }
  
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
  console.log("✅ Razorpay initialized successfully for INR");
} catch (error) {
  console.error("❌ Razorpay initialization failed:", error.message);
  // Don't throw here, let the application start but payment will fail
}

// Create Razorpay order - COMPLETELY FIXED
export const createRazorpayOrder = async (req, res) => {
  try {
    const { amount, currency = "INR" } = req.body;
    
    console.log("💰 Creating Razorpay order with amount:", amount);

    // Check if Razorpay is initialized
    if (!razorpay) {
      return res.status(500).json({
        success: false,
        message: "Payment service is temporarily unavailable"
      });
    }

    // Enhanced validation
    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Valid amount is required"
      });
    }

    if (currency !== "INR") {
      return res.status(400).json({
        success: false,
        message: "Only INR currency is supported"
      });
    }

    // Convert to paise (1 INR = 100 paise)
    const amountInPaise = Math.round(amount * 100);

    // Validate minimum amount (Razorpay requires minimum 1 INR)
    if (amountInPaise < 100) {
      return res.status(400).json({
        success: false,
        message: "Minimum payment amount is ₹1"
      });
    }

    console.log("💰 Amount conversion:", {
      originalRupees: amount,
      inPaise: amountInPaise,
      currency: "INR"
    });

    const options = {
      amount: amountInPaise, // This should be in paise
      currency: "INR",
      receipt: `receipt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      payment_capture: 1, // Auto capture payment
      notes: {
        userId: req.user?._id || "unknown",
        originalAmount: amount, // Store original amount in rupees
        purpose: "crochet_product_purchase"
      }
    };

    console.log("🔄 Razorpay order options:", options);

    const order = await razorpay.orders.create(options);
    
    console.log("✅ Razorpay order created successfully:", {
      orderId: order.id,
      amountInPaise: order.amount,
      originalAmountInRupees: amount,
      currency: order.currency
    });
    
    res.json({
      success: true,
      orderId: order.id,
      amount: amount, // Send back original amount in rupees for frontend
      amountInPaise: order.amount, // This is in paise for Razorpay
      currency: order.currency,
    });
  } catch (error) {
    console.error("❌ Razorpay order creation error:", error);
    
    let errorMessage = "Failed to create payment order";
    let statusCode = 500;
    
    if (error.error && error.error.description) {
      errorMessage = error.error.description;
      statusCode = 400;
    } else if (error.message.includes("key_secret")) {
      errorMessage = "Payment configuration error. Please contact support.";
      statusCode = 500;
    }
    
    res.status(statusCode).json({
      success: false,
      message: errorMessage,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Verify payment
export const verifyPayment = async (req, res) => {
  console.log("🔐 Payment verification request received");
  
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature 
    } = req.body;

    // Validate required fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      console.error("❌ Missing required fields for verification");
      return res.status(400).json({
        success: false,
        message: "Missing required payment parameters"
      });
    }

    // Check if Razorpay key secret is available
    if (!process.env.RAZORPAY_KEY_SECRET) {
      console.error("❌ Razorpay key secret not configured");
      return res.status(500).json({
        success: false,
        message: "Payment verification service unavailable"
      });
    }

    // Generate expected signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    console.log("🔐 Signature verification:", {
      receivedSignature: razorpay_signature?.substring(0, 10) + "...",
      expectedSignature: expectedSignature?.substring(0, 10) + "...",
      match: expectedSignature === razorpay_signature
    });

    if (expectedSignature === razorpay_signature) {
      console.log("✅ Payment verified successfully:", {
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id
      });
      
      res.json({
        success: true,
        message: "Payment verified successfully",
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        currency: "INR"
      });
    } else {
      console.error("❌ Signature verification failed");
      res.status(400).json({
        success: false,
        message: "Payment verification failed - Invalid signature",
      });
    }
  } catch (error) {
    console.error("❌ Payment verification error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error during payment verification",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Health check for payment service
export const paymentHealthCheck = async (req, res) => {
  try {
    const isHealthy = !!razorpay;
    res.json({
      success: true,
      healthy: isHealthy,
      currency: "INR",
      service: "Razorpay"
    });
  } catch (error) {
    res.json({
      success: false,
      healthy: false,
      error: error.message
    });
  }
};