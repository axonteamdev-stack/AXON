import app from "./app.js";
import connectDB from "./Src/Config/db.js";
import http from "http";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import AuthService from "./Src/Services/AuthService.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- 1. ✅ FIXED: Environment validation at startup ---
try {
  AuthService.validateEnvironmentVariables();
  console.log("✅ Environment validation passed");
} catch (error) {
  console.error("❌ Environment validation failed:", error.message);
  process.exit(1);
}

// --- 2. Setup directories ---
const UPLOADS_PATH = process.env.UPLOADS_PATH || path.join(__dirname, "Uploads");

const uploadDirs = [
  path.join(UPLOADS_PATH, "Certificates"),
  path.join(UPLOADS_PATH, "PersonalPhoto"),
  path.join(UPLOADS_PATH, "Radiology"),
  path.join(UPLOADS_PATH, "LabTests"),
  path.join(UPLOADS_PATH, "Posts"),
];

const createDirIfNotExists = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true, mode: 0o755 });
    console.log(`✅ Created directory: ${dir}`);
  }
};

uploadDirs.forEach(createDirIfNotExists);

// --- 3. Database connection ---
connectDB()
  .then(() => {
    // ✅ FIXED: Create HTTP server with timeout configuration
    const server = http.createServer(app);

    // Set request timeout
    server.timeout = 30 * 1000; // 30 seconds

    // Keep-alive timeout
    server.keepAliveTimeout = 65 * 1000; // 65 seconds

    // Handle client errors gracefully
    server.on("clientError", (err, socket) => {
      if (err.code === "ECONNRESET" || !socket.writable) {
        return;
      }

      if (err instanceof SyntaxError && err.status === 400) {
        socket.end("HTTP/1.1 400 Bad Request\r\n\r\n");
      } else if (err.code === "HPE_INVALID_CONSTANT") {
        socket.end("HTTP/1.1 400 Bad Request\r\n\r\n");
      } else {
        socket.end("HTTP/1.1 500 Internal Server Error\r\n\r\n");
      }
    });

    const PORT = process.env.PORT || 3000;
    const server_instance = server.listen(PORT, () => {
      console.log(
        `✅ Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
      );
      console.log(
        `📡 API Documentation: http://localhost:${PORT}/`
      );
      console.log(
        `🏥 Health Check: http://localhost:${PORT}/health`
      );
    });

    // --- 4. Graceful shutdown handlers ---
    process.on("SIGTERM", () => {
      console.log("⚠️ SIGTERM received, shutting down gracefully");
      server_instance.close(() => {
        console.log("✅ HTTP server closed");
        process.exit(0);
      });

      // Force close after 10 seconds
      setTimeout(() => {
        console.error("❌ Could not close connections in time, forcefully shutting down");
        process.exit(1);
      }, 10 * 1000);
    });

    process.on("SIGINT", () => {
      console.log("⚠️ SIGINT received, shutting down gracefully");
      server_instance.close(() => {
        console.log("✅ HTTP server closed");
        process.exit(0);
      });

      setTimeout(() => {
        console.error("❌ Could not close connections in time, forcefully shutting down");
        process.exit(1);
      }, 10 * 1000);
    });

    // --- 5. Unhandled error handlers ---
    process.on("unhandledRejection", (err) => {
      console.error("❌ Unhandled Rejection:", err);
      server_instance.close(() => {
        process.exit(1);
      });
    });

    process.on("uncaughtException", (err) => {
      console.error("❌ Uncaught Exception:", err);
      server_instance.close(() => {
        process.exit(1);
      });
    });
  })
  .catch((err) => {
    console.error("❌ Failed to connect to database:", err.message);
    process.exit(1);
  });
