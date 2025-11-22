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

    // FIXED: Check if environment variables exist
    if (!process.env.SELLER_EMAIL || (!process.env.SELLER_PASSWORD_HASH && !process.env.SELLER_PASSWORD)) {
      console.error('❌ Seller credentials not configured in environment variables');
      return res.status(500).json({ 
        message: "Server configuration error", 
        success: false 
      });
    }

    const validEmail = email === process.env.SELLER_EMAIL;
    
    // FIXED: Safe password comparison
    let validPassword = false;
    
    if (process.env.SELLER_PASSWORD_HASH) {
      // Compare with bcrypt hash
      try {
        validPassword = await bcrypt.compare(password, process.env.SELLER_PASSWORD_HASH);
      } catch (bcryptError) {
        console.error('❌ Bcrypt comparison error:', bcryptError);
        validPassword = false;
      }
    } else if (process.env.SELLER_PASSWORD) {
      // Fallback to plain text comparison (for development only)
      console.warn('⚠️ Using plain text password comparison - not recommended for production');
      validPassword = password === process.env.SELLER_PASSWORD;
    }

    if (validEmail && validPassword) {
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
      
      // Secure cookie settings - REMOVE DOMAIN for Render.com
      res.cookie("sellerToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax", // Changed to lax for cross-site compatibility
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: "/",
        // REMOVE domain: process.env.NODE_ENV === "production" ? ".yourdomain.com" : undefined
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
        user: { email }
      });
    } else {
      // Log failed attempt
      console.warn('🚨 Failed admin login attempt:', {
        email,
        ip: req.ip,
        timestamp: new Date().toISOString()
      });

      return res.status(401).json({ 
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
