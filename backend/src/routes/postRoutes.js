import { Router } from "express";
import * as postController from "../controllers/postController.js";
import { protect } from "../middlewares/auth.js";
import { restrictTo } from "../middlewares/auth.js";
import { validateBody } from "../middlewares/validate.js";
import { validateObjectId } from "../middlewares/ValidateObjectId.js";
import uploadMiddleware from "../middlewares/upload.js";
import { parseForm } from "../middlewares/parseForm.js";
import { z } from "zod";

const router = Router();

// Public routes
router.get("/", postController.getAll);
router.get(
  "/doctor/:doctorId",
  validateObjectId("doctorId"),
  postController.getByDoctor,
);
router.get("/:id", validateObjectId("id"), postController.getById);
router.get("/:id/comments", validateObjectId("id"), postController.getComments);

// Protected routes
router.use(protect);

router.post(
  "/",
  restrictTo("doctor"),
  uploadMiddleware.post,
  validateBody(
    z.object({
      title: z.string().min(5).max(200),
      content: z.string().min(10),
      image: z.string().optional(),
      category: z.string().optional(),
      tags: z.array(z.string()).optional(),
    }),
  ),
  postController.create,
);

router.patch(
  "/:id",
  restrictTo("doctor"),
  validateObjectId("id"),
  postController.update,
);
router.delete(
  "/:id",
  restrictTo("doctor"),
  validateObjectId("id"),
  postController.remove,
);
router.post("/:id/like", validateObjectId("id"), postController.toggleLike);
router.post(
  "/:id/comments",
  validateObjectId("id"),
  parseForm,
  validateBody(
    z.object({
      content: z.string().min(1).max(2000),
    }),
  ),
  postController.addComment,
);

export default router;
