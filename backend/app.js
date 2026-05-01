import express from "express";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import AppError from "./Src/Utils/AppError.js";
import { setLanguage } from "./Src/Middlewares/langMiddleware.js";
import authRouter from "./Src/Routes/AuthRoutes.js";
import adminRouter from "./Src/Routes/AdminRoutes.js";
import articleRouter from "./Src/Routes/ArticleRoutes.js";
import medicationRouter from "./Src/Routes/MedicationRoutes.js";
import postRouter from "./Src/Routes/PostRoutes.js";
import commentRouter from "./Src/Routes/CommentRoutes.js";
import { RATE_LIMIT } from "./Src/Constants/index.js";   
import { msg } from "./Src/Utils/ResponseHelper.js";
import { getLanguage } from "./Src/Utils/LanguageDetector.js";

import chatRouter from './Src/Routes/ChatRoutes.js';
import appointmentRouter from './Src/Routes/AppointmentRoutes.js';


const app = express();

// --- 1. Global Settings & Security ---

// Trust proxy is required for rate-limiting to find the correct IP
app.set("trust proxy", 1);

// CORS configuration
app.use(
  cors({
    origin: process.env.NODE_ENV === "production" ? process.env.FRONTEND_URL : true,
    credentials: true,
  })
);

// Secure Headers
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'"],
        fontSrc: ["'self'", "https://fonts.googleapis.com"],
      },
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
    frameguard: { action: "deny" },
    referrerPolicy: { policy: "strict-origin-when-cross-origin" },
  })
);

// --- 2. Body Parsers ---

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ limit: "10kb", extended: true }));

// --- 3. ✅ FIXED: Data Sanitization (The "Getter" Crash Fix) ---

// We call sanitize manually to avoid the "Cannot set property query" error
app.use((req, res, next) => {
  const sanitizeOptions = { replaceWith: "_" };
  if (req.body) mongoSanitize.sanitize(req.body, sanitizeOptions);
  if (req.params) mongoSanitize.sanitize(req.params, sanitizeOptions);
  if (req.query) mongoSanitize.sanitize(req.query, sanitizeOptions);
  next();
});

app.use(cookieParser());

// --- 4. Rate Limiters ---

const authLimiter = rateLimit({
  max: RATE_LIMIT.AUTH.MAX_ATTEMPTS,
  windowMs: RATE_LIMIT.AUTH.WINDOW_MINUTES * 60 * 1000,
  message: RATE_LIMIT.AUTH.MESSAGE,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      status: "error",
      message: RATE_LIMIT.AUTH.MESSAGE,
    });
  },
});

const apiLimiter = rateLimit({
  max: RATE_LIMIT.API.MAX_REQUESTS,
  windowMs: RATE_LIMIT.API.WINDOW_HOURS * 60 * 60 * 1000,
  message: RATE_LIMIT.API.MESSAGE,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.path === "/health",
});

// --- 5. Static Files & Language ---

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "Uploads")));
app.use(express.static("public"));

app.use(setLanguage);

// --- 6. Routes ---

// Auth-specific rate limiting
app.use("/api/v1/auth/login", authLimiter);
app.use("/api/v1/auth/signup-patient", authLimiter);
app.use("/api/v1/auth/signup-doctor", authLimiter);
app.use("/api/v1/auth/forgot-password", authLimiter);
app.use("/api/v1/auth/reset-password", authLimiter);
app.use("/api/v1/auth/refresh-token", authLimiter);

// Resource Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/articles", apiLimiter, articleRouter);
app.use("/api/v1/medications", apiLimiter, medicationRouter);
app.use("/api/v1/posts", apiLimiter, postRouter);
app.use("/api/v1/comments", apiLimiter, commentRouter);
app.use("/api/v1/admin", apiLimiter, adminRouter);


app.use('/api/v1/chat', chatRouter);
app.use('/api/v1/appointments', appointmentRouter);

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Root endpoint
app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Welcome to AXON Medical API - Server is live and running",
    version: "1.0.0",
  });
});


// --- 7. Error Handling ---

// 404 handler
app.use((req, res, next) => {
  next(
    new AppError(
      msg(
        `العنوان المطلوب ${req.originalUrl} غير موجود!`,
        `The requested path ${req.originalUrl} was not found!`,
      ),
      404,
    ),
  );
});

// Global error handler
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  const lang = getLanguage(req);
  let message;

  // Resolve bilingual messages
  const resolveMsg = (msgObj, language) => {
    if (typeof msgObj === "string") return msgObj;
    if (typeof msgObj === "object" && msgObj !== null) {
      return msgObj[language] || msgObj["ar"] || msgObj["en"] || String(msgObj);
    }
    return String(msgObj);
  };

  if (err.messages && typeof err.messages === "object") {
    message = resolveMsg(err.messages, lang);
  } else {
    message = resolveMsg(err.message, lang);
  }

  // Production logging for server errors
  if (process.env.NODE_ENV === "production" && err.statusCode >= 500) {
    console.error("Production Error:", {
      statusCode: err.statusCode,
      message: err.message,
      url: req.originalUrl,
      method: req.method,
    });
  }

  res.status(err.statusCode).json({
    status: err.status,
    message,
    ...(process.env.NODE_ENV === "development" && {
      stack: err.stack,
      error: err,
    }),
  });
});

export default app;
