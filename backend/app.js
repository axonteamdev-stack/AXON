import express from 'express';
// import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
// import mongoSanitize from 'express-mongo-sanitize';
// import xss from 'xss-clean';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import AppError from './src/utils/AppError.js';
import authRouter from './src/routes/AuthRoutes.js';
import adminRouter from './src/routes/AdminRoutes.js';
import medicationRouter from './src/routes/MedicationRoutes.js';

const app = express();

// --- 1. الإعدادات الأمنية (Global Middlewares) ---

// إعدادات الـ CORS للربط مع React
// app.use(cors({
//   origin: 'http://localhost:3000', // ضع رابط تطبيق React هنا
//   credentials: true // للسماح بإرسال الـ Refresh Token عبر الكوكيز
// }));


app.use(cors({
  origin: true,
  credentials: true
}));

// حماية الـ Headers الخاصة بالسيرفر
// app.use(helmet());

// تسجيل الطلبات في الـ Console (أثناء التطوير فقط)
// if (process.env.NODE_ENV === 'development') {
//   app.use(morgan('dev'));
// }

// تحديد عدد الطلبات من نفس الـ IP لحماية السيرفر من الهجمات (Brute-force)
const limiter = rateLimit({
  max: 100, // حد أقصى 100 طلب
  windowMs: 60 * 60 * 1000, // خلال ساعة واحدة
  message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);

// قراءة البيانات من الـ Body (JSON) مع تحديد الحجم الأقصى
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser()); // لقراءة الـ Cookies (Refresh Token)

// // حماية البيانات من الـ NoSQL Query Injection
// app.use(mongoSanitize());

// // حماية البيانات من الـ XSS (إدخال أكواد HTML ضارة)
// app.use(xss());

// --- 2. الملفات الاستاتيكية (الصور) ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, 'Uploads')));

app.use(express.static('public'));

// --- 3. المسارات (Routes) ---

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/admin', adminRouter);
app.use('/api/v1/medications', medicationRouter);



app.get('/', (req, res) => {
    res.status(200).json({
        status: "success",
        message: "Welcome to MeddioDoc API - Server is live and runninggggg!"
    });
});

app.use((req, res, next) => {
    // الخيار الثاني: تمرير الخطأ لـ AppError ليتم معالجته في ملف الأخطاء الموحد
    const error = new AppError(`Can't find ${req.originalUrl} on this server!`, 404);
    next(error);
});

// --- 4. معالج الأخطاء العالمي (Global Error Handler) ---
// هذا الجزء هو الذي يرسل ردود منظمة لـ Flutter و React في حال حدوث أي خطأ
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    // في وضع التطوير فقط نرسل تفاصيل الخطأ (Stack)
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack, error: err })
  });
});

export default app;

