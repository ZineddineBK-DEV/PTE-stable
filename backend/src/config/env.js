const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const env = {
  PORT: process.env.PORT || 3001,
  CONNECTION_STRING: process.env.CONNECTION_STRING,
  EMAIL: process.env.EMAIL,
  EMAIL_PASSWORD: process.env.PASSWORD,
  IMAGES_PATH: process.env.IMAGES_PATH,

  // JWT
  JWT_SECRET: process.env.JWT_SECRET || "fallback_dev_secret_change_in_production",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "2h",

  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000, // 15 min
  RATE_LIMIT_MAX: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 100,
  AUTH_RATE_LIMIT_MAX: parseInt(process.env.AUTH_RATE_LIMIT_MAX, 10) || 5,

  // Node environment
  NODE_ENV: process.env.NODE_ENV || "development",
};

// Validate required vars
const requiredVars = ["CONNECTION_STRING", "JWT_SECRET"];
const missing = requiredVars.filter((v) => !process.env[v]);
if (missing.length && env.NODE_ENV === "production") {
  console.error(`❌ Missing required env variables: ${missing.join(", ")}`);
  process.exit(1);
}

module.exports = env;
