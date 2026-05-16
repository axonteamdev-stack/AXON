import multer from "multer";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { msg } from "../utils/i18n.js";

const UPLOAD_DIR = process.env.UPLOAD_DIR || "./uploads";
const MAX_FILE_SIZE =
  (Number(process.env.MAX_FILE_SIZE_MB) || 10) * 1024 * 1024;
const MAX_FILES = 10;

const TEMP_DIR = path.join(UPLOAD_DIR, ".temp");

// ── field → final folder mapping ────────────────────────────────
const FIELD_TO_FOLDER = {
  personalPhoto: "personalPhoto",
  licenseImage: "certificates",
  radiologyImage: "radiology",
  labImage: "labTests",
  postImage: "posts",
  articleImage: "articles", // ← NEW: dedicated folder for articles
};

const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true, mode: 0o750 });
  }
};

// ── ensure .temp mirrors the upload structure ───────────────────
const ensureTempStructure = () => {
  ensureDir(TEMP_DIR);
  Object.values(FIELD_TO_FOLDER).forEach((folder) => {
    ensureDir(path.join(TEMP_DIR, folder));
  });
};

// ── storage: save to .temp first ────────────────────────────────
const storage = multer.diskStorage({
  destination: (_req, file, cb) => {
    ensureTempStructure();
    const folder = FIELD_TO_FOLDER[file.fieldname];
    if (!folder) {
      return cb(
        new Error(
          msg("حقل ملف غير معروف", `Unknown file field: ${file.fieldname}`),
        ),
        null,
      );
    }
    cb(null, path.join(TEMP_DIR, folder));
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${crypto.randomBytes(8).toString("hex")}`;
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

// ── file filter: images only ────────────────────────────────────
const fileFilter = (_req, file, cb) => {
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

const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE, files: MAX_FILES },
  fileFilter,
});

// ── middleware presets ──────────────────────────────────────────
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
  article: upload.fields([{ name: "articleImage", maxCount: 5 }]), // ← NEW
  general: upload.fields([
    { name: "personalPhoto", maxCount: 1 },
    { name: "radiologyImage", maxCount: 5 },
    { name: "labImage", maxCount: 5 },
    { name: "licenseImage", maxCount: 1 },
    { name: "postImage", maxCount: 10 },
    { name: "articleImage", maxCount: 5 }, // ← NEW
  ]),
};

// ── move file from .temp to final destination ───────────────────
export const moveFromTemp = (filename, fieldname) => {
  const folder = FIELD_TO_FOLDER[fieldname];
  if (!folder || !filename) return null;

  const tempPath = path.join(TEMP_DIR, folder, filename);
  const finalDir = path.join(UPLOAD_DIR, folder);
  const finalPath = path.join(finalDir, filename);

  ensureDir(finalDir);

  if (!fs.existsSync(tempPath)) {
    throw new Error(msg("الملف المؤقت غير موجود", "Temp file not found"));
  }

  fs.renameSync(tempPath, finalPath);
  return { finalPath, url: `/uploads/${folder}/${filename}` };
};

// ── clean up temp files for a request ───────────────────────────
export const cleanupTemp = (filesMap) => {
  if (!filesMap) return;
  Object.values(filesMap)
    .flat()
    .forEach((file) => {
      if (file?.path && fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
    });
};

// ── error handler ───────────────────────────────────────────────
export const handleMulterError = (err, _req, res, next) => {
  if (
    !(err instanceof multer.MulterError) &&
    err.code !== "INVALID_FILE_TYPE"
  ) {
    return next(err);
  }

  let message;
  let statusCode = 400;

  switch (err.code) {
    case "LIMIT_FILE_SIZE":
      message = msg(
        `حجم الملف يتجاوز ${MAX_FILE_SIZE / 1024 / 1024} ميجابايت`,
        `File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit`,
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
      message = err.message;
      break;
    default:
      message = msg("فشل في رفع الملف", "File upload failed");
      statusCode = 500;
  }

  res.status(statusCode).json({ status: "fail", message });
};

export default uploadMiddleware;
