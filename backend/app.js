// ============imports=============
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
require("dotenv/config");

const env = require("./src/config/env");
const logger = require("./src/config/logger");
const { generalLimiter, authLimiter } = require("./src/config/rateLimiter");
const errorHandler = require("./src/middlewares/errorHandler");
const notFound = require("./src/middlewares/notFound");

const app = express();

// ============ security & middleware ============
// Helmet — sets security headers (XSS protection, CSP, etc.)
app.use(helmet());

// CORS — properly configured instead of manual headers
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*", // Restrict in production
    methods: ["GET", "PUT", "POST", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: [
      "Origin",
      "X-Requested-With",
      "Content-Type",
      "Accept",
      "Authorization",
      "Cache-Control",
    ],
    credentials: true,
  })
);

// Body parsing
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));

// HTTP request logging (Morgan → Winston)
app.use(
  morgan("combined", {
    stream: {
      write: (message) => logger.http(message.trim()),
    },
  })
);

// General rate limiting (all routes)
app.use("/api", generalLimiter);

// ============ importing routes ================
const usersRoute = require("./src/routes/user");
const loginRoute = require("./src/routes/login");
const cvRoute = require("./src/routes/cv");
const leaveRoute = require("./src/routes/leave");

/** Material Resources Routes */
const roomRoute = require("./src/routes/material_resources/room");
const vehicleRoute = require("./src/routes/material_resources/vehicle");
const virtualizationEnvRoute = require("./src/routes/material_resources/virtualization_env");

// Posts
const postsRoute = require("./src/routes/post");
const likesRoute = require("./src/routes/like");
const commentsRoute = require("./src/routes/comment");

// Inventory
const accessoryRoute = require("./src/routes/inventory/accessory");
const equipmentRoute = require("./src/routes/inventory/equipment");

// ============ connecting to database =============
mongoose.set("strictQuery", true);
mongoose
  .connect(env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    logger.info("✅ Connected to MongoDB database");
  })
  .catch((err) => {
    logger.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

// ============ static files ============
app.use("/images", express.static(path.join("./src/static/images")));
app.use("/postImages", express.static(path.join("./src/static/postImages")));
app.use("/certFiles", express.static(path.join("./src/static/certFiles")));
app.use("/leaveCertif", express.static(path.join("./src/static/leaveCert")));
app.use("/external_docs", express.static(path.join("./src/static/external_docs")));
app.use("/signatures", express.static(path.join("./src/static/signatures")));

// ============ configuring routes ============

// Auth routes — with strict rate limiting
app.use("/api/login", authLimiter, loginRoute);

// All other API routes
app.use("/api/users", usersRoute);
app.use("/api/cv", cvRoute);
app.use("/api/material/room", roomRoute);
app.use("/api/material/vehicle", vehicleRoute);
app.use("/api/material/virtualization", virtualizationEnvRoute);
app.use("/api/leave", leaveRoute);
app.use("/api/post", postsRoute);
app.use("/api/like", likesRoute);
app.use("/api/comment", commentsRoute);
app.use("/api/accessory", accessoryRoute);
app.use("/api/equipment", equipmentRoute);

// ============ error handling ============
// 404 handler (after all routes)
app.use(notFound);

// Global error handler (after 404)
app.use(errorHandler);

// ======== exporting app ========
module.exports = app;
