import { Router } from "express";
import * as postController from "../controllers/postController.js";
import { protect } from "../middlewares/auth.js";
import { restrictTo } from "../middlewares/auth.js";
import { validateBody } from "../middlewares/validate.js";
import { validateObjectId } from "../middlewares/ValidateObjectId.js";
import { parseUniversal } from "../middlewares/parseUniversal.js";
import { z } from "zod";

const router = Router();

const parseTags = (req, res, next) => {
  if (req.body.tags && typeof req.body.tags === "string") {
    try {
      req.body.tags = JSON.parse(req.body.tags);
    } catch {
      req.body.tags = req.body.tags
        .split(",")
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean);
    }
  }
  next();
};

const communityTagsSchema = z
  .array(
    z
      .string()
      .min(2)
      .max(20)
      .transform((t) => t.toLowerCase().trim()),
  )
  .max(5)
  .optional()
  .transform((tags) => (tags ? [...new Set(tags)] : undefined));

const ALLOWED_TAGS = [
  "heart",
  "health",
  "diabetes",
  "nutrition",
  "mental-health",
  "cardiology",
  "pediatrics",
  "dermatology",
  "orthopedics",
  "neurology",
  "oncology",
  "emergency",
  "prevention",
  "lifestyle",
  "medication",
  "surgery",
  "vaccination",
  "women-health",
  "men-health",
  "elderly-care",
];

const articleTagsSchema = z.array(z.enum(ALLOWED_TAGS)).max(5).optional();

router.get("/articles", postController.getAllArticles);

router.get("/community", postController.getAllCommunityPosts);

router.get(
  "/doctor/:doctorId",
  validateObjectId("doctorId"),
  postController.getByDoctor,
);

router.get("/:id", validateObjectId("id"), postController.getById);

router.get("/:id/comments", validateObjectId("id"), postController.getComments);

router.use(protect);

router.post(
  "/articles",
  restrictTo("doctor"),
  parseUniversal(["articleImage"]),
  parseTags,
  validateBody(
    z.object({
      title: z.string().min(5).max(200),
      content: z.string().min(10),
      image: z.string().optional(),
      category: z.string().optional(),
      tags: articleTagsSchema,
    }),
  ),
  postController.createArticle,
);

router.post(
  "/community",
  restrictTo("patient"),
  parseUniversal(["postImage"]),
  parseTags,
  validateBody(
    z.object({
      title: z.string().min(5).max(200),
      content: z.string().min(10),
      image: z.string().optional(),
      tags: communityTagsSchema,
    }),
  ),
  postController.createCommunityPost,
);

router.patch("/:id", validateObjectId("id"), postController.update);

router.delete("/:id", validateObjectId("id"), postController.remove);

router.post(
  "/:id/like",
  restrictTo("patient"),
  validateObjectId("id"),
  postController.toggleLike,
);

router.post(
  "/:id/comments",
  restrictTo("patient"),
  validateObjectId("id"),
  parseUniversal(),
  validateBody(
    z.object({
      content: z.string().min(1).max(2000),
    }),
  ),
  postController.addComment,
);

export default router;
