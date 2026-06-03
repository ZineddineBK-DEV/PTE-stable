const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/user");
const env = require("../config/env");
const logger = require("../config/logger");

/**
 * JWT Authentication Middleware
 * Verifies Bearer token from Authorization header
 * Attaches user to req.user and res.locals.user
 */
const authMiddleware = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Extract token from "Bearer <token>"
      token = req.headers.authorization.split(" ")[1];

      // Verify token using the secret from .env
      const decoded = jwt.verify(token, env.JWT_SECRET);

      // Attach user to request (exclude password)
      req.user = await User.findById(decoded.id).select("-password");
      res.locals.user = req.user;

      if (!req.user) {
        logger.warn(`Token valid but user not found. Token ID: ${decoded.id}`);
        return res.status(401).json({
          success: false,
          message: "User no longer exists",
        });
      }

      next();
    } catch (error) {
      logger.error(`JWT verification failed: ${error.message}`);
      return res.status(401).json({
        success: false,
        message: "Not authorized — invalid or expired token",
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authorized — no token provided",
    });
  }
});

module.exports = { authMiddleware };
