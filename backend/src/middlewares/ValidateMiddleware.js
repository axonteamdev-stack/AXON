import Joi from "joi";

// Joi schema for Patient registration
const patientSchema = Joi.object({
  fullName: Joi.string().min(3).max(50).required().label("Full Name"),
  email: Joi.string().email().required().label("Email"),
  password: Joi.string().min(6).required().label("Password"),
  profileImage: Joi.string().optional().label("Profile Image"),
});

// Joi schema for Doctor registration
const doctorSchema = Joi.object({
  fullName: Joi.string().min(3).max(50).required().label("Full Name"),
  email: Joi.string().email().required().label("Email"),
  password: Joi.string().min(6).required().label("Password"),
  specialization: Joi.string().min(3).required().label("Specialization"),
  yearsExperience: Joi.number()
    .integer()
    .min(0)
    .max(80)
    .required()
    .label("Years of Experience"),
  medicalCertificateNumber: Joi.string()
    .alphanum()
    .min(5)
    .max(30)
    .required()
    .label("Certificate Number"),
  profileImage: Joi.string().optional().label("Profile Image"),
  // Note: certificateImage validation is handled by Multer/UploadMiddleware,
  // but we can add a simple check for the file path if needed, though usually
  // the file itself is required for this route's functionality.
});

// Joi schema for Login
const loginSchema = Joi.object({
  email: Joi.string().email().required().label("Email"),
  password: Joi.string().required().label("Password"),
  role: Joi.string().valid("patient", "doctor").required().label("Role"),
});

/**
 * Higher-order function to create a validation middleware
 * @param {Joi.ObjectSchema} schema - The Joi schema to validate against
 */
const validate = (schema) => (req, res, next) => {
  // Use req.body for standard data, but merge in req.file info for doctor
  const dataToValidate = req.body;

  const { error } = schema.validate(dataToValidate, {
    abortEarly: false, // Include all errors, not just the first one
    allowUnknown: true, // Allow unknown fields (like 'certificateImage' file metadata)
  });

  if (error) {
    const errorMessages = error.details.map((detail) => detail.message);
    return res.status(400).json({
      message: "Validation failed",
      errors: errorMessages,
    });
  }
  next();
};

const changePasswordSchema = Joi.object({
  oldPassword: Joi.string().required().label("Old Password"),
  newPassword: Joi.string().min(6).required().label("New Password"),
});

const validateMiddleware = {
  patientRegister: validate(patientSchema),
  doctorRegister: validate(doctorSchema),
  login: validate(loginSchema),
  changePassword: validate(changePasswordSchema),
};

export default validateMiddleware;
