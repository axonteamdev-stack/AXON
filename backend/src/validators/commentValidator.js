import { z } from "zod";

const MAX_COMMENT_LENGTH = 2000;
const bilingual = (ar, en) => ({ ar, en });

const commentContent = z.string()
  .min(1, bilingual("محتوى التعليق مطلوب", "Comment content is required"))
  .max(MAX_COMMENT_LENGTH, bilingual(
    `محتوى التعليق لا يجب أن يتجاوز ${MAX_COMMENT_LENGTH} حرف`,
    `Comment content must not exceed ${MAX_COMMENT_LENGTH} characters`
  ));

export const createCommentSchema = z.object({
  content: commentContent,
  parentCommentId: z.string().optional().nullable(),
});

export const updateCommentSchema = z.object({
  content: commentContent,
});
