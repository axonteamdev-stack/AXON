import Joi from "joi";

// --- Schemas ---

// 1. Patient Registration Schema
const patientSchema = Joi.object({
  fullName: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  phoneNumber: Joi.string().required(),
  gender: Joi.string().valid("Male", "Female").required(),
  bloodType: Joi.string().optional().allow("", null),
  height: Joi.number().min(30).max(300).allow(null),
  weight: Joi.number().min(2).max(500).allow(null),
  conditions: Joi.any().optional(),
  allergies: Joi.any().optional(),
  radiologyDescription: Joi.string().max(1000).allow("").optional(),
  personalPhoto: Joi.any().optional(),
  radiologyImage: Joi.any().optional(),
});

// 2. Doctor Registration Schema
const doctorSchema = Joi.object({
  fullName: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  phoneNumber: Joi.string().required(),
  gender: Joi.string().valid("Male", "Female").required(),
  about: Joi.string().min(5).max(2000).required(),
  price: Joi.number().min(0).required(),
  specialization: Joi.string().min(3).required(),
  yearsExperience: Joi.number().integer().min(0).required(),
  medicalLicenseNumber: Joi.string().required(),
  licenseImage: Joi.any().optional(),
  personalPhoto: Joi.any().optional(),
});

// 3. Login Schema
const loginSchema = Joi.object({
  email: Joi.string().email().required().label("Email"),
  password: Joi.string().required().label("Password"),
  role: Joi.string().valid("patient", "doctor", "admin").optional(),
});

// --- The Factory Function ---
const validate = (schema) => {
  return (req, res, next) => {
    // التحقق من البيانات مع تفعيل التنظيف (StripUnknown)
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      allowUnknown: true, // للسماح بوجود ملفات (files) في الطلب دون اعتراض
      stripUnknown: true, // حذف أي حقل غير معرف في الـ Schema (للحماية)
    });

    if (error) {
      return res.status(400).json({
        status: "error",
        message: "Validation failed",
        errors: error.details.map((detail) => detail.message),
      });
    }

    // استبدال body الملوث بـ value النظيف الذي وافق عليه Joi
    req.body = value;
    next();
  };
};

// --- Exporting ---
const validateMiddleware = {
  patientRegister: validate(patientSchema),
  doctorRegister: validate(doctorSchema),
};

export default validateMiddleware;
