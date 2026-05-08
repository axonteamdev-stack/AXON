import helmet from "helmet";
import cors from "cors";
import mongoSanitize from "express-mongo-sanitize";
import { ALLOWED_ORIGINS } from "../Config/cors.js";

export const corsOptions = {
  origin: (origin, callback) => {
    if (
      !origin ||
      ALLOWED_ORIGINS.has(origin) ||
      process.env.NODE_ENV !== "production"
    ) {
      callback(null, true);
    } else {
      callback(new Error("Origin not allowed"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  maxAge: 3600,
};

export const helmetConfig = helmet({
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
});

export const sanitize = (obj) =>
  mongoSanitize.sanitize(obj, { replaceWith: "_" });

export const sanitizeMiddleware = (req, _res, next) => {
  if (req.body) sanitize(req.body);
  if (req.params) sanitize(req.params);
  if (req.query) sanitize(req.query);
  next();
};
