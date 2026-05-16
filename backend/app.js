import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import helmet from "helmet";
import mongoose from "mongoose";
import hpp from "hpp";
import compression from "compression";

import { setLanguage } from "./src/middlewares/i18n.js";
import { errorHandler } from "./src/middlewares/errorHandler.js";
import routes from "./src/routes/index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

// Trim spaces from allowed origins
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim())
  : ["http://localhost:3000"];

app.use(
  cors({
    origin: (origin, callback) => {
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        process.env.NODE_ENV !== "production"
      ) {
        callback(null, true);
      } else {
        callback(new Error("Origin not allowed"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept-Language"],
    maxAge: 3600,
  }),
);

app.use(
  helmet({
    contentSecurityPolicy: false,
    hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
    frameguard: { action: "deny" },
    referrerPolicy: { policy: "strict-origin-when-cross-origin" },
  }),
);

// Prevent HTTP Parameter Pollution
app.use(hpp());

// Compress responses larger than 1KB
app.use(compression({ threshold: 1024 }));

app.use(cookieParser());
app.use(setLanguage);

app.use((req, res, next) => {
  console.log("Content-Type:", req.headers["content-type"]);
  next();
});

// ── CRITICAL FIX: Skip body parsers for multipart uploads ──────
// Multer must handle multipart streams, not express.json/urlencoded
app.use((req, res, next) => {
  const contentType = req.headers["content-type"] || "";
  if (contentType.startsWith("multipart/form-data")) {
    return next();
  }
  next();
});

// These now safely skip multipart requests
app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ limit: "100kb", extended: true }));

// Express 5: req.query and req.params are read-only
// Only sanitize req.body. Sanitize query/params at point of use if needed.
app.use((req, res, next) => {
  if (req.body && typeof req.body === "object") {
    // Manual sanitization for req.body only
    const sanitize = (obj) => {
      if (typeof obj !== "object" || obj === null) return obj;
      if (Array.isArray(obj)) return obj.map(sanitize);
      const clean = {};
      for (const [key, value] of Object.entries(obj)) {
        if (key.startsWith("$")) continue; // Remove MongoDB operators
        clean[key] = typeof value === "object" ? sanitize(value) : value;
      }
      return clean;
    };
    req.body = sanitize(req.body);
  }
  next();
});

app.use(routes);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/health", async (req, res) => {
  const healthcheck = {
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    services: { database: "unknown" },
  };

  try {
    const dbState = mongoose.connection.readyState;
    if (dbState === 1) {
      await mongoose.connection.db.admin().ping();
      healthcheck.services.database = "connected";
    } else {
      healthcheck.status = "degraded";
      healthcheck.services.database = "disconnected";
    }
  } catch {
    healthcheck.status = "degraded";
    healthcheck.services.database = "error";
  }

  res.status(healthcheck.status === "ok" ? 200 : 503).json(healthcheck);
});

app.get("/", (_req, res) => {
  res.status(200).json({
    status: "success",
    message: "Welcome to AXON Medical API",
    version: "1.0.0",
  });
});

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use(errorHandler);

export default app;
