import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url"; // Add this line

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Absolute path setup
const rootPath = process.cwd();

// 2. Directory definitions
const uploadDirs = {
  radiology: path.join(rootPath, "Uploads", "Radiology"),
  certificates: path.join(rootPath, "Uploads", "Certificates"),
  personal: path.join(rootPath, "Uploads", "PersonalPhoto"),
};

// 3. Ensure directories exist
Object.values(uploadDirs).forEach((absolutePath) => {
  if (!fs.existsSync(absolutePath)) {
    fs.mkdirSync(absolutePath, { recursive: true });
    console.log(`✅ Created missing directory: ${absolutePath}`);
  }
});

// 4. Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let targetDir = path.join(rootPath, "Uploads");

    if (file.fieldname === "radiologyImage") {
      targetDir = uploadDirs.radiology;
    } else if (file.fieldname === "licenseImage") {
      targetDir = uploadDirs.certificates;
    } else if (file.fieldname === "personalPhoto") {
      targetDir = uploadDirs.personal;
    }
    cb(null, targetDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const cleanFileName = file.originalname.replace(/\s+/g, "_");
    cb(null, `${uniqueSuffix}-${cleanFileName}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only JPG/PNG allowed."), false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
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
