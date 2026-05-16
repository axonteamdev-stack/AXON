import { Router } from "express";
import * as postController from "../controllers/postController.js";
import { protect } from "../middlewares/auth.js";
import { restrictTo } from "../middlewares/auth.js";
import { validateBody } from "../middlewares/validate.js";
import { validateObjectId } from "../middlewares/ValidateObjectId.js";
import uploadMiddleware from "../middlewares/upload.js";
import { z } from "zod";

const router = Router();

// ═══════════════════════════════════════════════════════════════
// TAG PARSER MIDDLEWARE
// Converts JSON string or comma-separated tags to array
// ═══════════════════════════════════════════════════════════════
const parseTags = (req, res, next) => {
  if (req.body.tags && typeof req.body.tags === "string") {
    try {
      // Try JSON parse first: "["heart", "health"]"
      req.body.tags = JSON.parse(req.body.tags);
    } catch {
      // Fallback: comma-separated "heart, health"
      req.body.tags = req.body.tags
        .split(",")
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean);
    }
  }
  next();
};

// ═══════════════════════════════════════════════════════════════
// DUAL TAG SCHEMAS
// ═══════════════════════════════════════════════════════════════

// ── Schema A: Flexible ────────────────────────────────────────
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

// ── Schema B: Strict Enum ─────────────────────────────────────
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

// ═══════════════════════════════════════════════════════════════

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

// Articles — Doctors only (strict tags + articleImage → articles/ folder)
router.post(
  "/articles",
  restrictTo("doctor"),
  uploadMiddleware.article,
  parseTags, // ← ADDED: converts string tags to array before validation
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

// Community posts — Patients only (flexible tags + postImage → posts/ folder)
router.post(
  "/community",
  restrictTo("patient"),
  uploadMiddleware.post,
  parseTags, // ← ADDED: converts string tags to array before validation
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

// Update / Delete — owner only (enforced in service)
router.patch("/:id", validateObjectId("id"), postController.update);
router.delete("/:id", validateObjectId("id"), postController.remove);

// Like / Reaction — Patients only
router.post(
  "/:id/like",
  restrictTo("patient"),
  validateObjectId("id"),
  postController.toggleLike,
);

// Comments — Patients only, community posts only
router.post(
  "/:id/comments",
  restrictTo("patient"),
  validateObjectId("id"),
  validateBody(
    z.object({
      content: z.string().min(1).max(2000),
    }),
  ),
  postController.addComment,
);

export default router;
