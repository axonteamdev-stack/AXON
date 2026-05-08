import { z } from "zod";
import { msg } from "../utils/i18n.js";

export const sendMessageSchema = z.object({
  text: z.string().min(1, msg("الرسالة لا يمكن أن تكون فارغة", "Message cannot be empty")).max(2000),
  image: z.string().optional(),
});
