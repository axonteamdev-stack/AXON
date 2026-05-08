import { z } from "zod";
import { msg } from "../utils/i18n.js";

const objectId = z.string().refine((val) => /^[0-9a-fA-F]{24}$/.test(val), msg("معرف غير صالح", "Invalid ID"));

export const createAppointmentSchema = z.object({
  doctorId: objectId,
  amount: z.number().positive(msg("المبلغ يجب أن يكون موجباً", "Amount must be positive")),
  date: z.string().datetime().optional(),
  notes: z.string().max(1000).optional(),
});

export const updateStatusSchema = z.object({
  status: z.enum([
    "pending", "confirmed", "completed", "cancelled", "no_show", "rescheduled"
  ], msg("حالة غير صالحة", "Invalid status")),
  reason: z.string().min(1).max(500).optional(),
  rescheduleDate: z.string().datetime().optional(),
});

export const rescheduleSchema = z.object({
  newDate: z.string().datetime(msg("تاريخ غير صالح", "Invalid date")),
  reason: z.string().max(500).optional(),
});

export const updateAppointmentSchema = createAppointmentSchema.partial();
