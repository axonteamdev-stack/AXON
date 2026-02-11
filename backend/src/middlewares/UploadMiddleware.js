import multer from "multer";
import fs from "fs";
import path from "path";

// 1. الحصول على المسار المطلق لجذر المشروع (D:\...\MediCAlProV2)
const rootPath = process.cwd();

// 2. تعريف المجلدات باستخدام المسار المطلق الكامل
const uploadDirs = {
    radiology: path.join(rootPath, "Uploads", "Radiology"),
    certificates: path.join(rootPath, "Uploads", "Certificates"),
    personal: path.join(rootPath, "Uploads", "PersonalPhoto")
};

// 3. التحقق الذكي: نمر على كل المجلدات ونتأكد من وجودها
Object.values(uploadDirs).forEach((absolutePath) => {
    if (!fs.existsSync(absolutePath)) {
        // لن يدخل هنا ولن يطبع شيئاً إلا إذا كان المجلد مفقوداً فعلياً من الهارد ديسك
        fs.mkdirSync(absolutePath, { recursive: true });
        console.log(`✅ Created missing directory: ${absolutePath}`);
    }
});

// 4. إعدادات التخزين باستخدام المسارات المطلقة التي تم التحقق منها
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
