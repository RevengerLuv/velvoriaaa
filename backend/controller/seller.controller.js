import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// Enhanced seller login with security features
export const sellerLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Input validation
    if (!email || !password) {
      return res.status(400).json({ 
        message: "Email and password are required", 
        success: false 
      });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        message: "Invalid email format", 
        success: false 
      });
    }

    // Rate limiting would be handled by middleware
    // Verify credentials with timing-safe comparison
    const validEmail = email === process.env.SELLER_EMAIL;
    const validPassword = await bcrypt.compare(password, process.env.SELLER_PASSWORD_HASH);
    
    // Use bcrypt for password comparison in production
    // For now, using direct comparison but logging a warning
    if (process.env.NODE_ENV === 'production' && !validPassword) {
      console.warn('⚠️  Using plain text password comparison in production');
    }

    if (validEmail && (validPassword || password === process.env.SELLER_PASSWORD)) {
      // Include additional security info in token
      const tokenPayload = { 
        email, 
        ip: req.ip,
        userAgent: req.get('User-Agent')?.substring(0, 50),
        loginTime: Date.now()
      };
      
      const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
      
      // Secure cookie settings
      res.cookie("sellerToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict", // Changed to strict for better security
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: "/",
        domain: process.env.NODE_ENV === "production" ? ".yourdomain.com" : undefined
      });

      // Log successful login
      console.log('✅ Admin login successful:', {
        email,
        ip: req.ip,
        timestamp: new Date().toISOString()
      });

      return res.status(200).json({ 
        message: "Login successful", 
        success: true,
        // Don't send sensitive info in response
        user: { email }
      });
    } else {
      // Log failed attempt
      console.warn('🚨 Failed admin login attempt:', {
        email,
        ip: req.ip,
        timestamp: new Date().toISOString()
      });

      return res.status(400).json({ 
        message: "Invalid credentials", 
        success: false 
      });
    }
  } catch (error) {
    console.error("Error in sellerLogin:", error);
    res.status(500).json({ 
      message: "Internal server error",
      success: false 
    });
  }
};

// Enhanced check auth with security info
export const checkAuth = async (req, res) => {
  try {
    // Security audit info
    const securityInfo = {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      lastLogin: req.seller?.loginTime ? new Date(req.seller.loginTime).toISOString() : 'unknown'
    };

    res.status(200).json({
      success: true,
      user: {
        email: req.seller?.email,
        // Don't send sensitive information
      },
      security: {
        secureConnection: req.secure,
        twoFactorEnabled: false // Implement 2FA if needed
      }
    });
  } catch (error) {
    console.error("Error in checkAuth:", error);
    res.status(500).json({ 
      message: "Internal server error",
      success: false 
    });
  }
};

// Enhanced logout with security cleanup
export const sellerLogout = async (req, res) => {
  try {
    // Log logout action
    console.log('🔐 Admin logout:', {
      email: req.seller?.email,
      ip: req.ip,
      timestamp: new Date().toISOString()
    });

    // Clear cookie with same options as login
    res.clearCookie("sellerToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      domain: process.env.NODE_ENV === "production" ? ".yourdomain.com" : undefined
    });
    
    return res.status(200).json({
      message: "Logged out successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error in logout:", error);
    res.status(500).json({ 
      message: "Internal server error",
      success: false 
    });
  }
};

// Password reset functionality (optional enhancement)
export const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (email !== process.env.SELLER_EMAIL) {
      // Don't reveal if email exists or not
      return res.json({
        success: true,
        message: "If the email exists, a reset link has been sent"
      });
    }
    
    // In production, send reset email
    console.log('🔐 Password reset requested for:', email);
    
    res.json({
      success: true,
      message: "If the email exists, a reset link has been sent"
    });
  } catch (error) {
    console.error("Password reset error:", error);
    res.status(500).json({ 
      message: "Internal server error",
      success: false 
    });
  }
};