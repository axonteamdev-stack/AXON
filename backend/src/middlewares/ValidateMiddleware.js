import Joi from "joi";

// --- Schemas ---
const patientSchema = Joi.object({
  fullName: Joi.string().min(3).max(50).required().label("Full Name"),
  email: Joi.string().email().required().label("Email"),
  password: Joi.string().min(6).required().label("Password"),
  phoneNumber: Joi.string().required(),
  gender: Joi.string().valid("Male", "Female").required(),
});

const doctorSchema = Joi.object({
  fullName: Joi.string().min(3).max(50).required().label("Full Name"),
  email: Joi.string().email().required().label("Email"),
  password: Joi.string().min(6).required().label("Password"),
  phoneNumber: Joi.string().required().label("Phone Number"),
  gender: Joi.string().valid("Male", "Female").required(),
  specialization: Joi.string().min(3).required().label("Specialization"),
  yearsExperience: Joi.number()
    .integer()
    .min(0)
    .required()
    .label("Years Experience"),
  medicalLicenseNumber: Joi.string().required().label("Medical License Number"),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  role: Joi.string().valid("patient", "doctor").required(),
});

// --- The Factory Function ---
const validate = (schema) => {
  return (req, res, next) => {
    // Note: Multer must run BEFORE this so req.body is populated
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      allowUnknown: true,
      stripUnknown: true,
    });

    if (error) {
      return res.status(400).json({
        status: "error",
        message: "Validation failed",
        errors: error.details.map((detail) => detail.message),
      });
    }

    req.body = value; // Cleaned data passed to controller
    next();
  };
};

// --- Exporting the Object ---
const validateMiddleware = {
  patientRegister: validate(patientSchema),
  doctorRegister: validate(doctorSchema),
  login: validate(loginSchema),
};

export default validateMiddleware;
