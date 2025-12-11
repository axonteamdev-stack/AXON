import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import authRoutes from "./src/routes/AuthRoutes.js";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

// --- General Security and Middleware ---

// Set security HTTP headers
app.use(helmet());

app.use(cors());

// Body parser middleware to handle raw JSON data
app.use(express.urlencoded({ extended: true })); // لمعالجة بيانات الـ form

app.use(express.json());

// Cookie parser middleware
app.use(cookieParser());

// Rate Limiting to prevent brute-force attacks
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again after 15 minutes",
});
app.use(limiter);

// --- Static Files & Routes ---

// Serve the Uploads/Certificates folder publicly
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(
  "/uploads/certificates",
  express.static(path.join(__dirname, "Uploads", "Certificates"))
);

app.use(
  "/uploads/personalphoto",
  express.static(path.join(__dirname, "Uploads", "PersonalPhoto"))
);

app.use("/images", express.static(path.join(__dirname, "public/images")));

// --- Routes ---
app.use("/api/auth", authRoutes);
app.get("/", (req, res) => {
  res.status(200).send("Hello");
});

// --- Default Error Handling (404) ---
app.use((req, res, next) => {
  res.status(404).json({ message: `Not Found: ${req.originalUrl}` });
});

// --- General Error Handler (Catch all other errors) ---
app.use((err, req, res, next) => {
  console.error(err.stack);
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
});

export default app;
