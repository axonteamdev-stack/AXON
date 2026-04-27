import Article from "../Models/ArticleModel.js";
import User from "../Models/UserModel.js";
import { catchAsync, sendResponse } from "../Utils/AppError.js";
import { msg } from "../Utils/ResponseHelper.js";
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
    image: imagePath,
  });

  sendResponse(
    res,
    201,
    msg("تم نشر المقال بنجاح", "Article published successfully"),
    newArticle,
  );
});

// 2. جلب جميع المقالات
export const getAllArticles = catchAsync(async (req, res) => {
  const articlesData = await Article.find()
    .populate("doctor", "fullName personalPhoto")
    .sort("-createdAt");

  sendResponse(
    res,
    200,
    msg("تم جلب جميع المقالات بنجاح", "All articles fetched successfully"),
    articlesData,
  );
});

// 3. جلب مقالات الدكاترة المتابعين
export const getFollowingArticles = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  const followingDoctors = user.following;

  if (!followingDoctors || followingDoctors.length === 0) {
    return sendResponse(
      res,
      200,
      msg("لا توجد أطباء تتابعهم", "No doctors following"),
      [],
    );
  }

  const articles = await Article.find({
    doctor: { $in: followingDoctors },
  })
    .populate("doctor", "fullName personalPhoto")
    .sort("-createdAt");

  sendResponse(
    res,
    200,
    msg(
      "تم جلب مقالات المتابعين بنجاح",
      "Following articles fetched successfully",
    ),
    articles,
  );
});

// 4. جلب مقالاتي (خاص بالدكتور)
export const getMyArticles = catchAsync(async (req, res, next) => {
  const articles = await Article.find({ doctor: req.user.id }).sort(
    "-createdAt",
  );

  sendResponse(
    res,
    200,
    msg("تم جلب مقالاتي بنجاح", "My articles fetched successfully"),
    articles,
  );
});

// 5. جلب تفاصيل المقال
export const getArticleDetails = catchAsync(async (req, res, next) => {
  const article = await Article.findOne({ _id: req.params.id }).select(
    "doctor title content image likes",
  );

  if (!article) {
    return next(
      new AppError(msg("المقال غير موجود", "Article not found"), 404),
    );
  }

  const articleData = {
    _id: article._id,
    doctor: article.doctor,
    title: article.title,
    content: article.content,
    image: article.image,
    likes: article.likes,
  };

  sendResponse(
    res,
    200,
    msg("تم جلب تفاصيل المقال بنجاح", "Article details fetched successfully"),
    {
      article: articleData,
    },
  );
});

// --- NEW COMMUNITY FEATURES ---

// 6. Like / Unlike Toggle
export const toggleLike = catchAsync(async (req, res, next) => {
  const article = await Article.findById(req.params.id);

  if (!article) {
    return next(new AppError(ArticleMessages.ARTICLE_NOT_FOUND, 404));
  }

  const isLiked = article.likes.includes(req.user.id);

  if (isLiked) {
    article.likes = article.likes.filter(
      (id) => id.toString() !== req.user.id.toString(),
    );
  } else {
    article.likes.push(req.user.id);
  }

  await article.save();

  sendResponse(
    res,
    200,
    {}, // Empty message object since toggle like has dynamic messaging
    {
      likeCount: article.likes.length,
      isLiked: !isLiked,
    },
  );
});

// Delete Article (With Ownership Check)
export const deleteArticle = catchAsync(async (req, res, next) => {
  const article = await Article.findById(req.params.id);

  if (!article) {
    return next(
      new AppError(msg("المقال غير موجود", "Article not found"), 404),
    );
  }

  // Verify ownership or Admin role
  if (article.doctor.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new AppError(
        msg(
          "أنت غير مصرح بحذف هذا المقال",
          "You are not authorized to delete this article",
        ),
        403,
      ),
    );
  }

  await Article.findByIdAndDelete(req.params.id);

  sendResponse(
    res,
    200,
    msg("تم حذف المقال بنجاح", "Article deleted successfully"),
    null,
  );
});
