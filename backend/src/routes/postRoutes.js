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

// ── Public routes ──────────────────────────
router.get("/", postController.getAll);
router.get(
  "/doctor/:doctorId",
  validateObjectId("doctorId"),
  postController.getByDoctor,
);
router.get("/:id", validateObjectId("id"), postController.getById);
router.get("/:id/comments", validateObjectId("id"), postController.getComments);

// ── Protected routes ───────────────────────
router.use(protect);

// Articles — Doctors only
router.post(
  "/articles",
  restrictTo("doctor"),
  uploadMiddleware.post,
  parseForm,
  validateBody(
    z.object({
      title: z.string().min(5).max(200),
      content: z.string().min(10),
      image: z.string().optional(),
      category: z.string().optional(),
      tags: z.array(z.string()).optional(),
    }),
  ),
  postController.createArticle,
);

// Community posts — Patients only
router.post(
  "/community",
  restrictTo("patient"),
  uploadMiddleware.post,
  parseForm,
  validateBody(
    z.object({
      title: z.string().min(5).max(200),
      content: z.string().min(10),
      image: z.string().optional(),
      tags: z.array(z.string()).optional(),
    }),
  ),
  postController.createCommunityPost,
);

// Update / Delete — owner only (enforced in service)
router.patch("/:id", validateObjectId("id"), postController.update);
router.delete("/:id", validateObjectId("id"), postController.remove);

// Like / Reaction — Patients only (for both articles & community posts)
router.post(
  "/:id/like",
  restrictTo("patient"),
  validateObjectId("id"),
  postController.toggleLike,
);

// Comments — Patients only, and only on community posts (enforced in service)
router.post(
  "/:id/comments",
  restrictTo("patient"),
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
