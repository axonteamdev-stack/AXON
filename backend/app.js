import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import AppError from "./src/utils/AppError.js";
import authRouter from "./src/routes/AuthRoutes.js";
import adminRouter from "./src/routes/AdminRoutes.js";

const app = express();

<<<<<<< HEAD
// --- 1. Security Middleware ---

// CORS Configuration
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? [process.env.CLIENT_URL, process.env.ADMIN_URL]
        : true,
    credentials: true,
  }),
);
=======

>>>>>>> c14f17e55e7cea92b340af07faa2542f98c003fc

// Helmet - Security headers (use once, not twice)
app.use(
  helmet({
    contentSecurityPolicy: false,
  }),
);

// Rate Limiting
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!",
});
app.use("/api", limiter);

// --- 2. Body Parser Middleware ---
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

// --- 3. Static Files ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "Uploads")));
app.use(express.static("public"));

// --- 4. Routes ---
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/admin", adminRouter);

<<<<<<< HEAD
// --- 5. 404 Handler ---
=======


app.get('/', (req, res) => {
    res.status(200).json({
        status: "success",
        message: "Welcome to MeddioDoc API - Server is live and runninggggg!"
    });
});

>>>>>>> c14f17e55e7cea92b340af07faa2542f98c003fc
app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// --- 6. Global Error Handler ---
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

export default app;
<<<<<<< HEAD
=======


>>>>>>> c14f17e55e7cea92b340af07faa2542f98c003fc
