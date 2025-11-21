import rateLimit from 'express-rate-limit';
import jwt from 'jsonwebtoken';

// Rate limiting for admin routes
export const adminRateLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Login rate limiter
export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    message: 'Too many login attempts, please try again after 15 minutes.'
  },
  skipSuccessfulRequests: true,
});

// Enhanced authentication middleware
export const enhancedAuthSeller = async (req, res, next) => {
  try {
    const token = req.cookies.sellerToken;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.',
        code: 'NO_TOKEN'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Additional security checks
    const currentTime = Math.floor(Date.now() / 1000);
    const tokenAge = currentTime - decoded.iat;
    
    // Force re-login if token is too old
    const maxTokenAge = 7 * 24 * 60 * 60; // 7 days
    if (tokenAge > maxTokenAge) {
      res.clearCookie('sellerToken');
      return res.status(401).json({
        success: false,
        message: 'Session expired. Please login again.',
        code: 'SESSION_EXPIRED'
      });
    }

    req.seller = decoded;
    next();
  } catch (error) {
    console.error('Admin auth error:', error);
    
    if (error.name === 'TokenExpiredError') {
      res.clearCookie('sellerToken');
      return res.status(401).json({
        success: false,
        message: 'Token expired. Please login again.',
        code: 'TOKEN_EXPIRED'
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token.',
        code: 'INVALID_TOKEN'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Authentication error.',
      code: 'AUTH_ERROR'
    });
  }
};

// Input validation
export const validateAdminInput = (req, res, next) => {
  // Basic XSS protection
  const sanitize = (obj) => {
    for (let key in obj) {
      if (typeof obj[key] === 'string') {
        // Remove script tags and other dangerous patterns
        obj[key] = obj[key]
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
          .replace(/javascript:/gi, '')
          .replace(/on\w+=/gi, '');
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        sanitize(obj[key]);
      }
    }
  };

  sanitize(req.body);
  sanitize(req.query);
  next();
};

// Audit logger
export const adminActionLogger = (req, res, next) => {
  const startTime = Date.now();
  const originalSend = res.send;

  res.send = function (data) {
    const duration = Date.now() - startTime;
    
    if (req.seller) {
      console.log('🔐 Admin Action:', {
        timestamp: new Date().toISOString(),
        admin: req.seller.email,
        method: req.method,
        endpoint: req.originalUrl,
        status: res.statusCode,
        duration: `${duration}ms`,
        ip: req.ip
      });
    }

    originalSend.call(this, data);
  };

  next();
};