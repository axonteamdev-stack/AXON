import express from "express";
import * as postController from "../Controllers/PostController.js";
import { protect, restrictTo } from "../Middlewares/AuthMiddleware.js";
import * as ownershipMiddleware from "../Middlewares/OwnershipMiddleware.js";
import uploadMiddleware from "../Middlewares/UploadMiddleware.js";

const router = express.Router();

// --- Public Routes ---

router.get("/explore", postController.getExploreFeeds);

router.get("/search/tags", postController.searchByTags);

router.get("/:id", postController.getPostDetails);

// --- Protected Routes ---
router.use(protect);

router.post(
  "/",
  restrictTo("doctor"),
  uploadMiddleware.post,
  postController.createPost
);

router.get("/following-feed", postController.getFollowingFeeds);

router.get("/my/posts", postController.getMyPosts);

router.patch(
  "/:id",
  ownershipMiddleware.checkPostOwnership,
  uploadMiddleware.post,
  postController.updatePost
);

router.delete(
  "/:id",
  ownershipMiddleware.checkPostOwnership,
  postController.deletePost
);

router.patch("/:id/like", postController.toggleLike);

export default router;
