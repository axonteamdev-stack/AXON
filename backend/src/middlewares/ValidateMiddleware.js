import Joi from "joi";

const emailRegexX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// --- حقول مشتركة ---
const flexibleDescription = Joi.alternatives().try(
  Joi.array().items(Joi.string().allow("")),
  Joi.string().allow("")
).optional();

const medicationSchema = Joi.object({
  medicineName: Joi.string().trim().min(2).required().messages({
    'string.empty': 'اسم الدواء لا يمكن أن يكون فارغاً',
    'any.required': 'اسم الدواء مطلوب'
  }),

  frequency: Joi.string()
    .valid("once daily", "twice daily", "three times daily")
    .required()
    .messages({
      'any.only': 'يجب اختيار تكرار صالح (once, twice, or three times daily)'
    }),

  intakeTime: Joi.alternatives().try(
    Joi.array().items(Joi.string().required()).min(1),
    Joi.string().required()
  ).required().messages({
    'any.required': 'مواعيد الجرعات مطلوبة'
  }),

  // التحقق من الوقت الحالي ومنع التواريخ القديمة
  startDate: Joi.date()
    .iso()
    .min(new Date().setHours(0, 0, 0, 0)) // يقارن ببداية اليوم الحالي فقط
    .required()
    .messages({
      'date.min': 'تاريخ البداية لا يمكن أن يكون قبل اليوم',
      'date.format': 'صيغة تاريخ البداية غير صحيحة',
      'any.required': 'تاريخ بداية العلاج مطلوب'
    }),

  endDate: Joi.date()
    .iso()
    .min(Joi.ref('startDate'))
    .required()
    .messages({
      'date.min': 'تاريخ النهاية يجب أن يكون مساوياً أو بعد تاريخ البداية',
      'any.required': 'تاريخ نهاية العلاج مطلوب'
    }),

  notes: Joi.string().allow('').optional()
});

// 2. Patient Registration Schema
const patientSchema = Joi.object({
  fullName: Joi.string().min(3).max(50).required().label("Full Name"),
  email: Joi.string().email().pattern(emailRegexX).required(),
  password: Joi.string().min(6).required().label("Password"),
  phoneNumber: Joi.string().required().label("Phone Number"),
  gender: Joi.string().valid("Male", "Female").required(),
  bloodType: Joi.string().valid("A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-").allow("", null),
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

// 3. Doctor Registration Schema
const doctorSchema = Joi.object({
  fullName: Joi.string().min(3).max(50).required().label("Full Name"),
  email: Joi.string().email().pattern(emailRegexX).required(),
  password: Joi.string().min(6).required().label("Password"),
  phoneNumber: Joi.string().required().label("Phone Number"),
  gender: Joi.string().valid("Male", "Female").required(),
  about: Joi.string().min(5).max(2000).required().label("About"),
  price: Joi.number().min(0).required().label("Consultation Price"),
  specialization: Joi.string().min(3).required().label("Specialization"),
  yearsExperience: Joi.number().integer().min(0).required().label("Years Experience"),
  medicalLicenseNumber: Joi.string().required().label("Medical License Number"),
  licenseImage: Joi.any(),
  personalPhoto: Joi.any(),
});

// 4. Login Schema
const loginSchema = Joi.object({
  email: Joi.string().email().pattern(emailRegexX).required(),
  password: Joi.string().required().label("Password"),
  role: Joi.string().valid("patient", "doctor", "admin").optional(),
});

// 5. Update Me Schema
const updateMeSchema = Joi.object({
  fullName: Joi.string().min(3).max(50).optional().label("Full Name"),
  phoneNumber: Joi.string().optional().label("Phone Number"),
  gender: Joi.string().valid("Male", "Female").optional(),
  about: Joi.string().min(5).max(2000).optional(),
  price: Joi.number().min(0).optional(),
  specialization: Joi.string().optional(),
  yearsExperience: Joi.number().optional(),
  bloodType: Joi.string().valid("A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-").optional(),
  height: Joi.number().optional(),
  weight: Joi.number().optional(),
  radiologyDescription: flexibleDescription,
  labDescription: flexibleDescription,
  personalPhoto: Joi.any().optional(),
  radiologyImage: Joi.any().optional(),
  labImage: Joi.any().optional(),
}).min(0);

// --- The Factory Function ---
const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      allowUnknown: true, 
      stripUnknown: true, 
    });

    if (error) {
      return res.status(400).json({
        status: "error",
        message: "فشل التحقق من البيانات",
        errors: error.details.map((detail) => detail.message),
      });
    }

    req.body = value;
    next();
  };
};

// --- التصدير النهائي ---
const validateMiddleware = {
  patientRegister: validate(patientSchema),
  doctorRegister: validate(doctorSchema),
  login: validate(loginSchema),
  updateMe: validate(updateMeSchema),
  addMedication: validate(medicationSchema), // إضافة التحقق من الدواء هنا ✅
};

export default validateMiddleware;
