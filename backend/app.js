import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import helmet from "helmet";
import mongoose from "mongoose";
import mongoSanitize from "mongo-sanitize";

import { setLanguage } from "./src/middlewares/i18n.js";
import { errorHandler } from "./src/middlewares/errorHandler.js";
import routes from "./src/routes/index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

if (process.env.NODE_ENV === "production") {
    app.set("trust proxy", 1);
}

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

app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ limit: "100kb", extended: true }));
app.use(cookieParser());

// FIX: Only sanitize req.body, don't reassign read-only req.query/req.params
app.use((req, res, next) => {
    if (req.body) req.body = mongoSanitize(req.body);
    next();
});

app.use(setLanguage);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/v1", routes);

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
