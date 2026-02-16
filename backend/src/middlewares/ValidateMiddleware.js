import Joi from "joi";

// --- Schemas ---

// 1. Patient Registration Schema
const patientSchema = Joi.object({
  fullName: Joi.string().min(3).max(50).required().label("Full Name"),
  email: Joi.string().email().required().label("Email"),
  password: Joi.string().min(6).required().label("Password"),
  phoneNumber: Joi.string().required().label("Phone Number"),
  gender: Joi.string().valid("Male", "Female").required(),
  
  // حقول الملف الطبي (مهمة لكي لا يتم حذفها)
  bloodType: Joi.string().valid("A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-").allow("", null),
  height: Joi.number().min(30).max(300).allow(null),
  weight: Joi.number().min(2).max(500).allow(null),
  
  // الحقول التي تُعالج بـ safeParse في الكنترولر
  conditions: Joi.any().label("Conditions"), 
  allergies: Joi.any().label("Allergies"),
  
  // الحقل الذي كان يسبب المشكلة
  radiologyDescription: Joi.string().max(1000).allow("").label("Radiology Description"),
  
  // السماح بمسارات الصور التي قد يضيفها Multer للـ Body
  personalPhoto: Joi.any(),
  radiologyImage: Joi.any(),
});

// 2. Doctor Registration Schema
const doctorSchema = Joi.object({
  fullName: Joi.string().min(3).max(50).required().label("Full Name"),
  email: Joi.string().email().required().label("Email"),
  password: Joi.string().min(6).required().label("Password"),
  phoneNumber: Joi.string().required().label("Phone Number"),
  gender: Joi.string().valid("Male", "Female").required(),
  about: Joi.string().min(5).max(2000).required().label("About"),
  price: Joi.number().min(0).required().label("Consultation Price"),
  specialization: Joi.string().min(3).required().label("Specialization"),
  yearsExperience: Joi.number().integer().min(0).required().label("Years Experience"),
  medicalLicenseNumber: Joi.string().required().label("Medical License Number"),
  
  // السماح بمسارات الصور
  licenseImage: Joi.any(),
  personalPhoto: Joi.any(),
});

<<<<<<< HEAD
=======
// 3. Login Schema
const loginSchema = Joi.object({
  email: Joi.string().email().required().label("Email"),
  password: Joi.string().required().label("Password"),
  role: Joi.string().valid("patient", "doctor", "admin").optional(),
});

>>>>>>> c14f17e55e7cea92b340af07faa2542f98c003fc
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
