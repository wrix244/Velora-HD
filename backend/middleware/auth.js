import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Helper to parse cookies from raw headers
const parseCookies = (cookieHeader) => {
  const list = {};
  if (!cookieHeader) return list;
  cookieHeader.split(';').forEach((cookie) => {
    const parts = cookie.split('=');
    list[parts.shift().trim()] = decodeURIComponent(parts.join('='));
  });
  return list;
};

// Protect routes
export const protect = async (req, res, next) => {
  let token;

  // 1. Try to read token from cookies
  if (req.headers.cookie) {
    const cookies = parseCookies(req.headers.cookie);
    if (cookies.token) {
      token = cookies.token;
    }
  }

  // 2. Fall back to Authorization header
  if (
    !token &&
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (token) {
    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'velorahd_secret_key_123');

      // Get user from the token (excluding password)
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Not authorized, user not found' });
      }

      return next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
  }

  return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
};

// Optional Protect (allows guests, but decodes user if token provided)
export const optionalProtect = async (req, res, next) => {
  let token;

  // 1. Try to read token from cookies
  if (req.headers.cookie) {
    const cookies = parseCookies(req.headers.cookie);
    if (cookies.token) {
      token = cookies.token;
    }
  }

  // 2. Fall back to Authorization header
  if (
    !token &&
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'velorahd_secret_key_123');
      req.user = await User.findById(decoded.id).select('-password');
    } catch (error) {
      console.warn('Optional token verification failed:', error.message);
    }
  }
  next();
};

// Admin middleware
export const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ success: false, message: 'Not authorized as an admin' });
  }
};

// Central Error Handler
export const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    success: false,
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};
