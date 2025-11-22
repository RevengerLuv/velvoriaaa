// controllers/seller.controller.js
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const cookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  path: "/",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const sellerLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email and password are required", success: false });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return res.status(400).json({ message: "Invalid email format", success: false });

    if (!process.env.SELLER_EMAIL || (!process.env.SELLER_PASSWORD_HASH && !process.env.SELLER_PASSWORD)) {
      console.error("❌ Seller credentials not configured in environment variables");
      return res.status(500).json({ message: "Server configuration error", success: false });
    }

    const validEmail = email === process.env.SELLER_EMAIL;
    let validPassword = false;
    if (process.env.SELLER_PASSWORD_HASH) {
      validPassword = await bcrypt.compare(password, process.env.SELLER_PASSWORD_HASH);
    } else if (process.env.SELLER_PASSWORD) {
      validPassword = password === process.env.SELLER_PASSWORD;
    }

    if (validEmail && validPassword) {
      const tokenPayload = { email, ip: req.ip, userAgent: req.get("User-Agent")?.substring(0, 50), loginTime: Date.now() };
      const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: "7d" });

      res.cookie("sellerToken", token, cookieOptions);

      console.log("✅ Admin login successful:", { email, ip: req.ip, timestamp: new Date().toISOString() });

      return res.status(200).json({ message: "Login successful", success: true, user: { email } });
    }

    console.warn("🚨 Failed admin login attempt:", { email, ip: req.ip, timestamp: new Date().toISOString() });
    return res.status(401).json({ message: "Invalid credentials", success: false });
  } catch (error) {
    console.error("Error in sellerLogin:", error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

export const checkAuth = async (req, res) => {
  try {
    res.status(200).json({ success: true, user: { email: req.seller?.email }, security: { secureConnection: req.secure, twoFactorEnabled: false } });
  } catch (error) {
    console.error("Error in checkAuth:", error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

export const sellerLogout = async (req, res) => {
  try {
    console.log("🔐 Admin logout:", { email: req.seller?.email, ip: req.ip, timestamp: new Date().toISOString() });
    res.clearCookie("sellerToken", { httpOnly: true, secure: true, sameSite: "none", path: "/" });
    return res.status(200).json({ message: "Logged out successfully", success: true });
  } catch (error) {
    console.error("Error in logout:", error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};
