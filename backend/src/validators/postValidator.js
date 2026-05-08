import { z } from "zod";
import { msg } from "../utils/i18n.js";

const MAX_POST_LENGTH = 5000;
const MAX_TAGS = 10;

const bilingual = (ar, en) => ({ ar, en });

const postContent = z
  .string()
  .min(1, bilingual("محتوى المنشور مطلوب", "Post content is required"))
  .max(MAX_POST_LENGTH, bilingual(
    `محتوى المنشور لا يجب أن يتجاوز ${MAX_POST_LENGTH} حرف`,
    `Post content must not exceed ${MAX_POST_LENGTH} characters`
  ));

const tagsSchema = z
  .array(z.string().trim().min(1))
  .max(MAX_TAGS, bilingual(
    `لا يمكن إضافة أكثر من ${MAX_TAGS} تصنيفات`,
    `Cannot add more than ${MAX_TAGS} tags`
  ))
  .optional()
  .default([]);

const visibilitySchema = z
  .enum(["public", "followers", "private"])
  .optional()
  .default("public");

export const createPostSchema = z.object({
  content: postContent,
  tags: tagsSchema,
  visibility: visibilitySchema,
});

export const updatePostSchema = z.object({
  content: postContent.optional(),
  tags: tagsSchema.optional(),
  visibility: visibilitySchema.optional(),
});
