const asyncHandler = require("express-async-handler");

/**
 * Role-based access control middleware factory
 * Creates middleware that checks if user has the required role(s)
 *
 * @param {...string} roles - One or more roles allowed to access the route
 * @returns {Function} Express middleware
 *
 * Usage:
 *   router.delete("/delete/:id", authMiddleware, requireRole("ADMIN"), controller);
 *   router.get("/stats", authMiddleware, requireRole("ADMIN", "ASSISTANT"), controller);
 */
const requireRole = (...roles) => {
  return asyncHandler(async (req, res, next) => {
    const user = res.locals.user;

    if (!user || !user.roles) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const hasRole = user.roles.some((role) => roles.includes(role));

    if (!hasRole) {
      return res.status(403).json({
        success: false,
        message: "Forbidden — insufficient permissions",
      });
    }

    next();
  });
};

// ─── Convenience exports (backward compatible) ────────────────────────
const checkAdminMiddleware = requireRole("ADMIN");
const checkAssistantMiddleware = requireRole("ASSISTANT");
const checkLabManagerMiddleware = requireRole("LAB-MANAGER");
const checkAssistantAndAdminMiddleware = requireRole("ASSISTANT", "ADMIN");

module.exports = {
  requireRole,
  checkAdminMiddleware,
  checkAssistantMiddleware,
  checkLabManagerMiddleware,
  checkAssistantAndAdminMiddleware,
};
