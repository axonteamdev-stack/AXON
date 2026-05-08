import { z } from "zod";
import { msg } from "../utils/i18n.js";

const DEFAULT_PAGE = 1;
const MIN_LIMIT = 1;
const MAX_LIMIT = 50;
const DEFAULT_LIMIT = 10;

const bilingual = (ar, en) => ({ ar, en });

export const paginationSchema = z.object({
  page: z.union([z.string(), z.number()])
    .transform((val) => typeof val === "string" ? parseInt(val, 10) : val)
    .refine((val) => Number.isInteger(val) && val >= DEFAULT_PAGE, bilingual(
      `رقم الصفحة يجب أن يكون ${DEFAULT_PAGE} على الأقل`,
      `Page number must be at least ${DEFAULT_PAGE}`
    ))
    .default(DEFAULT_PAGE),
  limit: z.union([z.string(), z.number()])
    .transform((val) => typeof val === "string" ? parseInt(val, 10) : val)
    .refine((val) => Number.isInteger(val) && val >= MIN_LIMIT && val <= MAX_LIMIT, bilingual(
      `عدد العناصر يجب أن يكون بين ${MIN_LIMIT} و ${MAX_LIMIT}`,
      `Limit must be between ${MIN_LIMIT} and ${MAX_LIMIT}`
    ))
    .default(DEFAULT_LIMIT),
});
