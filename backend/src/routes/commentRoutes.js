import { Router } from "express";
import { protect } from "../middlewares/auth.js";
import { createOwnershipMiddleware } from "../middlewares/checkOwnership.js";
import Comment from "../models/commentModel.js";
import {
  createComment,
  getPostComments,
  getCommentDetails,
  getCommentReplies,
  getCommentStats,
  getMyComments,
  updateComment,
  deleteComment,
  toggleCommentLike,
} from "../controllers/commentController.js";
import { validateBody, validateQuery } from "../middlewares/validate.js";
import {
  createCommentSchema,
  updateCommentSchema,
} from "../validators/commentValidator.js";
import { paginationSchema } from "../validators/sharedValidator.js";
import { validateObjectId } from "../middlewares/ValidateObjectId.js";

const router = Router({ mergeParams: true });
const checkCommentOwnership = createOwnershipMiddleware(Comment, "author", "comment");

// Public routes
router.get("/", validateQuery(paginationSchema), getPostComments);
router.get("/:commentId", validateObjectId("commentId"), getCommentDetails);
router.get("/:commentId/replies", validateQuery(paginationSchema), getCommentReplies);
router.get("/:commentId/stats", getCommentStats);

// Protected routes
router.use(protect);
router.post("/", validateBody(createCommentSchema), createComment);
router.get("/me/my-comments", getMyComments);
router.patch("/:commentId/like", toggleCommentLike);
router.use("/:commentId", checkCommentOwnership);
router.patch("/:commentId", validateObjectId("commentId"), validateBody(updateCommentSchema), updateComment);
router.delete("/:commentId", validateObjectId("commentId"), deleteComment);

export default router;
