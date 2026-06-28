import { z } from "zod";

export const askSchema = z.object({
  message: z.string().trim().min(1).max(2000),
  conversationId: z.string().optional(),
});
