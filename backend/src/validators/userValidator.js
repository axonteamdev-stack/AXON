import { z } from "zod";
import { msg } from "../utils/i18n.js";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
const STRONG_PASSWORD = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;

export const addUserSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().regex(EMAIL_REGEX, msg("بريد إلكتروني غير صالح", "Invalid email")),
  password: z.string().regex(STRONG_PASSWORD, msg("كلمة مرور ضعيفة", "Weak password")),
  phoneNumber: z.string().regex(PHONE_REGEX, msg("رقم هاتف غير صالح", "Invalid phone")),
  gender: z.enum(["male", "female"]),
  role: z.enum(["patient", "doctor", "admin"]),
});

export const patientRegisterSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().regex(EMAIL_REGEX),
  password: z.string().regex(STRONG_PASSWORD),
  phoneNumber: z.string().regex(PHONE_REGEX),
  gender: z.enum(["male", "female"]),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  bloodType: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]).optional(),
  emergencyContact: z.object({
    name: z.string().min(1),
    phone: z.string().regex(PHONE_REGEX),
    relation: z.string().min(1),
  }).optional(),
  address: z.string().min(5).optional(),
  allergies: z.array(z.string()).optional(),
});

export const doctorRegisterSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().regex(EMAIL_REGEX),
  password: z.string().regex(STRONG_PASSWORD),
  phoneNumber: z.string().regex(PHONE_REGEX),
  gender: z.enum(["male", "female"]),
  specialization: z.string().min(2),
  licenseNumber: z.string().min(3),
  yearsOfExperience: z.number().int().min(0).max(60),
  education: z.array(z.object({
    degree: z.string().min(1),
    institution: z.string().min(1),
    year: z.number().int().min(1950).max(new Date().getFullYear()),
  })).optional(),
  availableDays: z.array(z.enum(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"])).optional(),
  consultationFee: z.number().min(0).optional(),
  bio: z.string().max(1000).optional(),
});

export const loginSchema = z.object({
  email: z.string().regex(EMAIL_REGEX),
  password: z.string().min(6),
});

export const updateMeSchema = z.object({
  fullName: z.string().min(2).optional(),
  phoneNumber: z.string().regex(PHONE_REGEX).optional(),
  gender: z.enum(["male", "female"]).optional(),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  address: z.string().min(5).optional(),
  avatar: z.string().url().optional(),
  bloodType: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]).optional(),
  allergies: z.array(z.string()).optional(),
  emergencyContact: z.object({
    name: z.string().min(1),
    phone: z.string().regex(PHONE_REGEX),
    relation: z.string().min(1),
  }).optional(),
  specialization: z.string().min(2).optional(),
  yearsOfExperience: z.number().int().min(0).max(60).optional(),
  consultationFee: z.number().min(0).optional(),
  bio: z.string().max(1000).optional(),
  availableDays: z.array(z.enum(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"])).optional(),
}).partial();
