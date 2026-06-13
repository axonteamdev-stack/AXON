import { z } from "zod";
import { msg } from "../utils/i18n.js";

const DOSAGE_UNITS = [
  "mg", "g", "ml", "l", "mcg", "IU", "units",
  "tablets", "capsules", "drops", "puffs", "patches",
];

const FREQUENCY_OPTIONS = [
  "once daily", "twice daily", "three times daily", "four times daily",
  "every 4 hours", "every 6 hours", "every 8 hours", "every 12 hours",
  "weekly", "monthly", "as needed",
];

export const createMedicationSchema = z.object({
  medicineName: z.string().min(2),
  dosage: z.object({
    value: z.coerce.number().min(0.1),
    unit: z.enum(DOSAGE_UNITS),
  }),
  frequency: z.enum(FREQUENCY_OPTIONS),
  startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/).optional(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  patientId: z.string().min(1).optional(),   // <-- optional for self
  indication: z.string().optional(),
  notes: z.string().optional(),
}).refine(
  (d) => d.startTime,
  { message: msg("يرجى إرسال startTime", "Provide startTime"), path: ["startTime"] },
);

export const updateMedicationSchema = z.object({
  medicineName: z.string().min(2).optional(),
  dosage: z.object({
    value: z.coerce.number().min(0.1),
    unit: z.enum(DOSAGE_UNITS),
  }).optional(),
  frequency: z.enum(FREQUENCY_OPTIONS).optional(),
  intakeTimes: z.array(z.string()).optional(),
  startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  indication: z.string().optional(),
  notes: z.string().optional(),
});

export const markDoseSchema = z.object({
  time: z.string(),
  status: z.enum(["taken", "skipped"]),
});
