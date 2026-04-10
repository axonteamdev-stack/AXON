import express from 'express';
// import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import AppError from './Src/Utils/AppError.js';
import { setLanguage } from './Src/Middlewares/LanguageMiddleware.js';
import authRouter from './Src/Routes/AuthRoutes.js';
import adminRouter from './Src/Routes/AdminRoutes.js';
import articleRouter from './Src/Routes/ArticleRoutes.js';
import medicationRouter from './Src/Routes/MedicationRoutes.js';

const app = express();

// --- 1. SETTINGS & SECURITY ---

// FIX: Trust the proxy headers to identify the real user IP
// This must be done before defining the rate limiter
app.set('trust proxy', 1); 

app.use(cors({
  origin: true,
  credentials: true
}));

// Standardizing the rate limiter configuration
const limiter = rateLimit({
  max: 100, 
  windowMs: 60 * 60 * 1000, 
  message: 'Too many requests from this IP, please try again in an hour!',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false,  // Disable the `X-RateLimit-*` headers
});
app.use('/api', limiter);

app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

// --- 2. STATIC FILES ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, 'Uploads')));
app.use(express.static('public'));

// --- 3. ROUTES ---
app.use(setLanguage);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/admin', adminRouter);
app.use('/api/v1/articles', articleRouter);
app.use('/api/v1/medications', medicationRouter);

app.get('/', (req, res) => {
    res.status(200).json({
        status: "success",
        message: "Welcome to MeddioDoc API - Server is live and running!"
    });
});

// 404 Handler
app.use((req, res, next) => {
    const error = new AppError({
        ar: `العنوان المطلوب ${req.originalUrl} غير موجود!`,
        en: `The requested path ${req.originalUrl} was not found!`
    }, 404);
    next(error);
});

// --- 4. GLOBAL ERROR HANDLER ---
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  const lang = req.lang || 'ar'; 
  let message = err.message;

  if (err.messages && typeof err.messages === 'object') {
    message = err.messages[lang] || err.messages['ar'];
  }

  res.status(err.statusCode).json({
    status: err.status,
    message: message,
    ...(process.env.NODE_ENV === 'development' && { 
        stack: err.stack, 
        error: err,
        detectedLang: lang 
    })
  });
});

export default app;
