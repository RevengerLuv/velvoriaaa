import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { connectDB } from "./config/connectDB.js";
import { connectCloudinary } from "./config/cloudinary.js";

// Load environment variables first
dotenv.config();

// Route imports
import userRoutes from "./routes/user.routes.js";
import sellerRoutes from "./routes/seller.routes.js";
import productRoutes from "./routes/product.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import addressRoutes from "./routes/address.routes.js";
import orderRoutes from "./routes/order.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import analyticsRoutes from "./routes/analytics.routes.js";

const app = express();

// ✅ Configure CORS FIRST
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000", 
  "https://velvoriaaa.netlify.app",
  "https://velvoria-frontend.onrender.com",
  "https://velvoriaaa-1.onrender.com"  // ADD YOUR FRONTEND DOMAIN
];
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// ✅ Then global middlewares
app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// ✅ Then static + routes
app.use("/images", express.static("uploads"));

// Health check route (ONLY ONE - remove the duplicate)
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

// Add this BEFORE your API routes
app.use("/api/*", (req, res, next) => {
  console.log(`🔄 API Route Hit: ${req.method} ${req.originalUrl}`);
  next();
});

// API routes
app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);
app.use("/api/seller", sellerRoutes);
app.use("/api/product", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/address", addressRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/analytics", analyticsRoutes);

// Add this AFTER your API routes to catch 404s
app.use("/api/*", (req, res) => {
  console.log(`❌ API Route Not Found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ 
    success: false, 
    message: "API route not found",
    path: req.originalUrl 
  });
});

// Connect to services and start server
const PORT = process.env.PORT || 5000; // FIXED: Remove the URL

const startServer = async () => {
  try {
    await connectDB();
    await connectCloudinary();

    app.listen(PORT, '0.0.0.0', () => { // Added '0.0.0.0' for Render.com
      console.log(`✅ Server is running on port ${PORT}`);
      console.log(`✅ Database connected`);
      console.log(`✅ Cloudinary configured`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
