import { z } from "zod";
import { msg } from "../utils/i18n.js";

// Helper: accept both string (form-data) and array (JSON)
const stringOrArray = z.union([z.string(), z.array(z.string())]).optional();

// Base user fields
const fullName = z
  .string()
  .min(
    3,
    msg(
      "الاسم يجب أن يكون 3 أحرف على الأقل",
      "Name must be at least 3 characters",
    ),
  )
  .max(
    50,
    msg("الاسم يجب أن لا يتجاوز 50 حرف", "Name must be at most 50 characters"),
  );

const email = z
  .string()
  .email(msg("بريد إلكتروني غير صالح", "Invalid email address"));

const phoneNumber = z
  .string()
  .min(
    10,
    msg(
      "رقم الهاتف يجب أن يكون 10 أرقام على الأقل",
      "Phone number must be at least 10 digits",
    ),
  );

const gender = z.enum(["Male", "Female"], {
  errorMap: () => ({
    message: msg(
      "الجنس يجب أن يكون ذكر أو أنثى",
      "Gender must be Male or Female",
    ),
  }),
});

const password = z
  .string()
  .min(
    6,
    msg(
      "كلمة المرور يجب أن تكون 6 أحرف على الأقل",
      "Password must be at least 6 characters",
    ),
  );

// Patient signup — accepts both JSON (arrays) and form-data (JSON strings)
export const signupPatientSchema = z.object({
  fullName,
  email,
  phoneNumber,
  gender,
  password,
  preferredLanguage: z.enum(["en", "ar"]).optional(),

  // Health profile (all optional)
  bloodType: z
    .enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"])
    .optional(),
  height: z.coerce.number().min(30).max(300).optional(),
  weight: z.coerce.number().min(2).max(500).optional(),
  conditions: stringOrArray,
  allergies: stringOrArray,
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
  emergencyContactRelationship: z.string().optional(),
  radiologyDescriptions: stringOrArray,
  labDescriptions: stringOrArray,
});

// Doctor signup
export const signupDoctorSchema = z.object({
  fullName,
  email,
  phoneNumber,
  gender,
  password,
  preferredLanguage: z.enum(["en", "ar"]).optional(),
  specialization: z
    .string()
    .min(1, msg("التخصص مطلوب", "Specialization is required")),
  yearsExperience: z.coerce.number().optional(),
  medicalLicenseNumber: z
    .string()
    .min(1, msg("رقم الترخيص مطلوب", "License number is required")),
  about: z.string().optional(),
  price: z.coerce.number().optional(),
});

// Login
export const loginSchema = z.object({
  email,
  password,
});

// Forgot password
export const forgotPasswordSchema = z.object({
  email,
});

// Reset password
export const resetPasswordSchema = z.object({
  token: z.string().min(1, msg("الكود مطلوب", "Reset code is required")),
  password,
});
