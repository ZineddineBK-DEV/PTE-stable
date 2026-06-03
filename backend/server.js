const http = require("http");
const app = require("./app");
const logger = require("./src/config/logger");
const resetBalances = require("./src/tools/crons");

// Initialize the cron job
try {
  resetBalances();
  logger.info("✅ Cron job initialized successfully");
} catch (error) {
  logger.error("❌ Failed to initialize cron job:", error);
}

// Set the port
const port = process.env.PORT || 3001;
app.set("port", port);

// Create the server
const server = http.createServer(app);

// Start the server
server.listen(port, () => {
  logger.info(`🚀 Server is running on port ${port}`);
  logger.info(`📝 Environment: ${process.env.NODE_ENV || "development"}`);
});

// Handle server errors
server.on("error", (error) => {
  if (error.syscall !== "listen") {
    throw error;
  }

  switch (error.code) {
    case "EACCES":
      logger.error(`Port ${port} requires elevated privileges`);
      process.exit(1);
      break;
    case "EADDRINUSE":
      logger.error(`Port ${port} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
});

// Graceful shutdown
process.on("SIGTERM", () => {
  logger.info("SIGTERM received — shutting down gracefully");
  server.close(() => {
    logger.info("Server closed");
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  logger.info("SIGINT received — shutting down gracefully");
  server.close(() => {
    logger.info("Server closed");
    process.exit(0);
  });
});

// Unhandled rejection handler
process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled Rejection at:", promise, "reason:", reason);
});

process.on("uncaughtException", (error) => {
  logger.error("Uncaught Exception:", error);
  server.close(() => {
    process.exit(1);
  });
});
