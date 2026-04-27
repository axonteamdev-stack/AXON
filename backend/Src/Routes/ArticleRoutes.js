import express from "express";
import * as articleController from "../Controllers/ArticleController.js";
import { protect, restrictTo } from "../Middlewares/AuthMiddleware.js";
import uploadMiddleware from "../Middlewares/UploadMiddleware.js";

const router = express.Router();

// 1. Public - all articles
router.get("/", articleController.getAllArticles);

// --- All following routes require authentication ---
router.use(protect);

// 2. Following doctors' articles
router.get("/following-feed", articleController.getFollowingArticles);

// 3. Create article (doctors only)
router.post(
  "/create",
  restrictTo("doctor"),
  uploadMiddleware.post,
  articleController.createArticle
);

// 4. My articles (doctors only)
router.get(
  "/my-articles",
  restrictTo("doctor"),
  articleController.getMyArticles
);

// 5. Article details (any authenticated user)
router.get(
  "/getArticle/:id",
  articleController.getArticleDetails
);

// --- Community routes ---

// 6. Like/unlike article
router.patch("/:id/like", articleController.toggleLike);

// 7. Delete article (owner or admin)
router.delete("/deleteArticle/:id", articleController.deleteArticle);

export default router;
