import multer from "multer";

/**
 * 1. التخزين في الذاكرة المؤقتة فقط (Memory Storage)
 * الملف لا يُحفظ في أي مجلد في هذه المرحلة.
 */
const storage = multer.memoryStorage();

/**
 * 2. فلتر الأمان لأنواع الملفات
 */
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    } else {
        cb(new Error("نوع الملف غير مدعوم. يرجى رفع صور فقط."), false);
    }
};

/**
 * 3. إعداد Multer
 */
export const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // حد أقصى 5 ميجا بايت
    fileFilter,
});

/**
 * 4. التصدير النهائي (Strict Mode)
 * لا يوجد هنا أي مسارات (Paths) أو مجلدات (Folders).
 */
const uploadMiddleware = {
    // مخصص لبيانات المريض
    patient: upload.fields([
        { name: "radiologyImage", maxCount: 10 },
        { name: "labImage", maxCount: 10 },
        { name: "personalPhoto", maxCount: 1 },
    ]),

    // مخصص لبيانات الطبيب
    doctor: upload.fields([
        { name: "licenseImage", maxCount: 1 },
        { name: "personalPhoto", maxCount: 1 },
    ]),

    // مخصص للمنشورات والمقالات
    post: upload.fields([
        { name: "postImage", maxCount: 1 } 
    ]),

    // إعدادات عامة للأدمن
    general: upload.fields([
        { name: "personalPhoto", maxCount: 1 },
        { name: "radiologyImage", maxCount: 10 },
        { name: "labImage", maxCount: 10 },
        { name: "licenseImage", maxCount: 1 },
        { name: "postImage", maxCount: 1 }
    ])
};

export default uploadMiddleware;
