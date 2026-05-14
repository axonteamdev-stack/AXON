import { z } from "zod";

export const signupPatientSchema = z.object({
    fullName: z.string().min(3).max(50),
    email: z.string().email(),
    phoneNumber: z.string().min(10),
    gender: z.enum(["male", "female"]),
    password: z.string().min(6),
    preferredLanguage: z.enum(["en", "ar"]).optional(),
});

export const signupDoctorSchema = z.object({
    fullName: z.string().min(3).max(50),
    email: z.string().email(),
    phoneNumber: z.string().min(10),
    gender: z.enum(["male", "female"]),
    password: z.string().min(6),
    specialization: z.string().min(2),
    yearsExperience: z.coerce.number().min(0).optional(),
    medicalLicenseNumber: z.string().min(5),
    about: z.string().optional(),
    price: z.coerce.number().min(0).optional(),
});

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
});

export const forgotPasswordSchema = z.object({
    email: z.string().email(),
});

export const resetPasswordSchema = z.object({
    token: z.string().length(6),
    password: z.string().min(6),
});
