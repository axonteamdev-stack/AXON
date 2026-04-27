import multer from "multer";
import { msg } from "../Utils/ResponseHelper.js";

// ─── 1. Memory Storage ─────────────────────────────────────
const storage = multer.memoryStorage();

// ─── 2. File Filter with Bilingual Error ───────────────────
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    const error = new Error(
      msg(
        "نوع الملف غير مدعوم. يرجى رفع صور فقط.",
        "Unsupported file type. Please upload images only.",
      ),
    );
    error.code = "INVALID_FILE_TYPE";
    cb(error, false);
  }
};

// ─── 3. Multer Instance ────────────────────────────────────
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 10, // Max total files per request
  },
  fileFilter,
});

// ─── 4. Field Configurations ───────────────────────────────
const uploadMiddleware = {
  // Patient data
  patient: upload.fields([
    { name: "radiologyImage", maxCount: 10 },
    { name: "labImage", maxCount: 10 },
    { name: "personalPhoto", maxCount: 1 },
  ]),

  // Doctor data
  doctor: upload.fields([
    { name: "licenseImage", maxCount: 1 },
    { name: "personalPhoto", maxCount: 1 },
  ]),

  // Posts & articles
  post: upload.fields([
    { name: "postImage", maxCount: 10 },
  ]),

  // Admin general
  general: upload.fields([
    { name: "personalPhoto", maxCount: 1 },
    { name: "radiologyImage", maxCount: 10 },
    { name: "labImage", maxCount: 10 },
    { name: "licenseImage", maxCount: 1 },
    { name: "postImage", maxCount: 10 },
  ]),
};

// ─── 5. Multer Error Handler (for routes) ──────────────────
/**
 * Use this AFTER your upload middleware in routes:
 * router.post("/upload", uploadMiddleware.post, handleMulterError, controller)
 */
export const handleMulterError = (err, req, res, next) => {
  if (!(err instanceof multer.MulterError) && err.code !== "INVALID_FILE_TYPE") {
    return next(err); // Pass to global error handler
  }

  let message;
  let statusCode = 400;

  switch (err.code) {
    case "LIMIT_FILE_SIZE":
      message = msg(
        "حجم الملف يتجاوز 5 ميجا بايت",
        "File size exceeds 5MB limit",
      );
      break;

    case "LIMIT_UNEXPECTED_FILE":
      message = msg(
        "حقل الملف غير متوقع أو غير مسموح به",
        "Unexpected or disallowed file field",
      );
      break;

    case "LIMIT_FILE_COUNT":
      message = msg(
        "عدد الملفات يتجاوز الحد المسموح به",
        "Too many files uploaded",
      );
      break;

    case "INVALID_FILE_TYPE":
      message = err.message; // Already formatted by fileFilter
      break;

    default:
      message = msg(
        "فشل في رفع الملف",
        "File upload failed",
      );
      statusCode = 500;
  }

  res.status(statusCode).json({
    status: "fail",
    message,
  });
};

export default uploadMiddleware;
