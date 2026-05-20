import { z } from "zod";

const DOSAGE_UNITS = [
  "mg",
  "g",
  "ml",
  "l",
  "mcg",
  "IU",
  "units",
  "tablets",
  "capsules",
  "drops",
  "puffs",
  "patches",
];

export const createMedicationSchema = z.object({
  medicineName: z.string().min(2),
  dosage: z.object({
    value: z.coerce.number().min(0.1),
    unit: z.enum(DOSAGE_UNITS),
  }),
  frequency: z.string().min(1),
  intakeTimes: z.array(z.string()).min(1),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  patientId: z.string().min(1),
  indication: z.string().optional(),
  notes: z.string().optional(),
});

export const updateMedicationSchema = z.object({
  medicineName: z.string().min(2).optional(),
  dosage: z
    .object({
      value: z.coerce.number().min(0.1),
      unit: z.enum(DOSAGE_UNITS),
    })
    .optional(),
  frequency: z.string().min(1).optional(),
  intakeTimes: z.array(z.string()).min(1).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  indication: z.string().optional(),
  notes: z.string().optional(),
});

export const markDoseSchema = z.object({
  time: z.string(),
  status: z.enum(["taken", "skipped"]),
});
