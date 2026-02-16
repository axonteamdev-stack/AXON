import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOADS_BASE =
  process.env.UPLOADS_PATH || path.join(__dirname, "../../Uploads");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = UPLOADS_BASE;

    // تحديد المجلد بناءً على اسم الحقل (fieldname) المرسل من الفرونت إند
    if (file.fieldname === "radiologyImage") {
      folder = path.join(UPLOADS_BASE, "Radiology");
    } else if (file.fieldname === "licenseImage") {
      folder = path.join(UPLOADS_BASE, "Certificates");
    } else if (file.fieldname === "personalPhoto") {
      folder = path.join(UPLOADS_BASE, "PersonalPhoto");
    }

    // التأكد من وجود المجلد برمجياً لزيادة الأمان
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
    }

    cb(null, folder);
  },
  filename: (req, file, cb) => {
    // استخدام timestamp مع الاسم الأصلي لتجنب تكرار الأسماء
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only JPEG and PNG are allowed."), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

export default {
  patient: upload.fields([
    { name: "radiologyImage", maxCount: 1 },
    { name: "personalPhoto", maxCount: 1 },
  ]),
  doctor: upload.fields([
    { name: "licenseImage", maxCount: 1 },
    { name: "personalPhoto", maxCount: 1 },
  ]),
};
