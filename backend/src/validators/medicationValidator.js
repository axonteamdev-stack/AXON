import { z } from "zod";
import { msg } from "../utils/i18n.js";

const FREQUENCY_OPTIONS = ["once daily", "twice daily", "three times daily"];
const DOSAGE_UNITS = ["mg", "g", "ml", "tablet", "capsule", "drop"];
const DOSE_STATUSES = ["pending", "taken", "skipped", "missed"];

const objectId = z.string().refine((val) => /^[0-9a-fA-F]{24}$/.test(val), msg("معرف غير صالح", "Invalid ID"));

export const addMedicationSchema = z.object({
  medicineName: z.string().min(1, msg("اسم الدواء مطلوب", "Medicine name is required")),
  dosage: z.object({
    amount: z.number().positive(msg("الجرعة يجب أن تكون أكبر من صفر", "Dosage must be greater than zero")),
    unit: z.enum(DOSAGE_UNITS, msg("وحدة جرعة غير صالحة", "Invalid dosage unit")),
  }).optional(),
  frequency: z.enum(FREQUENCY_OPTIONS, msg("تكرار غير صالح", "Invalid frequency")),
  intakeTime: z.array(z.string().regex(/^(0?[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM)$/i, msg("صيغة الوقت غير صالحة", "Invalid time format"))).min(1),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  notes: z.string().max(500, msg("الملاحظات طويلة جداً", "Notes are too long")).optional(),
  prescribedBy: z.string().optional(),
});

export const updateMedicationSchema = addMedicationSchema.partial();

export const doseActionSchema = z.object({
  medicationId: z.string().min(1, msg("معرف الدواء مطلوب", "Medication ID is required")),
  doseId: z.string().min(1, msg("معرف الجرعة مطلوب", "Dose ID is required")).optional(),
  action: z.enum(DOSE_STATUSES, msg("إجراء غير صالح", "Invalid action")),
  takenAt: z.string().datetime().optional(),
  notes: z.string().max(500).optional(),
  reason: z.string().max(500).optional(),
});
