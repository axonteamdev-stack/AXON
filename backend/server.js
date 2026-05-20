import { validateEnvironment } from "./src/config/env.js";
import app from "./app.js";
import connectDB from "./src/config/db.js";
import { initSocket } from "./src/config/socket.js";
import { logger, errorLogger, closeLogger } from "./src/config/logger.js";
import fs from "fs";
import path from "path";

try {
  validateEnvironment();
  logger.info("Environment validation passed");
} catch (err) {
  errorLogger.error({ err: err.message }, "Environment validation failed");
  process.exit(1);
}

const uploadDir = process.env.UPLOAD_DIR || "./uploads";
const dirs = [
  "certificates",
  "personalPhoto",
  "radiology",
  "labTests",
  "posts",
  "articles",
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

    let isShuttingDown = false;

    const shutdown = (signal) => {
      if (isShuttingDown) return;
      isShuttingDown = true;

      logger.info(`${signal} received, shutting down gracefully`);

      server.close(() => {
        logger.info("HTTP server closed");
        closeLogger();
        process.exit(0);
      });

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

process.on("unhandledRejection", (reason, promise) => {
  errorLogger.error({ reason, promise }, "Unhandled Rejection");
});

process.on("uncaughtException", (err) => {
  errorLogger.error({ err }, "Uncaught Exception");
  setTimeout(() => process.exit(1), 1000);
});

process.on("exit", (code) => {
  logger.info(`Process exited with code: ${code}`);
});
