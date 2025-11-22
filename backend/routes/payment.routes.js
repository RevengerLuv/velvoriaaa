import express from "express";
import { authSeller } from "../../middlewares/authSeller.js";
import { 
  createRazorpayOrder, 
  verifyPayment, 
  paymentHealthCheck 
} from "../controller/payment.controller.js";
import authUser from "../middlewares/authUser.js";

const router = express.Router();

router.get("/health", paymentHealthCheck);
router.post("/create-order", authUser, createRazorpayOrder);
router.post("/verify", authUser, verifyPayment);

export default router;
