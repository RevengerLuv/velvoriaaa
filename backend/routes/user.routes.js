import express from "express";
import {
  checkAuth,
  loginUser,
  logout,
  registerUser,
  googleAuth,
  updateProfile,
  changePassword
} from "../controller/user.controller.js";
import authUser from "../middlewares/authUser.js";
// Add this import
import { saveUserLocation } from "../controller/user.controller.js";

// Add this route
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/google-auth", googleAuth);
router.get("/is-auth", authUser, checkAuth);
router.get("/logout", authUser, logout);
router.put("/profile", authUser, updateProfile);
router.put("/change-password", authUser, changePassword);
router.post("/location", authUser, saveUserLocation);
export default router;