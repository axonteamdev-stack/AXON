import { z } from "zod";

// --- Post Validation Schemas ---

export const createPostSchema = z.object({
  content: z
    .string()
    .min(1, {
      ar: "محتوى المنشور مطلوب",
      en: "Post content is required",
    })
    .max(5000, {
      ar: "محتوى المنشور لا يجب أن يتجاوز 5000 حرف",
      en: "Post content must not exceed 5000 characters",
    }),
  tags: z
    .array(z.string().trim())
    .optional()
    .refine((val) => !val || val.length <= 10, {
      ar: "لا يمكن إضافة أكثر من 10 تصنيفات",
      en: "Cannot add more than 10 tags",
    })
    .default([]),
  visibility: z
    .enum(["public", "followers", "private"])
    .optional()
    .default("public"),
});

export const updatePostSchema = z.object({
  content: z
    .string()
    .min(1, {
      ar: "محتوى المنشور مطلوب",
      en: "Post content is required",
    })
    .max(5000, {
      ar: "محتوى المنشور لا يجب أن يتجاوز 5000 حرف",
      en: "Post content must not exceed 5000 characters",
    })
    .optional(),
  tags: z
    .array(z.string().trim())
    .optional()
    .refine((val) => !val || val.length <= 10, {
      ar: "لا يمكن إضافة أكثر من 10 تصنيفات",
      en: "Cannot add more than 10 tags",
    }),
  visibility: z.enum(["public", "followers", "private"]).optional(),
});

export const paginationSchema = z.object({
  page: z
    .string()
    .transform((val) => parseInt(val, 10))
    .refine((val) => val >= 1, {
      ar: "رقم الصفحة يجب أن يكون 1 على الأقل",
      en: "Page number must be at least 1",
    })
    .default("1"),
  limit: z
    .string()
    .transform((val) => parseInt(val, 10))
    .refine((val) => val >= 1 && val <= 100, {
      ar: "عدد العناصر يجب أن يكون بين 1 و 100",
      en: "Limit must be between 1 and 100",
    })
    .default("10"),
});

// --- Comment Validation Schemas ---

export const createCommentSchema = z.object({
  content: z
    .string()
    .min(1, {
      ar: "محتوى التعليق مطلوب",
      en: "Comment content is required",
    })
    .max(2000, {
      ar: "محتوى التعليق لا يجب أن يتجاوز 2000 حرف",
      en: "Comment content must not exceed 2000 characters",
    }),
  parentCommentId: z.string().optional().nullable(),
});

export const updateCommentSchema = z.object({
  content: z
    .string()
    .min(1, {
      ar: "محتوى التعليق مطلوب",
      en: "Comment content is required",
    })
    .max(2000, {
      ar: "محتوى التعليق لا يجب أن يتجاوز 2000 حرف",
      en: "Comment content must not exceed 2000 characters",
    }),
});

// --- Helper function to validate data ---
export const validateData = (schema, data, lang = "ar") => {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error.issues && error.issues.length > 0) {
      const issue = error.issues[0];
      let message = issue.message;

      // إذا كانت الرسالة كائن {ar, en}
      if (typeof issue.message === "object") {
        message = issue.message[lang] || issue.message["ar"];
      }

      return {
        isValid: false,
        error: message,
      };
    }
    return {
      isValid: false,
      error:
        lang === "ar"
          ? "خطأ في التحقق من البيانات"
          : "Validation error occurred",
    };
  }
};
