import multer from "multer";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { msg } from "../utils/i18n.js";

const UPLOAD_DIR = process.env.UPLOAD_DIR || "./uploads";
const MAX_FILE_SIZE = (Number(process.env.MAX_FILE_SIZE_MB) || 10) * 1024 * 1024;
const MAX_FILES = 10;

const TEMP_DIR = path.join(UPLOAD_DIR, ".temp");

const ensureTempDir = () => {
  if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR, { recursive: true, mode: 0o750 });
  }
};

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    ensureTempDir();
    cb(null, TEMP_DIR);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${crypto.randomBytes(8).toString("hex")}`;
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

const fileFilter = (_req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    const error = new Error(msg("نوع الملف غير مدعوم. يرجى رفع صور فقط.", "Unsupported file type. Please upload images only."));
    error.code = "INVALID_FILE_TYPE";
    cb(error, false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE, files: MAX_FILES },
  fileFilter,
});

const uploadMiddleware = {
  patient: upload.fields([
    { name: "radiologyImage", maxCount: 5 },
    { name: "labImage", maxCount: 5 },
    { name: "personalPhoto", maxCount: 1 },
  ]),
  doctor: upload.fields([
    { name: "licenseImage", maxCount: 1 },
    { name: "personalPhoto", maxCount: 1 },
  ]),
  post: upload.fields([{ name: "postImage", maxCount: 10 }]),
  general: upload.fields([
    { name: "personalPhoto", maxCount: 1 },
    { name: "radiologyImage", maxCount: 5 },
    { name: "labImage", maxCount: 5 },
    { name: "licenseImage", maxCount: 1 },
    { name: "postImage", maxCount: 10 },
  ]),
};

export const handleMulterError = (err, req, res, next) => {
  if (!(err instanceof multer.MulterError) && err.code !== "INVALID_FILE_TYPE") {
    return next(err);
  }

  let message;
  let statusCode = 400;

  switch (err.code) {
    case "LIMIT_FILE_SIZE":
      message = msg(`حجم الملف يتجاوز ${MAX_FILE_SIZE / 1024 / 1024} ميجابايت`, `File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit`);
      break;
    case "LIMIT_UNEXPECTED_FILE":
      message = msg("حقل الملف غير متوقع أو غير مسموح به", "Unexpected or disallowed file field");
      break;
    case "LIMIT_FILE_COUNT":
      message = msg("عدد الملفات يتجاوز الحد المسموح به", "Too many files uploaded");
      break;
    case "INVALID_FILE_TYPE":
      message = err.message;
      break;
    default:
      message = msg("فشل في رفع الملف", "File upload failed");
      statusCode = 500;
  }

  res.status(statusCode).json({ status: "fail", message });
};

export default uploadMiddleware;
