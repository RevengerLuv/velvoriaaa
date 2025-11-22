// order.routes.js - Enhanced Version
import express from "express";
import authUser from "../middlewares/authUser.js";
import { authSeller } from "../../middlewares/authSeller.js";
import {
  getAllOrders,
  getUserOrders,
  placeOrderCOD,
  updateOrderStatus,
  deleteOrder,
  placeOrderRazorpay,
  testOrders,
  placeOrderCODAdvance,
  
  addTrackingInfo,
  sendCustomerNotification,
  getOrderAnalytics
} from "../controller/order.controller.js";

const router = express.Router();

// Test route
router.get("/test-populate", authUser, testOrders);

// User routes
router.post("/cod", authUser, placeOrderCOD);
router.post("/razorpay", authUser, placeOrderRazorpay);
router.post("/cod-advance", authUser, placeOrderCODAdvance);
router.get("/user", authUser, getUserOrders);
router.put("/:id/tracking", authSeller, addTrackingInfo);
router.post("/:id/notify", authSeller, sendCustomerNotification);
// Seller/admin routes
router.get("/seller", authSeller, getAllOrders);
router.get("/analytics", authSeller, getOrderAnalytics);
router.put("/:id/status", authSeller, updateOrderStatus);
router.put("/:id/tracking", authSeller, addTrackingInfo);
router.post("/:id/notify", authSeller, sendCustomerNotification);
router.delete("/:id", authSeller, deleteOrder);

export default router;
