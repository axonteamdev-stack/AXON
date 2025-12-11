import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// المجلدات
const certificateDir = path.join(__dirname, "../../Uploads/Certificates");
const personalPhotoDir = path.join(__dirname, "../../Uploads/PersonalPhoto");

if (!fs.existsSync(certificateDir))
  fs.mkdirSync(certificateDir, { recursive: true });
if (!fs.existsSync(personalPhotoDir))
  fs.mkdirSync(personalPhotoDir, { recursive: true });

// تخزين الملفات
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "certificateImage") cb(null, certificateDir);
    else if (file.fieldname === "profileImage") cb(null, personalPhotoDir);
    else cb(new Error("Unknown file field"), false);
  },
  filename: (req, file, cb) => {
    const name = req.body.fullName?.replace(/\s+/g, "_") || "user";
    const role = req.body.role || "patient";
    cb(
      null,
      `${name}_${role}_${file.fieldname}${path.extname(file.originalname)}`
    );
  },
});

// تصفية الملفات
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) cb(null, true);
  else cb(new Error("Only image files are allowed!"), false);
};

// Middleware
const uploadMiddleware = {
  patient: multer({
    storage,
    fileFilter,
    limits: { fileSize: 1024 * 1024 * 5 },
  }).single("profileImage"),
  doctor: multer({
    storage,
    fileFilter,
    limits: { fileSize: 1024 * 1024 * 5 },
  }).fields([
    { name: "certificateImage", maxCount: 1 },
    { name: "profileImage", maxCount: 1 },
  ]),
};

export default uploadMiddleware;
