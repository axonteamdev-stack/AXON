import pino from "pino";
import fs from "fs";
import path from "path";
import { createHash } from "crypto";
import dotenv from "dotenv";
dotenv.config();

const isDev = process.env.NODE_ENV === "development";
const logDir = path.join(process.cwd(), "logs");

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// ── Configuration ─────────────────────────────────────────────
const LOG_RETENTION_DAYS = Number(process.env.LOG_RETENTION_DAYS) || 30;
const LOG_MAX_SIZE_MB = Number(process.env.LOG_MAX_SIZE_MB) || 100;
const LOG_ROTATION_SIZE_MB = Number(process.env.LOG_ROTATION_SIZE_MB) || 50;
const LOG_ROTATION_COUNT = Number(process.env.LOG_ROTATION_COUNT) || 5;

// ── Log rotation ─────────────────────────────────────────────
const rotateLogFile = (basePath) => {
  try {
    if (!fs.existsSync(basePath)) return;
    const stats = fs.statSync(basePath);
    const sizeMB = stats.size / (1024 * 1024);

    if (sizeMB >= LOG_ROTATION_SIZE_MB) {
      for (let i = LOG_ROTATION_COUNT - 1; i >= 1; i--) {
        const oldPath = `${basePath}.${i}`;
        const newPath = `${basePath}.${i + 1}`;
        if (fs.existsSync(oldPath)) {
          if (fs.existsSync(newPath)) fs.unlinkSync(newPath);
          fs.renameSync(oldPath, newPath);
        }
      }
      fs.renameSync(basePath, `${basePath}.1`);
    }
  } catch (err) {
    process.stdout.write(`Failed to rotate log ${basePath}: ${err.message}\n`);
  }
};

// ── Log retention ────────────────────────────────────────────
const cleanupOldLogs = () => {
  try {
    const files = fs.readdirSync(logDir);
    const now = Date.now();
    const maxAge = LOG_RETENTION_DAYS * 24 * 60 * 60 * 1000;

    for (const file of files) {
      const filePath = path.join(logDir, file);
      const stats = fs.statSync(filePath);
      const age = now - stats.mtimeMs;
      const sizeMB = stats.size / (1024 * 1024);
      const mtime = new Date(stats.mtime).toLocaleDateString();

      if (age > maxAge || sizeMB > LOG_MAX_SIZE_MB) {
        fs.unlinkSync(filePath);
        process.stdout.write(
          `🗑️ Deleted old log: ${file} (${Math.round(sizeMB)}MB, ${mtime})\n`,
        );
      }
    }
  } catch (err) {
    process.stdout.write(`Failed to cleanup old logs: ${err.message}\n`);
  }
};

rotateLogFile(path.join(logDir, "app.log"));
rotateLogFile(path.join(logDir, "error.log"));
cleanupOldLogs();

const allLogsStream = fs.createWriteStream(path.join(logDir, "app.log"), {
  flags: "a",
});
const errorLogsStream = fs.createWriteStream(path.join(logDir, "error.log"), {
  flags: "a",
});

// ── Base Logger Configuration ───────────────────────────────
console.log("NODE_ENV value:", process.env.NODE_ENV);
console.log("dotenv loaded?", !!process.env.NODE_ENV);
const baseConfig = {
  level: process.env.LOG_LEVEL || "info",
  base: {
    pid: process.pid,
    env: process.env.NODE_ENV || "unknown",
  },
  // Pino timestamp function must return a string with leading comma
  timestamp: pino.stdTimeFunctions.isoTime,
  ...(isDev && {
    transport: {
      target: "pino-pretty",
      options: {
        colorize: true,
        translateTime: "yyyy-mm-dd HH:MM:ss Z",
        ignore: "pid,env",
      },
    },
  }),
};

const streams = [
  { stream: process.stdout, level: "info" },
  { stream: allLogsStream, level: "info" },
  { stream: errorLogsStream, level: "error" },
];

export const logger = pino(baseConfig, pino.multistream(streams));

// ── Error-only logger ────────────────────────────────────────
export const errorLogger = pino(
  {
    level: "error",
    timestamp: pino.stdTimeFunctions.isoTime,
    ...(isDev && {
      transport: {
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "yyyy-mm-dd HH:MM:ss Z",
          messageFormat: "[ERROR] {msg}",
        },
      },
    }),
  },
  pino.multistream([{ stream: errorLogsStream, level: "error" }]),
);

// ── Request Logger ───────────────────────────────────────────
export const createRequestLogger = (req) => {
  const requestId = req.headers["x-request-id"] || generateRequestId();
  return logger.child({
    requestId,
    method: req.method,
    url: req.url,
    ip: req.ip || req.socket?.remoteAddress,
  });
};

function generateRequestId() {
  return createHash("sha256")
    .update(`${Date.now()}-${Math.random()}`)
    .digest("hex")
    .slice(0, 16);
}

// ── Performance Logger ─────────────────────────────────────
export const createPerformanceLogger = (label) => {
  const start = performance.now();
  return {
    end: (meta = {}) => {
      const duration = performance.now() - start;
      logger.info(
        { ...meta, duration: Math.round(duration), label },
        `${label} completed`,
      );
      return duration;
    },
  };
};

// ── Graceful shutdown ──────────────────────────────────────
const shutdown = () => {
  logger.info("Logger shutting down gracefully");
  allLogsStream.end();
  errorLogsStream.end();
  process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

process.on("uncaughtException", (err) => {
  errorLogger.fatal({ err, type: "uncaughtException" }, "Uncaught exception");
  shutdown();
});

process.on("unhandledRejection", (reason) => {
  errorLogger.error(
    { reason, type: "unhandledRejection" },
    "Unhandled promise rejection",
  );
});

export default logger;
