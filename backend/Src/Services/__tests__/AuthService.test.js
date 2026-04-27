/**
 * AuthService Unit Tests
 * Tests for email validation, token generation, and environment validation
 */

import { describe, test, expect, beforeEach, vi } from "vitest";
import AuthService from "../Services/AuthService.js";
import { PASSWORD_RESET, JWT_CONFIG } from "../Constants/index.js";

describe("AuthService", () => {
  describe("validateEmail", () => {
    test("should accept valid email", () => {
      const email = "user@example.com";
      const result = AuthService.validateEmail(email);

      expect(result).toBe(email.toLowerCase());
    });

    test("should trim and lowercase email", () => {
      const result = AuthService.validateEmail("  USER@EXAMPLE.COM  ");

      expect(result).toBe("user@example.com");
    });

    test("should throw error for invalid email format", () => {
      expect(() => {
        AuthService.validateEmail("invalid-email");
      }).toThrow("Invalid email format");
    });

    test("should prevent header injection (CRLF)", () => {
      const injected = "user@example.com\r\nBcc: attacker@evil.com";

      expect(() => {
        AuthService.validateEmail(injected);
      }).toThrow("invalid characters");
    });

    test("should prevent newline injection", () => {
      const injected = "user@example.com\nBcc: attacker@evil.com";

      expect(() => {
        AuthService.validateEmail(injected);
      }).toThrow("invalid characters");
    });

    test("should throw error for null email", () => {
      expect(() => {
        AuthService.validateEmail(null);
      }).toThrow();
    });
  });

  describe("generatePasswordResetToken", () => {
    test("should generate token with expiry", () => {
      const result = AuthService.generatePasswordResetToken();

      expect(result).toHaveProperty("rawToken");
      expect(result).toHaveProperty("hashedToken");
      expect(result).toHaveProperty("expiresAt");
      expect(typeof result.rawToken).toBe("string");
      expect(typeof result.hashedToken).toBe("string");
    });

    test("should generate random tokens", () => {
      const token1 = AuthService.generatePasswordResetToken();
      const token2 = AuthService.generatePasswordResetToken();

      expect(token1.rawToken).not.toBe(token2.rawToken);
      expect(token1.hashedToken).not.toBe(token2.hashedToken);
    });

    test("should not store raw token as hashed token", () => {
      const result = AuthService.generatePasswordResetToken();

      expect(result.rawToken).not.toBe(result.hashedToken);
    });

    test("should set correct expiry time", () => {
      const before = Date.now();
      const result = AuthService.generatePasswordResetToken();
      const after = Date.now();

      const expectedExpiry = PASSWORD_RESET.EXPIRY_MINUTES * 60 * 1000;
      expect(result.expiresAt).toBeGreaterThanOrEqual(before + expectedExpiry);
      expect(result.expiresAt).toBeLessThanOrEqual(
        after + expectedExpiry + 100,
      );
    });

    test("should generate token of correct length", () => {
      const result = AuthService.generatePasswordResetToken();

      expect(result.rawToken.length).toBe(PASSWORD_RESET.TOKEN_LENGTH * 2); // hex string
    });
  });

  describe("hashPasswordResetToken", () => {
    test("should hash token consistently", () => {
      const token = "test-token-123";
      const hash1 = AuthService.hashPasswordResetToken(token);
      const hash2 = AuthService.hashPasswordResetToken(token);

      expect(hash1).toBe(hash2);
    });

    test("should produce different hash for different tokens", () => {
      const hash1 = AuthService.hashPasswordResetToken("token-1");
      const hash2 = AuthService.hashPasswordResetToken("token-2");

      expect(hash1).not.toBe(hash2);
    });

    test("should not return plaintext token", () => {
      const token = "plaintext-token";
      const hash = AuthService.hashPasswordResetToken(token);

      expect(hash).not.toBe(token);
      expect(hash.length).toBeGreaterThan(token.length);
    });
  });

  describe("sendPasswordResetEmail", () => {
    test("should validate email before sending", async () => {
      const invalidEmail = "invalid-email\r\nBcc: attacker@evil.com";

      await expect(
        AuthService.sendPasswordResetEmail(invalidEmail, "token123"),
      ).rejects.toThrow();
    });

    test("should include expiry minutes in message", async () => {
      // Mock sendEmail to capture message
      vi.mock("../Utils/Email.js", () => ({
        default: vi.fn((options) => {
          expect(options.message).toContain(PASSWORD_RESET.EXPIRY_MINUTES);
        }),
      }));
    });
  });

  describe("validateEnvironmentVariables", () => {
    const originalEnv = { ...process.env };

    beforeEach(() => {
      process.env = { ...originalEnv };
    });

    test("should not throw for complete environment", () => {
      process.env.MONGO_URI = "mongodb://localhost";
      process.env.JWT_SECRET = "a".repeat(JWT_CONFIG.MIN_SECRET_LENGTH);
      process.env.REFRESH_SECRET = "a".repeat(JWT_CONFIG.MIN_SECRET_LENGTH);
      process.env.NODE_ENV = "test";
      process.env.PORT = "3000";
      process.env.EMAIL_HOST = "smtp.example.com";
      process.env.EMAIL_USER = "test@example.com";
      process.env.EMAIL_PASS = "password";

      expect(() => {
        AuthService.validateEnvironmentVariables();
      }).not.toThrow();
    });

    test("should throw for missing JWT_SECRET", () => {
      delete process.env.JWT_SECRET;
      process.env.MONGO_URI = "mongodb://localhost";
      process.env.REFRESH_SECRET = "a".repeat(JWT_CONFIG.MIN_SECRET_LENGTH);
      process.env.NODE_ENV = "test";
      process.env.PORT = "3000";
      process.env.EMAIL_HOST = "smtp.example.com";
      process.env.EMAIL_USER = "test@example.com";
      process.env.EMAIL_PASS = "password";

      expect(() => {
        AuthService.validateEnvironmentVariables();
      }).toThrow("Missing environment variables");
    });

    test("should throw for weak JWT_SECRET", () => {
      process.env.MONGO_URI = "mongodb://localhost";
      process.env.JWT_SECRET = "short";
      process.env.REFRESH_SECRET = "a".repeat(JWT_CONFIG.MIN_SECRET_LENGTH);
      process.env.NODE_ENV = "test";
      process.env.PORT = "3000";
      process.env.EMAIL_HOST = "smtp.example.com";
      process.env.EMAIL_USER = "test@example.com";
      process.env.EMAIL_PASS = "password";

      expect(() => {
        AuthService.validateEnvironmentVariables();
      }).toThrow("must be at least");
    });
  });

  describe("validatePasswordStrength", () => {
    test("should accept password with 8+ characters", () => {
      expect(() => {
        AuthService.validatePasswordStrength("password123");
      }).not.toThrow();
    });

    test("should throw error for password shorter than 8 characters", () => {
      expect(() => {
        AuthService.validatePasswordStrength("pass123");
      }).toThrow("8 characters");
    });

    test("should throw error for null password", () => {
      expect(() => {
        AuthService.validatePasswordStrength(null);
      }).toThrow();
    });

    test("should throw error for empty password", () => {
      expect(() => {
        AuthService.validatePasswordStrength("");
      }).toThrow();
    });
  });
});
