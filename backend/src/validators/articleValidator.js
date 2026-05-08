import { z } from "zod";
import { msg } from "../utils/i18n.js";

export const createArticleSchema = z.object({
  title: z.string().min(5, msg("عنوان المقال مطلوب (5 أحرف على الأقل)", "Article title required (min 5 chars)")),
  content: z.string().min(10, msg("محتوى المقال مطلوب (10 أحرف على الأقل)", "Article content required (min 10 chars)")),
  category: z.string().optional(),
  tags: z.array(z.string()).max(10).optional(),
});
