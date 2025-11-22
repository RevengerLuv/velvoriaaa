// routes/analytics.routes.js
import express from "express";
import { authSeller } from "./authSeller.js";
import {
  getSalesAnalytics,
  getCustomerAnalytics,
  getProductAnalytics,
  getRevenueAnalytics,
  getTrafficAnalytics,
  exportAnalyticsData
} from "../controller/analytics.controller.js";

const router = express.Router();

// Sales Analytics
router.get("/sales", authSeller, getSalesAnalytics);
router.get("/customers", authSeller, getCustomerAnalytics);
router.get("/products", authSeller, getProductAnalytics);
router.get("/revenue", authSeller, getRevenueAnalytics);
router.get("/traffic", authSeller, getTrafficAnalytics);
router.get("/export", authSeller, exportAnalyticsData);

export default router;
