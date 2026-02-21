import multer from "multer";

// 1. التغيير الجوهري: استخدام ذاكرة الرام (Memory Storage) 
// هذا يمنع الملف من النزول على الهارد ديسك في هذه المرحلة
const storage = multer.memoryStorage();

// 2. فلتر أنواع الملفات (يبقى كما هو للأمان)
const fileFilter = (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        // نستخدم AppError أو Error عادي حسب نظامك
        cb(new Error("Invalid file type. Only JPG/PNG allowed."), false);
    }
};

// 3. إعداد Multer بالذاكرة المؤقتة
export const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // حد أقصى 5 ميجا
});

// 4. التصدير النهائي (يبقى كما هو ليناسب الـ Routes)
export default {
    patient: upload.fields([
        { name: "radiologyImage", maxCount: 10 },
        { name: "personalPhoto", maxCount: 1 },
        { name: 'labImage', maxCount: 10 }, // ضيف السطر ده
    ]),
    doctor: upload.fields([
        { name: "licenseImage", maxCount: 1 },
        { name: "personalPhoto", maxCount: 1 },
    ]),
    general: upload.fields([
        { name: "personalPhoto", maxCount: 1 },
        { name: "radiologyImage", maxCount: 10 },
        { name: "labImage", maxCount: 10},    
        { name: "licenseImage", maxCount: 1 }
    ])
};
