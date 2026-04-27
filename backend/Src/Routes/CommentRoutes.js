import express from "express";
import * as commentController from "../Controllers/CommentController.js";
import { protect } from "../Middlewares/AuthMiddleware.js";
import * as ownershipMiddleware from "../Middlewares/OwnershipMiddleware.js";

const router = express.Router();

// --- All comment routes require authentication ---
router.use(protect);

// --- Main Comment Routes ---

router.post("/:postId/comments", commentController.createComment);

router.get("/:postId/comments", commentController.getPostComments);

router.get("/comments/:commentId/details", commentController.getCommentDetails);

router.get("/comments/:commentId/replies", commentController.getCommentReplies);

router.get("/comments/stats/:commentId", commentController.getCommentStats);

router.get("/my/comments", commentController.getMyComments);

// --- Update & Delete (Ownership protected) ---

router.patch(
  "/comments/:commentId",
  ownershipMiddleware.checkCommentOwnership,
  commentController.updateComment
);

router.delete(
  "/comments/:commentId",
  ownershipMiddleware.checkCommentOwnership,
  commentController.deleteComment
);

router.patch("/comments/:commentId/like", commentController.toggleCommentLike);

export default router;
