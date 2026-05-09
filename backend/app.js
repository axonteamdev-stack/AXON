import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import mongoose from "mongoose";

import { setLanguage } from "./src/utils/i18n.js";
import { requestId } from "./src/middlewares/requestId.js";
import { requestLogger } from "./src/config/logger.js";
import { swaggerSpec } from "./src/config/swagger.js";
import { errorHandler } from "./src/middlewares/errorHandler.js";

// Routes
import authRouter from "./src/routes/authRoutes.js";
import userRouter from "./src/routes/userRoutes.js";
import adminRouter from "./src/routes/adminRoutes.js";
import articleRouter from "./src/routes/articleRoutes.js";
import medicationRouter from "./src/routes/medicationRoutes.js";
import postRouter from "./src/routes/postRoutes.js";
import commentRouter from "./src/routes/commentRoutes.js";
import chatRouter from "./src/routes/chatRoutes.js";
import appointmentRouter from "./src/routes/appointmentRoutes.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

// Trust proxy only in production
if (process.env.NODE_ENV === "production") {
    app.set("trust proxy", 1);
}

// Security middleware
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || [
    "http://localhost:3000",
];

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
        allowedHeaders: ["Content-Type", "Authorization", "X-API-Version"],
        maxAge: 3600,
    }),
);

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
        hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
        frameguard: { action: "deny" },
        referrerPolicy: { policy: "strict-origin-when-cross-origin" },
    }),
);

// ✅ CUSTOM NoSQL sanitization middleware (replaces express-mongo-sanitize)
const mongoSanitizeMiddleware = (options = {}) => {
    const replaceWith = options.replaceWith || "_";

    const sanitize = (obj) => {
        if (typeof obj !== "object" || obj === null) return obj;

        if (Array.isArray(obj)) {
            return obj.map((item) => sanitize(item));
        }

        const clean = {};
        for (const [key, value] of Object.entries(obj)) {
            // Replace $ and . in keys to prevent NoSQL injection
            const safeKey = key.replace(/^\$|\./g, replaceWith);
            clean[safeKey] =
                typeof value === "object" ? sanitize(value) : value;
        }
        return clean;
    };

    return (req, res, next) => {
        if (req.body) req.body = sanitize(req.body);
        if (req.query) {
            const clean = sanitize(req.query);
            Object.keys(clean).forEach((key) => {
                req.query[key] = clean[key];
            });
        }
        if (req.params) req.params = sanitize(req.params);
        next();
    };
};

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ limit: "10kb", extended: true }));
app.use(mongoSanitizeMiddleware({ replaceWith: "_" }));
app.use(cookieParser());

// Request ID + Language + Logging
app.use(requestId);
app.use(setLanguage);
app.use(requestLogger);

// Static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// API Routes (v2)
app.use("/api/v2/auth", authRouter);
app.use("/api/v2/users", userRouter);
app.use("/api/v2/articles", articleRouter);
app.use("/api/v2/medications", medicationRouter);
app.use("/api/v2/posts", postRouter);
app.use("/api/v2/comments", commentRouter);
app.use("/api/v2/admin", adminRouter);
app.use("/api/v2/chat", chatRouter);
app.use("/api/v2/appointments", appointmentRouter);

// Docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health check
app.get("/health", async (req, res) => {
    const healthcheck = {
        status: "ok",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        requestId: req.requestId,
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

// Root
app.get("/", (_req, res) => {
    res.status(200).json({
        status: "success",
        message: "Welcome to AXON Medical API - Server is live",
        version: "2.0.0",
    });
});

// 404 handler
app.use(
    "/favicon.ico",
    express.static(path.join(__dirname, "public", "favicon.ico")),
);
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

// Global error handler
app.use(errorHandler);

export default app;
