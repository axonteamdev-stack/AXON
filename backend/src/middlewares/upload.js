import multer from "multer";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { msg } from "../utils/i18n.js";

const UPLOAD_DIR = "uploads";
const TEMP_DIR = path.join(UPLOAD_DIR, ".temp");

// Field name → Final folder mapping
const FIELD_TO_FOLDER = {
  personalPhoto: "personalPhoto",
  licenseImage: "certificates",
  postImage: "posts",
  articleImage: "articles",
  radiologyImage: "radiology",
  labImage: "labTests",
};

// Ensure directory exists
const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// Initialize temp directory (flat — no subfolders)
ensureDir(TEMP_DIR);

// Flat temp storage — all files go directly to uploads/.temp/
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, TEMP_DIR); // ← Flat: all files in uploads/.temp/
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${crypto.randomBytes(8).toString("hex")}`;
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

// File filter (images + PDFs)
const fileFilter = (_req, file, cb) => {
  const allowedMimes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "application/pdf",
  ];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        msg(
          "نوع الملف غير مدعوم. يسمح فقط بـ: JPEG, PNG, GIF, WebP, PDF",
          "Unsupported file type. Only: JPEG, PNG, GIF, WebP, PDF are allowed",
        ),
      ),
      false,
    );
  }
};

// Multer instance
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
    files: 10,
  },
});

// Move file from flat temp to final folder
export const moveFromTemp = (filename, fieldname) => {
  const folder = FIELD_TO_FOLDER[fieldname];
  if (!folder || !filename) return null;

  const tempPath = path.join(TEMP_DIR, filename); // ← Flat temp path
  const finalDir = path.join(UPLOAD_DIR, folder);
  const finalPath = path.join(finalDir, filename);

  ensureDir(finalDir);

  if (!fs.existsSync(tempPath)) {
    throw new Error(msg("الملف المؤقت غير موجود", "Temp file not found"));
  }

  fs.renameSync(tempPath, finalPath);
  return { finalPath, url: `/uploads/${folder}/${filename}` };
};

// Cleanup temp files (flat structure)
export const cleanupTemp = (files) => {
  if (!files) return;

  const allFiles = Array.isArray(files) ? files : Object.values(files).flat();

  allFiles.forEach((file) => {
    if (file?.path && fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }
  });
};

// Presets for different routes
const uploadMiddleware = {
  // Patient signup — personal photo + optional radiology/lab
  signupPatient: upload.fields([
    { name: "personalPhoto", maxCount: 1 },
    { name: "radiologyImage", maxCount: 5 },
    { name: "labImage", maxCount: 5 },
  ]),

  // Doctor signup — license + personal photo
  doctor: upload.fields([
    { name: "licenseImage", maxCount: 1 },
    { name: "personalPhoto", maxCount: 1 },
  ]),

  // Post image
  post: upload.single("postImage"),

  // Article image
  article: upload.single("articleImage"),

  // Patient records — radiology/lab tests
  patient: upload.fields([
    { name: "radiologyImage", maxCount: 5 },
    { name: "labImage", maxCount: 5 },
  ]),

  // User profile photo
  userPhoto: upload.single("personalPhoto"),

  // Chat message image
  message: upload.single("image"),

  // General single file
  general: upload.single("file"),
};

export default uploadMiddleware;
