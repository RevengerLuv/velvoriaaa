import express from "express";
import {
  addProduct,
  changeStock,
  getProductById,
  getProducts,
} from "../controller/product.controller.js";
import { upload } from "../config/multer.js";
import { authSeller } from "../middlewares/authSeller.js"; // ADD THIS IMPORT

const router = express.Router();

router.post("/add-product", authSeller, upload.array("image", 4), addProduct);
router.get("/list", getProducts);
router.get("/:id", getProductById); // ✅ FIXED: Added colon before id
router.post("/stock", authSeller, changeStock);

export default router;
