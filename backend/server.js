import { validateEnvironment } from "./src/config/env.js";
import app from "./app.js";
import connectDB from "./src/config/db.js";
import { initSocket } from "./src/config/socket.js";
import { logger, errorLogger } from "./src/config/logger.js";
import fs from "fs";
import path from "path";

// Validate env vars
try {
  validateEnvironment();
  logger.info("Environment validation passed");
} catch (err) {
  errorLogger.error({ err: err.message }, "Environment validation failed");
  process.exit(1);
}

// Ensure upload directories exist
const uploadDir = process.env.UPLOAD_DIR || "./uploads";
const dirs = [
  "certificates",
  "personalPhoto",
  "radiology",
  "labTests",
  "posts",
  ".temp",
];
for (const d of dirs) {
  const fullPath = path.join(uploadDir, d);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    logger.info(`Created: ${fullPath}`);
  } else {
    logger.info(`Exists: ${fullPath}`);
  }
}

// Also create .temp subfolders
const tempSubs = [
  "certificates",
  "personalPhoto",
  "radiology",
  "labTests",
  "posts",
];
for (const d of tempSubs) {
  const fullPath = path.join(uploadDir, ".temp", d);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    logger.info(`Created temp: ${fullPath}`);
  }
}

// Connect to DB and start server
connectDB()
  .then(() => {
    const PORT = process.env.PORT || 3000;
    const server = app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
      logger.info(`API URL: ${process.env.APP_URL}`);
      logger.info(`Health Check: ${process.env.APP_URL}/health`);
      initSocket(server);
    });

    server.timeout = 30000;

    // Graceful shutdown
    let isShuttingDown = false;

    const shutdown = (signal) => {
      if (isShuttingDown) return;
      isShuttingDown = true;

      logger.info(`${signal} received, shutting down gracefully`);

      server.close(() => {
        logger.info("HTTP server closed");
        process.exit(0);
      });

      // Force shutdown after 10 seconds
      setTimeout(() => {
        errorLogger.error("Force shutdown after timeout");
        process.exit(1);
      }, 10000);
    };

    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT", () => shutdown("SIGINT"));
  })
  .catch((err) => {
    errorLogger.error({ err: err.message }, "Database connection failed");
    process.exit(1);
  });

// Global error handlers — log but don't crash immediately
process.on("unhandledRejection", (reason, promise) => {
  errorLogger.error({ reason, promise }, "Unhandled Rejection");
  // Don't exit — let existing requests finish, monitor and alert instead
});

process.on("uncaughtException", (err) => {
  errorLogger.error({ err }, "Uncaught Exception");
  // Give logger time to flush, then exit
  setTimeout(() => process.exit(1), 1000);
});

process.on("exit", (code) => {
  logger.info(`Process exited with code: ${code}`);
});
