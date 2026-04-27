import Joi from "joi";
import { msg } from "../Utils/ResponseHelper.js";

// ─── Helpers ───────────────────────────────────────────────

const bilingualMsg = (ar, en) => ({ ar, en });

// Wrapper for Joi messages that returns bilingual object
const joiMsg = (ar, en) => ({
  "string.empty": msg(ar, en),
  "any.required": msg(ar, en),
  "string.min": msg(`${ar} (الحد الأدنى {#limit})`, `${en} (min {#limit})`),
  "string.max": msg(`${ar} (الحد الأقصى {#limit})`, `${en} (max {#limit})`),
  "string.email": msg("صيغة البريد الإلكتروني غير صحيحة", "Invalid email format"),
  "date.min": msg(ar, en),
  "date.format": msg("صيغة التاريخ غير صحيحة", "Invalid date format"),
  "any.only": msg(ar, en),
  "number.min": msg(ar, en),
  "number.max": msg(ar, en),
  "alternatives.types": msg(ar, en),
});

// ─── Shared Fields ─────────────────────────────────────────

const flexibleDescription = Joi.alternatives()
  .try(Joi.array().items(Joi.string().allow("")), Joi.string().allow(""))
  .optional();

// ─── Schemas ───────────────────────────────────────────────

const medicationSchema = Joi.object({
  medicineName: Joi.string().trim().min(2).required().messages(
    joiMsg("اسم الدواء لا يمكن أن يكون فارغاً", "Medicine name cannot be empty"),
  ),

  frequency: Joi.string()
    .valid("once daily", "twice daily", "three times daily")
    .required()
    .messages(
      joiMsg(
        "يجب اختيار تكرار صالح (once, twice, or three times daily)",
        "Please select a valid frequency (once, twice, or three times daily)",
      ),
    ),

  intakeTime: Joi.alternatives()
    .try(
      Joi.array().items(Joi.string().required()).min(1),
      Joi.string().required(),
    )
    .required()
    .messages(
      joiMsg("مواعيد الجرعات مطلوبة", "Intake times are required"),
    ),

  startDate: Joi.date()
    .iso()
    .min(new Date().setHours(0, 0, 0, 0))
    .required()
    .messages(
      joiMsg(
        "تاريخ البداية لا يمكن أن يكون قبل اليوم",
        "Start date cannot be before today",
      ),
    ),

  endDate: Joi.date().iso().min(Joi.ref("startDate")).required().messages(
    joiMsg(
      "تاريخ النهاية يجب أن يكون مساوياً أو بعد تاريخ البداية",
      "End date must be equal to or after start date",
    ),
  ),

  notes: Joi.string().allow("").optional(),
});

const patientSchema = Joi.object({
  fullName: Joi.string().min(3).max(50).required().label("Full Name"),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required().label("Password"),
  phoneNumber: Joi.string().required().label("Phone Number"),
  gender: Joi.string().valid("Male", "Female").required(),
  bloodType: Joi.string()
    .valid("A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-")
    .allow("", null),
  height: Joi.number().min(30).max(300).allow(null),
  weight: Joi.number().min(2).max(500).allow(null),
  conditions: Joi.any().label("Conditions"),
  allergies: Joi.any().label("Allergies"),
  radiologyDescription: flexibleDescription.label("Radiology Description"),
  labDescription: flexibleDescription.label("Lab Description"),
  personalPhoto: Joi.any(),
  radiologyImage: Joi.any(),
  labImage: Joi.any(),
});

const doctorSchema = Joi.object({
  fullName: Joi.string().min(3).max(50).required().label("Full Name"),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required().label("Password"),
  phoneNumber: Joi.string().required().label("Phone Number"),
  gender: Joi.string().valid("Male", "Female").required(),
  about: Joi.string().min(5).max(2000).required().label("About"),
  price: Joi.number().min(0).required().label("Consultation Price"),
  specialization: Joi.string().min(3).required().label("Specialization"),
  yearsExperience: Joi.number()
    .integer()
    .min(0)
    .required()
    .label("Years Experience"),
  medicalLicenseNumber: Joi.string().required().label("Medical License Number"),
  licenseImage: Joi.any(),
  personalPhoto: Joi.any(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required().label("Password"),
  role: Joi.string().valid("patient", "doctor", "admin").optional(),
});

const updateMeSchema = Joi.object({
  fullName: Joi.string().min(3).max(50).optional().label("Full Name"),
  phoneNumber: Joi.string().optional().label("Phone Number"),
  gender: Joi.string().valid("Male", "Female").optional(),
  about: Joi.string().min(5).max(2000).optional(),
  price: Joi.number().min(0).optional(),
  specialization: Joi.string().optional(),
  yearsExperience: Joi.number().optional(),
  bloodType: Joi.string()
    .valid("A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-")
    .optional(),
  height: Joi.number().optional(),
  weight: Joi.number().optional(),
  radiologyDescription: flexibleDescription,
  labDescription: flexibleDescription,
  personalPhoto: Joi.any().optional(),
  radiologyImage: Joi.any().optional(),
  labImage: Joi.any().optional(),
}).min(0);

const articleSchema = Joi.object({
  title: Joi.string().min(5).required().messages(
    joiMsg("عنوان المقال مطلوب", "Article title is required"),
  ),
  content: Joi.string().allow("").optional().messages(
    joiMsg("محتوى المقال لا يمكن أن يكون فارغاً", "Article content cannot be empty"),
  ),
  category: Joi.string().optional(),
});

const postSchema = Joi.object({
  content: Joi.string().min(1).max(5000).required().messages(
    joiMsg(
      "محتوى المنشور مطلوب",
      "Post content is required",
    ),
  ),
  visibility: Joi.string().valid("public", "followers", "private").optional().messages(
    joiMsg(
      "نوع الرؤية يجب أن يكون public أو followers أو private",
      "Visibility must be public, followers, or private",
    ),
  ),
  tags: Joi.array().items(Joi.string()).max(10).optional().messages(
    joiMsg(
      "لا يمكن إضافة أكثر من 10 تصنيفات",
      "Cannot add more than 10 tags",
    ),
  ),
});

const commentSchema = Joi.object({
  content: Joi.string().min(1).max(2000).required().messages(
    joiMsg(
      "محتوى التعليق مطلوب",
      "Comment content is required",
    ),
  ),
  parentCommentId: Joi.string().optional(),
});

// ─── Validation Factory ────────────────────────────────────

const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      allowUnknown: true,
      stripUnknown: true,
    });

    if (error) {
      return res.status(400).json({
        status: "fail",
        message: msg(
          "فشل التحقق من البيانات. يرجى التحقق من المدخلات.",
          "Data validation failed. Please check your input.",
        ),
        errors: error.details.map((detail) => ({
          field: detail.path.join("."),
          message: detail.message, // Joi returns English, this is Joi limitation
        })),
      });
    }

    req.body = value;
    next();
  };
};

// ─── Exports ─────────────────────────────────────────────

const validateMiddleware = {
  patientRegister: validate(patientSchema),
  doctorRegister: validate(doctorSchema),
  login: validate(loginSchema),
  updateMe: validate(updateMeSchema),
  addMedication: validate(medicationSchema),
  createArticle: validate(articleSchema),
  createPost: validate(postSchema),
  createComment: validate(commentSchema),
};

export default validateMiddleware;
