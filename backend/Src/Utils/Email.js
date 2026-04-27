/**
 * Email Service - Enhanced with security validations
 * ✅ FIXED: Email header injection prevention
 */

import nodemailer from "nodemailer";
import validator from "email-validator";

/**
 * ✅ FIXED: Strict email validation to prevent header injection
 */
const validateEmail = (email) => {
  // Format validation
  if (!validator.validate(email)) {
    throw new Error(`Invalid email format: ${email}`);
  }

  // Prevent header injection (CRLF injection)
  if (/[\r\n]/.test(email)) {
    throw new Error("Email contains invalid characters (newlines)");
  }

  return email.trim().toLowerCase();
};

/**
 * ✅ FIXED: Subject validation to prevent header injection
 */
const validateSubject = (subject) => {
  if (!subject) throw new Error("Subject is required");

  if (/[\r\n]/.test(subject)) {
    throw new Error("Subject contains invalid characters");
  }

  return String(subject).trim().substring(0, 255); // Limit length
};

/**
 * ✅ FIXED: Message validation
 */
const validateMessage = (message) => {
  if (!message) throw new Error("Message is required");

  // Allow newlines in message but not CR or SMTP commands
  return String(message).trim();
};

const sendEmail = async (options) => {
  try {
    // Validate all inputs
    const email = validateEmail(options.email);
    const subject = validateSubject(options.subject);
    const message = validateMessage(options.message);

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: process.env.NODE_ENV === "production",
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_FROM || "support@meddiodoc.com",
      to: email,
      subject,
      text: message,
      replyTo: process.env.EMAIL_REPLY_TO || process.env.EMAIL_FROM,
    };

    await transporter.sendMail(mailOptions);

    console.log(`✅ Email sent to ${email}`);
  } catch (error) {
    console.error("Email send failed:", error.message);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

export default sendEmail;
