import validator from "email-validator";
import { transporter } from "../config/email.js";

const EMAIL_MAX_LENGTH = 254;
const SUBJECT_MAX_LENGTH = 255;
const RESET_EXPIRY_MINUTES = 10;

const validateEmail = (email) => {
  if (typeof email !== "string") throw new TypeError("Email must be a string");
  const sanitized = email.trim().toLowerCase();
  if (sanitized.length > EMAIL_MAX_LENGTH) throw new Error("Email exceeds maximum length");
  if (/[]/.test(sanitized)) throw new Error("Email contains invalid characters");
  if (!validator.validate(sanitized)) throw new Error(`Invalid email format: ${sanitized}`);
  return sanitized;
};

const validateSubject = (subject) => {
  if (typeof subject !== "string" || !subject.trim()) throw new Error("Subject is required");
  if (/[]/.test(subject)) throw new Error("Subject contains invalid characters");
  return subject.trim().slice(0, SUBJECT_MAX_LENGTH);
};

export const sendEmail = async ({ email, subject, message }) => {
  const sanitizedEmail = validateEmail(email);
  const sanitizedSubject = validateSubject(subject);

  const info = await transporter.sendMail({
    from: process.env.EMAIL_FROM || "support@meddiodoc.com",
    to: sanitizedEmail,
    subject: sanitizedSubject,
    text: message,
    replyTo: process.env.EMAIL_REPLY_TO || process.env.EMAIL_FROM,
  });

  return info;
};

export const sendPasswordResetEmail = async (email, resetToken) => {
  const sanitizedEmail = validateEmail(email);
  const message = `كود التحقق الخاص بك هو: ${resetToken}
صالح لمدة ${RESET_EXPIRY_MINUTES} دقائق فقط

Your verification code is: ${resetToken}
Valid for ${RESET_EXPIRY_MINUTES} minutes only`;

  await sendEmail({
    email: sanitizedEmail,
    subject: "رمز إعادة تعيين كلمة المرور / Password Reset Code",
    message,
  });
};
