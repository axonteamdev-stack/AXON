import { z } from "zod";
import { VISIBILITY, FILE_LIMITS, PAGINATION } from "../Constants/index.js";

const MAX_POST_LENGTH = 5000;
const MAX_COMMENT_LENGTH = 2000;

const bilingual = (ar, en) => ({ ar, en });

const contentSchema = (max, messages) =>
    z.string().min(1, messages.required).max(max, messages.max);

const postContent = contentSchema(MAX_POST_LENGTH, {
    required: bilingual("محتوى المنشور مطلوب", "Post content is required"),
    max: bilingual(
        `محتوى المنشور لا يجب أن يتجاوز ${MAX_POST_LENGTH} حرف`,
        `Post content must not exceed ${MAX_POST_LENGTH} characters`,
    ),
});

const commentContent = contentSchema(MAX_COMMENT_LENGTH, {
    required: bilingual("محتوى التعليق مطلوب", "Comment content is required"),
    max: bilingual(
        `محتوى التعليق لا يجب أن يتجاوز ${MAX_COMMENT_LENGTH} حرف`,
        `Comment content must not exceed ${MAX_COMMENT_LENGTH} characters`,
    ),
});

const tagsSchema = z
    .array(z.string().trim().min(1))
    .max(
        FILE_LIMITS.MAX_TAGS,
        bilingual(
            `لا يمكن إضافة أكثر من ${FILE_LIMITS.MAX_TAGS} تصنيفات`,
            `Cannot add more than ${FILE_LIMITS.MAX_TAGS} tags`,
        ),
    )
    .optional()
    .default([]);

const visibilitySchema = z
    .enum([VISIBILITY.PUBLIC, VISIBILITY.FOLLOWERS, VISIBILITY.PRIVATE])
    .optional()
    .default(VISIBILITY.PUBLIC);

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

export const paginationSchema = z.object({
    page: z
        .union([z.string(), z.number()])
        .transform((val) => (typeof val === "string" ? parseInt(val, 10) : val))
        .refine(
            (val) => Number.isInteger(val) && val >= PAGINATION.DEFAULT_PAGE,
            bilingual(
                `رقم الصفحة يجب أن يكون ${PAGINATION.DEFAULT_PAGE} على الأقل`,
                `Page number must be at least ${PAGINATION.DEFAULT_PAGE}`,
            ),
        )
        .default(PAGINATION.DEFAULT_PAGE),
    limit: z
        .union([z.string(), z.number()])
        .transform((val) => (typeof val === "string" ? parseInt(val, 10) : val))
        .refine(
            (val) =>
                Number.isInteger(val) &&
                val >= PAGINATION.MIN_LIMIT &&
                val <= PAGINATION.MAX_LIMIT,
            bilingual(
                `عدد العناصر يجب أن يكون بين ${PAGINATION.MIN_LIMIT} و ${PAGINATION.MAX_LIMIT}`,
                `Limit must be between ${PAGINATION.MIN_LIMIT} and ${PAGINATION.MAX_LIMIT}`,
            ),
        )
        .default(PAGINATION.DEFAULT_LIMIT),
});

export const createCommentSchema = z.object({
    content: commentContent,
    parentCommentId: z.string().optional().nullable(),
});

export const updateCommentSchema = z.object({
    content: commentContent,
});

export const validateData = (schema, data, lang = "ar") => {
    const result = schema.safeParse(data);

    if (result.success) {
        return { isValid: true, data: result.data };
    }

    const issue = result.error.issues[0];
    const message =
        typeof issue.message === "object"
            ? issue.message[lang] || issue.message.ar
            : issue.message;

    return {
        isValid: false,
        error: message,
    };
};
