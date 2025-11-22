import express from "express";
import {
  checkAuth,
  sellerLogin,
  sellerLogout,
} from "../controller/seller.controller.js";
import { authSeller } from "../middlewares/authSeller.js";
import { 
  getDashboardStats, 
  getRealTimeStats,
  getOrderAnalytics 
} from "../controller/admin.controller.js"; // Import admin functions

const router = express.Router();

// Authentication routes
router.post("/login", sellerLogin);
router.get("/is-auth", authSeller, checkAuth);
router.get("/logout", authSeller, sellerLogout);

// ADD THESE SELLER DASHBOARD ROUTES:
router.get("/dashboard", authSeller, getDashboardStats);
router.get("/realtime-stats", authSeller, getRealTimeStats);
router.get("/analytics", authSeller, getOrderAnalytics);

export default router;
