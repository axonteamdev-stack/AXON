/**
 * AuthService - Authentication business logic
 * Handles JWT, password reset, email validation
 */

import crypto from "crypto";
import jwt from "jsonwebtoken";
import AppError from "../Utils/AppError.js";
import sendEmail from "../Utils/Email.js";
import { PASSWORD_RESET, JWT_CONFIG } from "../Constants/index.js";
import validator from "email-validator";
import { msg } from "../Utils/ResponseHelper.js";

export class AuthService {
  /**
   * Email validation with header injection prevention
   */
  static validateEmail(email) {
    if (!email) {
      throw new AppError(
        msg("البريد الإلكتروني مطلوب", "Email is required"),
        400,
      );
    }

    // Check format
    if (!validator.validate(email)) {
      throw new AppError(
        msg("صيغة البريد الإلكتروني غير صحيحة", "Invalid email format"),
        400,
      );
    }

    // Prevent header injection
    if (/[\r\n]/.test(email)) {
      throw new AppError(
        msg(
          "البريد الإلكتروني يحتوي على أحرف غير صالحة",
          "Email contains invalid characters",
        ),
        400,
      );
    }

    return email.toLowerCase().trim();
  }

  /**
   * Generate cryptographically secure random bytes; hash once with SHA-256 for storage.
   */
  static generatePasswordResetToken() {
    const rawToken = crypto
      .randomBytes(PASSWORD_RESET.TOKEN_LENGTH)
      .toString("hex");

    const hashedToken = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    return {
      rawToken,
      hashedToken,
      expiresAt: Date.now() + PASSWORD_RESET.EXPIRY_MINUTES * 60 * 1000,
    };
  }

  /**
   * Hash token for comparison during reset
   */
  static hashPasswordResetToken(token) {
    return crypto.createHash("sha256").update(token).digest("hex");
  }

  /**
   * Send password reset email
   */
  static async sendPasswordResetEmail(email, resetToken) {
    try {
      await sendEmail({
        email: this.validateEmail(email),
        subject: "رمز إعادة تعيين كلمة المرور / Password Reset Code",
        message: `
كود التحقق الخاص بك هو: ${resetToken}
صالح لمدة ${PASSWORD_RESET.EXPIRY_MINUTES} دقائق فقط

Your verification code is: ${resetToken}
Valid for ${PASSWORD_RESET.EXPIRY_MINUTES} minutes only
        `,
      });
    } catch (error) {
      throw new AppError(
        msg("فشل في إرسال البريد الإلكتروني", "Failed to send email"),
        500,
      );
    }
  }

  /**
   * Validate JWT execution
   */
  static verifyJWT(token, secret) {
    try {
      return jwt.verify(token, secret);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        throw new AppError(
          msg("انتهت صلاحية التوكن", "Token has expired"),
          401,
        );
      }
      throw new AppError(
        msg("التوكن غير صالح", "Invalid token"),
        401,
      );
    }
  }

  /**
   * Validate environment configuration
   */
  static validateEnvironmentVariables() {
    const required = [
      "MONGO_URI",
      "JWT_SECRET",
      "REFRESH_SECRET",
      "NODE_ENV",
      "PORT",
      "EMAIL_HOST",
      "EMAIL_USER",
      "EMAIL_PASS",
    ];

    const missing = required.filter((key) => !process.env[key]);

    if (missing.length > 0) {
      throw new Error(`Missing environment variables: ${missing.join(", ")}`);
    }

    // Validate secret strength
    if (process.env.JWT_SECRET.length < JWT_CONFIG.MIN_SECRET_LENGTH) {
      throw new Error(
        `JWT_SECRET must be at least ${JWT_CONFIG.MIN_SECRET_LENGTH} characters`,
      );
    }

    if (process.env.REFRESH_SECRET.length < JWT_CONFIG.MIN_SECRET_LENGTH) {
      throw new Error(
        `REFRESH_SECRET must be at least ${JWT_CONFIG.MIN_SECRET_LENGTH} characters`,
      );
    }
  }

  /**
   * Check for password strength
   */
  static validatePasswordStrength(password) {
    if (!password) {
      throw new AppError(
        msg("كلمة المرور مطلوبة", "Password is required"),
        400,
      );
    }

    if (password.length < 8) {
      throw new AppError(
        msg("كلمة المرور يجب أن تكون 8 أحرف على الأقل", "Password must be at least 8 characters"),
        400,
      );
    }
  }
}

export default AuthService;
