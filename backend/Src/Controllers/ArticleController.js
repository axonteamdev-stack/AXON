import Article from "../Models/ArticleModel.js";
import User from "../Models/UserModel.js";
import { catchAsync, sendResponse } from "../Utils/AppError.js"; // استيراد الدالة الجديدة
import AppError from "../Utils/AppError.js";
import path from "path";
import fs from "fs";

/**
 * دالة مساعدة لحفظ صورة المقال
 */
const savePostFile = (file) => {
  if (!file || !file.buffer) return null;
  const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
  const fileName = `article-${uniqueSuffix}${path.extname(file.originalname)}`;
  const targetDir = path.join(process.cwd(), "Uploads/Articles");
  
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
  
  const filePath = path.join(targetDir, fileName);
  fs.writeFileSync(filePath, file.buffer);
  return `Uploads/Articles/${fileName}`.replace(/\\/g, "/");
};

// 1. إنشاء مقال جديد
export const createArticle = catchAsync(async (req, res, next) => {
  const { title, content } = req.body;

  let imagePath = null;
  if (req.files?.postImage) {
    imagePath = savePostFile(req.files.postImage[0]);
  }

  const newArticle = await Article.create({
    doctor: req.user.id,
    title,
    content,
    image: imagePath
  });

  // تطبيق sendResponse للنجاح
  sendResponse(res, 201, {
    ar: 'تم نشر المقال بنجاح',
    en: 'Article published successfully'
  }, newArticle);
});

// 2. جلب جميع المقالات
export const getAllArticles = catchAsync(async (req, res) => {
  const articlesData = await Article.find()
    .populate('doctor', 'fullName personalPhoto')
    .sort('-createdAt');

  // إرسال البيانات مع رسالة نجاح مترجمة
  sendResponse(res, 200, {
    ar: 'تم جلب جميع المقالات بنجاح',
    en: 'All articles fetched successfully'
  }, articlesData);
});

// 3. جلب مقالات الدكاترة المتابعين
export const getFollowingArticles = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  const followingDoctors = user.following; 

  if (!followingDoctors || followingDoctors.length === 0) {
    return sendResponse(res, 200, {
        ar: 'أنت لا تتابع أي أطباء حالياً',
        en: 'You are not following any doctors yet'
    }, []);
  }

  const articles = await Article.find({
    doctor: { $in: followingDoctors }
  })
  .populate('doctor', 'fullName personalPhoto')
  .sort('-createdAt');

  sendResponse(res, 200, {
    ar: 'تم جلب مقالات الأطباء المتابعين',
    en: 'Following feed articles fetched successfully'
  }, articles);
});

// 4. جلب مقالاتي (خاص بالدكتور)
export const getMyArticles = catchAsync(async (req, res, next) => {
  const articles = await Article.find({ doctor: req.user.id }).sort("-createdAt");

  sendResponse(res, 200, {
    ar: 'تم جلب مقالاتك الخاصة بنجاح',
    en: 'Your articles fetched successfully'
  }, articles);
});










export const getArticleDetails = catchAsync(async (req, res, next) => {
    const article = await Article.findOne({ _id: req.params.id})
        .select("doctor title content image"); 

    if (!article) {
        return next(new AppError({
            ar: "هذا المقال غير موجود",
            en: "This article was not found"
        }, 404));
    }

    const articleData = {
        _id: article._id,
        doctor: article.doctor,
        title: article.title,
        content: article.content,
        image: article.image,
    };

    sendResponse(res, 200, {
        ar: "تم جلب بيانات المقال بنجاح",
        en: "Doctor article fetched successfully"
    }, { article: articleData });
});
