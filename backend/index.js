import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { connectDB } from "./config/connectDB.js";
import { connectCloudinary } from "./config/cloudinary.js";

// Load environment variables first
dotenv.config();

const app = express();

// ✅ Configure CORS FIRST
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000", 
  "https://velvoriaaa.netlify.app",
  "https://velvoria-frontend.onrender.com",
  "https://velvoriaaa-1.onrender.com"
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

// Health check route
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

// DEBUG: Load routes one by one to find the problematic one
console.log('🔄 Starting route registration...');
console.log('🔍 Checking for global route usage...');

// This will catch any global route usage
const originalUse = app.use;
app.use = function(...args) {
  console.log('🔄 Global app.use() called with:', args[0]);
  return originalUse.apply(this, args);
};

// Also check router usage
const originalRouterUse = express.Router.prototype.use;
express.Router.prototype.use = function(...args) {
  console.log('🔄 Router.use() called with:', args[0]);
  return originalRouterUse.apply(this, args);
};
try {
  console.log('1. Loading admin routes...');
  const adminRoutes = await import('./routes/admin.routes.js');
  app.use("/api/admin", adminRoutes.default);
  console.log('✅ Admin routes loaded');

  console.log('2. Loading user routes...');
  const userRoutes = await import('./routes/user.routes.js');
  app.use("/api/user", userRoutes.default);
  console.log('✅ User routes loaded');

  console.log('3. Loading seller routes...');
  const sellerRoutes = await import('./routes/seller.routes.js');
  app.use("/api/seller", sellerRoutes.default);
  console.log('✅ Seller routes loaded');

  console.log('4. Loading product routes...');
  const productRoutes = await import('./routes/product.routes.js');
  app.use("/api/product", productRoutes.default);
  console.log('✅ Product routes loaded');

  console.log('5. Loading cart routes...');
  const cartRoutes = await import('./routes/cart.routes.js');
  app.use("/api/cart", cartRoutes.default);
  console.log('✅ Cart routes loaded');

  console.log('6. Loading address routes...');
  const addressRoutes = await import('./routes/address.routes.js');
  app.use("/api/address", addressRoutes.default);
  console.log('✅ Address routes loaded');

  console.log('7. Loading order routes...');
  const orderRoutes = await import('./routes/order.routes.js');
  app.use("/api/orders", orderRoutes.default);
  console.log('✅ Order routes loaded');

  console.log('8. Loading payment routes...');
  const paymentRoutes = await import('./routes/payment.routes.js');
  app.use("/api/payment", paymentRoutes.default);
  console.log('✅ Payment routes loaded');

  console.log('9. Loading analytics routes...');
  const analyticsRoutes = await import('./routes/analytics.routes.js');
  app.use("/api/analytics", analyticsRoutes.default);
  console.log('✅ Analytics routes loaded');

  console.log('🎉 All routes loaded successfully!');

} catch (error) {
  console.error('❌ ERROR loading routes:', error);
  process.exit(1);
}

// Add this AFTER your API routes to catch 404s
app.use("/api", (req, res) => {
  console.log(`❌ API Route Not Found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    message: "API route not found",
    path: req.originalUrl,
  });
});


// Connect to services and start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    await connectCloudinary();

    app.listen(PORT, '0.0.0.0', () => {
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
