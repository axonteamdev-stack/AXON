import { Router } from "express";
import { protect, restrictTo } from "../middlewares/auth.js";
import { createOwnershipMiddleware } from "../middlewares/checkOwnership.js";
import Article from "../models/articleModel.js";
import {
  createArticle,
  getAllArticles,
  getFollowingArticles,
  getMyArticles,
  getArticleDetails,
  toggleLike,
  deleteArticle,
  updateArticle,
} from "../controllers/articleController.js";
import uploadMiddleware from "../middlewares/upload.js";
import { validateBody } from "../middlewares/validate.js";
import { createArticleSchema } from "../validators/articleValidator.js";
import { validateObjectId } from "../middlewares/ValidateObjectId.js";

const router = Router();
const checkArticleOwnership = createOwnershipMiddleware(Article, "doctor", "article");

// Public routes
router.get("/", getAllArticles);
router.get("/:id", validateObjectId("id"), getArticleDetails);

// Protected routes
router.use(protect);
router.get("/following-feed", getFollowingArticles);
router.get("/my-articles", restrictTo("doctor"), getMyArticles);
router.post("/", restrictTo("doctor"), uploadMiddleware.post, validateBody(createArticleSchema), createArticle);
router.patch("/:id/like", toggleLike);
router.use("/:id", checkArticleOwnership);
router.patch("/:id", validateObjectId("id"), uploadMiddleware.post, updateArticle);
router.delete("/:id", validateObjectId("id"), deleteArticle);

export default router;
