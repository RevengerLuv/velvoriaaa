// index.js
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { connectDB } from "./config/connectDB.js";
import { connectCloudinary } from "./config/cloudinary.js";

dotenv.config();

const app = express();

// Trust proxy for proper req.secure and client IP behind Render
app.set("trust proxy", 1);

// CORS - be explicit and allow credentials
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://velvoriaaa.netlify.app",
  "https://velvoria-frontend.onrender.com",
  "https://velvoriaaa-1.onrender.com",
  "https://velvoriaaa.onrender.com"
];

app.use(cors({
  origin: function (origin, callback) {
    // allow non-browser (no origin) requests
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("CORS Not Allowed"));
  },
  credentials: true,
}));

app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.use("/images", express.static("uploads"));

app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running", timestamp: new Date().toISOString() });
});

// Import routes
try {
  const adminRoutes = await import('./routes/admin.routes.js'); // if exists
  app.use('/api/admin', adminRoutes.default);
} catch (e) {
  // optional
}

try {
  const userRoutes = await import('./routes/user.routes.js');
  app.use('/api/user', userRoutes.default);
} catch (e) {}

try {
  const sellerRoutes = await import('./routes/seller.routes.js');
  app.use('/api/seller', sellerRoutes.default);
} catch (e) {}

try {
  const productRoutes = await import('./routes/product.routes.js');
  app.use('/api/product', productRoutes.default);
} catch (e) {}

try {
  const cartRoutes = await import('./routes/cart.routes.js');
  app.use('/api/cart', cartRoutes.default);
} catch (e) {}

try {
  const addressRoutes = await import('./routes/address.routes.js');
  app.use('/api/address', addressRoutes.default);
} catch (e) {}

try {
  const orderRoutes = await import('./routes/order.routes.js');
  app.use('/api/orders', orderRoutes.default);
} catch (e) {}

try {
  const paymentRoutes = await import('./routes/payment.routes.js');
  app.use('/api/payment', paymentRoutes.default);
} catch (e) {}

try {
  const analyticsRoutes = await import('./routes/analytics.routes.js');
  app.use('/api/analytics', analyticsRoutes.default);
} catch (e) {}

app.use('/api', (req, res) => {
  console.log(`❌ API Route Not Found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ success: false, message: 'API route not found', path: req.originalUrl });
});

const PORT = process.env.PORT || 5000;
const startServer = async () => {
  try {
    await connectDB();
    await connectCloudinary();
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`✅ Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
