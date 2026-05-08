import dotenv from "dotenv";
import { validateEnvironment } from "./src/config/env.js";
import app from "./app.js";
import connectDB from "./src/config/db.js";
import initSocket from "./src/config/socket.js";
import { logger } from "./src/config/logger.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load env vars ONCE at the very top
dotenv.config();

// Validate immediately
try {
  validateEnvironment();
  logger.info("✅ Environment validation passed");
} catch (err) {
  logger.error({ err: err.message }, "❌ Environment validation failed");
  process.exit(1);
}

// Ensure upload directories exist
const uploadDir = process.env.UPLOAD_DIR || "./uploads";
const uploadDirs = ["certificates", "personalPhoto", "radiology", "labTests", "posts"].map(
  (d) => path.join(uploadDir, d)
);

for (const dir of uploadDirs) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true, mode: 0o750 });
    logger.info(`Created directory: ${dir}`);
  }
}

// Connect to DB and start server
connectDB()
  .then(() => {
    const PORT = process.env.PORT || 8000;
    const server = app.listen(PORT, () => {
      logger.info(`🚀 Server running on port ${PORT}`);
      logger.info(`📡 API URL: ${process.env.APP_URL}`);
      logger.info(`📡 Health Check: ${process.env.APP_URL}/health`);
    });

    server.timeout = Number(process.env.SERVER_TIMEOUT_MS) || 30000;
    server.keepAliveTimeout = Number(process.env.KEEP_ALIVE_MS) || 65000;

    initSocket(server);

    // Graceful shutdown
    const shutdown = (signal) => {
      logger.info(`${signal} received, shutting down gracefully`);
      server.close(() => {
        logger.info("HTTP server closed");
        process.exit(0);
      });
      setTimeout(() => {
        logger.error("Force shutdown");
        process.exit(1);
      }, Number(process.env.SHUTDOWN_TIMEOUT_MS) || 10000);
    };

    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT", () => shutdown("SIGINT"));
  })
  .catch((err) => {
    logger.error({ err: err.message }, "Database connection failed");
    process.exit(1);
  });

// Global error handlers
process.on("unhandledRejection", (reason) => {
  logger.error({ reason }, "Unhandled Rejection");
  process.exit(1);
});

process.on("uncaughtException", (err) => {
  logger.error({ err }, "Uncaught Exception");
  process.exit(1);
});
