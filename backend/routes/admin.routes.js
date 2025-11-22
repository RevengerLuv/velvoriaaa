import express from "express";
import { authSeller } from "../middlewares/authSeller.js";
import { adminRateLimiter, enhancedAuthSeller, validateAdminInput, adminActionLogger } from "../middlewares/adminSecurity.js";
import {
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
  updateAdsCampaign,
  
  getDashboardStats,
  getUsers,
  getUserStats,
  getOrderAnalytics,
  getFinancialReports,
  createAdminUser,
  getAdminUsers,
  deleteAdminUser,
  exportData,
  importData,
  deleteAllData,
  getRealTimeStats,
  getInventory,
  updateProductStock,
  getCustomerOrders,
  updateCustomerStatus,
  getAdminProfile
} from "../controller/admin.controller.js";

const router = express.Router();

// Apply security middleware to all admin routes
router.use(adminRateLimiter);
router.use(validateAdminInput);
router.use(adminActionLogger);

// Dashboard & Analytics Routes
router.get("/dashboard", enhancedAuthSeller, getDashboardStats);
router.get("/realtime-stats", enhancedAuthSeller, getRealTimeStats);
router.get("/profile", enhancedAuthSeller, getAdminProfile);
router.get("/order-analytics", enhancedAuthSeller, getOrderAnalytics);
router.get("/financial-reports", enhancedAuthSeller, getFinancialReports);

// Customer Management Routes
router.get("/users", enhancedAuthSeller, getUsers);
router.get("/user-stats", enhancedAuthSeller, getUserStats);
router.get("/customers/:customerId/orders", enhancedAuthSeller, getCustomerOrders);

router.put("/customers/:customerId/status", enhancedAuthSeller, updateCustomerStatus);

// Inventory Management Routes
router.get("/inventory", enhancedAuthSeller, getInventory);
router.put("/inventory/:id", enhancedAuthSeller, updateProductStock);

// Admin Management Routes
router.post("/create-admin", enhancedAuthSeller, createAdminUser);
router.get("/admin-users", enhancedAuthSeller, getAdminUsers);
router.delete("/admin-users/:id", enhancedAuthSeller, deleteAdminUser)

// Data Management Routes
router.get("/export-data", enhancedAuthSeller, exportData);
router.post("/import-data", enhancedAuthSeller, importData);
router.delete("/clear-data", enhancedAuthSeller, deleteAllData);

// Settings Routes
router.get("/settings", enhancedAuthSeller, getSettings);
router.put("/settings", enhancedAuthSeller, updateSettings);

// Reviews Routes
router.get("/reviews", enhancedAuthSeller, getReviews);
router.put("/reviews/:id", enhancedAuthSeller, updateReviewStatus);
router.post("/reviews/:id/reply", enhancedAuthSeller, addReviewReply);

// Invoices Routes
router.get("/invoices", enhancedAuthSeller, getInvoices);
router.post("/invoices/generate", enhancedAuthSeller, generateInvoice);

// Funds Routes
router.get("/funds", enhancedAuthSeller, getFundsData);
router.post("/funds/withdraw", enhancedAuthSeller, withdrawFunds);

// Ads Routes
router.get("/ads", enhancedAuthSeller, getAdsCampaigns);
router.post("/ads", enhancedAuthSeller, createAdsCampaign);
router.put("/ads/:id", enhancedAuthSeller, updateAdsCampaign);

export default router;
