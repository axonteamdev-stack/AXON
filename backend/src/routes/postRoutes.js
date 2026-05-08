import { Router } from "express";
import { protect, restrictTo } from "../middlewares/auth.js";
import { createOwnershipMiddleware } from "../middlewares/checkOwnership.js";
import Post from "../models/postModel.js";
import commentRouter from "./commentRoutes.js";
import {
  getExploreFeeds,
  searchByTags,
  getPostDetails,
  createPost,
  getFollowingFeeds,
  getMyPosts,
  updatePost,
  deletePost,
  toggleLike,
} from "../controllers/postController.js";
import uploadMiddleware from "../middlewares/upload.js";
import { validateBody, validateQuery } from "../middlewares/validate.js";
import { createPostSchema, updatePostSchema } from "../validators/postValidator.js";
import { paginationSchema } from "../validators/sharedValidator.js";
import { validateObjectId } from "../middlewares/ValidateObjectId.js";

const router = Router();
const checkPostOwnership = createOwnershipMiddleware(Post, "author", "post");

// Public routes
router.get("/explore", validateQuery(paginationSchema), getExploreFeeds);
router.get("/search/tags", validateQuery(paginationSchema), searchByTags);
router.get("/:id", validateObjectId("id"), getPostDetails);

// Nested comments
router.use("/:postId/comments", commentRouter);

// Protected routes
router.use(protect);
router.post("/", restrictTo("doctor"), uploadMiddleware.post, validateBody(createPostSchema), createPost);
router.get("/following-feed", getFollowingFeeds);
router.get("/me", getMyPosts);
router.patch("/:id/like", toggleLike);
router.use("/:id", checkPostOwnership);
router.patch("/:id", validateObjectId("id"), uploadMiddleware.post, validateBody(updatePostSchema), updatePost);
router.delete("/:id", validateObjectId("id"), deletePost);

export default router;
