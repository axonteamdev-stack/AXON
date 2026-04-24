import express from "express";
import * as articleController from "../Controllers/ArticleController.js";
import * as authController from "../Controllers/AuthController.js";
import uploadMiddleware from "../Middlewares/UploadMiddleware.js";
import * as authMid from "../Middlewares/AuthMiddleware.js";


const router = express.Router();

// 1. عرض كل المقالات (للجميع - Public)
router.get("/", articleController.getAllArticles);

// --- كل المسارات القادمة تحتاج تسجيل دخول ---
router.use(authMid.protect);

// 2. الميزة الجديدة: جلب مقالات الدكاترة المتابعين فقط
router.get("/following-feed", articleController.getFollowingArticles);

// 3. إنشاء مقال جديد (للدكاترة فقط)
router.post(
    "/create",
    authMid.restrictTo("doctor"),
    uploadMiddleware.post,
    articleController.createArticle
);



router.get(
    "/my-articles", 
    authMid.protect, 
    authMid.restrictTo("doctor"), 
    articleController.getMyArticles
);



router.get("/getArticle/:id",
    authMid.protect, 
    articleController.getArticleDetails); 






export default router;
