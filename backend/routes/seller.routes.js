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
  getOrderAnalytics,
  getFinancialReports,
  getUsers,
  getUserStats,
  getInventory,
  updateProductStock,
  getCustomerOrders,
  updateCustomerStatus,
  getSettings,
  updateSettings,
  getReviews,
  updateReviewStatus,
  addReviewReply,
  getInvoices,
  generateInvoice,
  getFundsData,
  withdrawFunds,
  getAdsCampaigns,
  createAdsCampaign,
  updateAdsCampaign
} from "../controller/admin.controller.js";

const router = express.Router();

// Authentication routes
router.post("/login", sellerLogin);
router.get("/is-auth", authSeller, checkAuth);
router.get("/logout", authSeller, sellerLogout);

// SELLER DASHBOARD ROUTES
router.get("/dashboard", authSeller, getDashboardStats);
router.get("/realtime-stats", authSeller, getRealTimeStats);
router.get("/analytics", authSeller, getOrderAnalytics);
router.get("/financial-reports", authSeller, getFinancialReports);

// CUSTOMER MANAGEMENT
router.get("/users", authSeller, getUsers);
router.get("/user-stats", authSeller, getUserStats);
router.get("/customers/:customerId/orders", authSeller, getCustomerOrders);
router.put("/customers/:customerId/status", authSeller, updateCustomerStatus);

// INVENTORY MANAGEMENT
router.get("/inventory", authSeller, getInventory);
router.put("/inventory/:id", authSeller, updateProductStock);

// SETTINGS
router.get("/settings", authSeller, getSettings);
router.put("/settings", authSeller, updateSettings);

// REVIEWS
router.get("/reviews", authSeller, getReviews);
router.put("/reviews/:id", authSeller, updateReviewStatus);
router.post("/reviews/:id/reply", authSeller, addReviewReply);

// INVOICES
router.get("/invoices", authSeller, getInvoices);
router.post("/invoices/generate", authSeller, generateInvoice);

// FUNDS
router.get("/funds", authSeller, getFundsData);
router.post("/funds/withdraw", authSeller, withdrawFunds);

// ADS
router.get("/ads", authSeller, getAdsCampaigns);
router.post("/ads", authSeller, createAdsCampaign);
router.put("/ads/:id", authSeller, updateAdsCampaign);

export default router;
