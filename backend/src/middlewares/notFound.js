const logger = require("../config/logger");

/**
 * 404 Not Found middleware
 * Place after all routes, before error handler
 */
const notFound = (req, res, next) => {
  const err = new Error(`Route not found: [${req.method}] ${req.originalUrl}`);
  err.statusCode = 404;
  logger.warn(`404 — [${req.method}] ${req.originalUrl}`);
  next(err);
};

module.exports = notFound;
