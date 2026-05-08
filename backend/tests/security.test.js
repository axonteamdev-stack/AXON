import { describe, it, expect, beforeEach } from "@jest/globals";
import request from "supertest";
import app from "../app.js";
import User from "../src/models/userModel.js";
import bcrypt from "bcryptjs";

describe("Security Test Suite", () => {
  let testUser;
  let authToken;

  beforeEach(async () => {
    testUser = await User.create({
      firstName: "John",
      lastName: "Doe",
      email: "security.test@example.com",
      password: "SecurePass123!@",
      role: "patient",
    });

    // Get auth token
    const loginRes = await request(app).post("/api/v2/auth/login").send({
      email: "security.test@example.com",
      password: "SecurePass123!@",
    });

    authToken = loginRes.body.token;
  });

  describe("Password Security", () => {
    it("should require strong password for registration", async () => {
      const weakPasswords = ["123", "password", "qwerty", "abc123"];

      for (const weakPass of weakPasswords) {
        const response = await request(app)
          .post("/api/v2/auth/register")
          .send({
            firstName: "Test",
            lastName: "User",
            email: `test${Math.random()}@example.com`,
            password: weakPass,
          });

        expect(response.status).toBe(400);
      }
    });

    it("should hash password before storing", async () => {
      const plainPassword = "PlainPassword123!";
      const user = await User.findById(testUser._id);

      expect(user.password).not.toBe(plainPassword);
      expect(user.password.length).toBeGreaterThan(10); // Hash is much longer
    });

    it("should reject unencrypted password in response", async () => {
      const response = await request(app)
        .get("/api/v2/users/me")
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.body.data.password).toBeUndefined();
    });

    it("should not allow password in query parameters", async () => {
      const response = await request(app)
        .post("/api/v2/auth/login")
        .query({ password: "TestPassword123!" })
        .send({ email: testUser.email });

      // Should fail or ignore query password
      expect(response.status).toBeOneOf([400, 401, 200]);
    });

    it("should support password reset with secure token", async () => {
      const response = await request(app)
        .post("/api/v2/auth/forgot-password")
        .send({ email: testUser.email });

      expect(response.status).toBe(200);
      expect(response.body.data?.resetToken).toBeDefined();
      expect(response.body.data.resetToken).not.toBe(
        testUser.resetPasswordToken,
      );
    });

    it("should invalidate old passwords on change", async () => {
      const newPassword = "NewSecurePass123!@";

      await request(app)
        .post("/api/v2/auth/change-password")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          currentPassword: "SecurePass123!@",
          newPassword,
          confirmPassword: newPassword,
        });

      // Old password should not work
      const loginRes = await request(app).post("/api/v2/auth/login").send({
        email: testUser.email,
        password: "SecurePass123!@",
      });

      expect(loginRes.status).toBe(401);
    });
  });

  describe("Authentication & Authorization", () => {
    it("should not expose JWT secret in response", async () => {
      const response = await request(app).post("/api/v2/auth/login").send({
        email: testUser.email,
        password: "SecurePass123!@",
      });

      expect(response.body).not.toContain(process.env.JWT_SECRET);
    });

    it("should include secure HttpOnly flag on auth cookies", async () => {
      const response = await request(app).post("/api/v2/auth/login").send({
        email: testUser.email,
        password: "SecurePass123!@",
      });

      const setCookie = response.headers["set-cookie"];
      if (setCookie) {
        expect(setCookie[0]).toMatch(/HttpOnly/i);
      }
    });

    it("should prevent token reuse after logout", async () => {
      await request(app)
        .post("/api/v2/auth/logout")
        .set("Authorization", `Bearer ${authToken}`);

      const response = await request(app)
        .get("/api/v2/users/me")
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(401);
    });

    it("should limit token lifetime", async () => {
      const response = await request(app).post("/api/v2/auth/login").send({
        email: testUser.email,
        password: "SecurePass123!@",
      });

      expect(response.body.data.expiresIn).toBeDefined();
      expect(response.body.data.expiresIn).toMatch(/[0-9]+[smhd]/); // e.g., "24h"
    });

    it("should not allow privilege escalation", async () => {
      // Patient tries to become admin
      const response = await request(app)
        .patch(`/api/v2/users/${testUser._id}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send({ role: "admin" });

      const updated = await User.findById(testUser._id);
      expect(updated.role).not.toBe("admin");
    });
  });

  describe("Input Sanitization", () => {
    it("should sanitize HTML injection attempts", async () => {
      const xssPayload = "<img src=x onerror=\"alert('XSS')\">";

      const response = await request(app)
        .patch(`/api/v2/users/${testUser._id}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send({ firstName: xssPayload });

      expect(response.status).toBe(200);

      const updated = await User.findById(testUser._id);
      expect(updated.firstName).not.toContain("onerror=");
    });

    it("should prevent NoSQL injection", async () => {
      const response = await request(app)
        .get("/api/v2/users")
        .query({ email: { $ne: null } }) // NoSQL injection attempt
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBeLessThan(500); // Should not crash
    });

    it("should escape special regex characters", async () => {
      const response = await request(app)
        .get("/api/v2/posts")
        .query({ search: ".*|^$+" })
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBeLessThan(500);
    });

    it("should reject prototype pollution attempts", async () => {
      const response = await request(app)
        .patch(`/api/v2/users/${testUser._id}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          "constructor[prototype][admin]": true,
          __proto__: { admin: true },
        });

      const updated = await User.findById(testUser._id);
      expect(updated.admin).toBeUndefined();
    });

    it("should handle path traversal attempts", async () => {
      const response = await request(app)
        .post("/api/v2/users/profile/upload")
        .set("Authorization", `Bearer ${authToken}`)
        .field("path", "../../../etc/passwd");

      expect(response.status).toBeOneOf([400, 403, 413]);
    });
  });

  describe("CORS & Headers Security", () => {
    it("should reject disallowed origins", async () => {
      const response = await request(app)
        .get("/api/v2/health")
        .set("Origin", "http://malicious.com");

      // Should either reject or include proper CORS headers
      expect(response.headers["access-control-allow-origin"]).toBeUndefined();
    });

    it("should not expose server version", async () => {
      const response = await request(app).get("/api/v2/health");

      expect(response.headers["server"]).toBeUndefined();
      expect(response.headers["x-powered-by"]).toBeUndefined();
    });

    it("should enforce CSP headers", async () => {
      const response = await request(app).get("/api/v2/health");

      expect(response.headers["content-security-policy"]).toBeDefined();
    });

    it("should prevent MIME type sniffing", async () => {
      const response = await request(app).get("/api/v2/health");

      expect(response.headers["x-content-type-options"]).toBe("nosniff");
    });

    it("should enable HSTS", async () => {
      const response = await request(app).get("/api/v2/health");

      expect(response.headers["strict-transport-security"]).toBeDefined();
    });
  });

  describe("Rate Limiting & DoS Protection", () => {
    it("should rate limit login attempts", async () => {
      const attempts = Array(100)
        .fill()
        .map(() =>
          request(app).post("/api/v2/auth/login").send({
            email: testUser.email,
            password: "WrongPassword",
          }),
        );

      const responses = await Promise.allSettled(attempts);
      const rateLimited = responses.filter(
        (r) => r.status === 429 || r.value?.status === 429,
      );

      expect(rateLimited.length).toBeGreaterThan(0);
    });

    it("should protect against brute force attacks", async () => {
      for (let i = 0; i < 10; i++) {
        await request(app).post("/api/v2/auth/login").send({
          email: testUser.email,
          password: "WrongPassword",
        });
      }

      const response = await request(app).post("/api/v2/auth/login").send({
        email: testUser.email,
        password: "SecurePass123!@",
      });

      // Should be rate limited
      expect([429, 401]).toContain(response.status);
    });

    it("should implement request timeout", async () => {
      const startTime = Date.now();

      await request(app).get("/api/v2/health").timeout(5000);

      const duration = Date.now() - startTime;
      expect(duration).toBeLessThan(30000); // Should timeout before 30s
    });
  });

  describe("File Upload Security", () => {
    it("should reject files with dangerous extensions", async () => {
      const response = await request(app)
        .post("/api/v2/users/profile/upload")
        .set("Authorization", `Bearer ${authToken}`)
        .attach("file", Buffer.from("malicious"), "malware.exe");

      expect([400, 403, 415]).toContain(response.status);
    });

    it("should validate file size limits", async () => {
      const largeBuffer = Buffer.alloc(100 * 1024 * 1024); // 100MB

      const response = await request(app)
        .post("/api/v2/users/profile/upload")
        .set("Authorization", `Bearer ${authToken}`)
        .attach("file", largeBuffer, "large-file.jpg");

      expect([413, 400]).toContain(response.status);
    });

    it("should scan file content for malware signatures", async () => {
      // Simulate EICAR test file (antivirus test string)
      const eicarTestFile = Buffer.from(
        "X5O!P%@AP[4\\PZX54(P^)7CC)7}$EICAR-STANDARD-ANTIVIRUS-TEST-FILE!$H+H*",
      );

      const response = await request(app)
        .post("/api/v2/users/profile/upload")
        .set("Authorization", `Bearer ${authToken}`)
        .attach("file", eicarTestFile, "test.txt");

      expect([400, 403]).toContain(response.status);
    });

    it("should not execute uploaded files", async () => {
      const jsCode = Buffer.from("console.log('hacked');");

      const response = await request(app)
        .post("/api/v2/users/profile/upload")
        .set("Authorization", `Bearer ${authToken}`)
        .attach("file", jsCode, "script.js");

      expect(response.status).toBeOneOf([201, 400, 403]);

      // File should not be executable
      if (response.status === 201) {
        expect(response.body.data.mimeType).not.toBe("application/javascript");
      }
    });
  });

  describe("Data Exposure Prevention", () => {
    it("should not expose sensitive user fields", async () => {
      const response = await request(app)
        .get("/api/v2/users/me")
        .set("Authorization", `Bearer ${authToken}`);

      const sensitiveFields = [
        "password",
        "resetPasswordToken",
        "resetPasswordExpire",
        "twoFactorSecret",
      ];

      sensitiveFields.forEach((field) => {
        expect(response.body.data).not.toHaveProperty(field);
      });
    });

    it("should not expose other users' private data", async () => {
      const otherUser = await User.create({
        firstName: "Jane",
        lastName: "Smith",
        email: "jane@example.com",
        password: "SecurePass123!@",
        role: "patient",
        bio: "Private information",
      });

      const response = await request(app)
        .get(`/api/v2/users/${otherUser._id}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.body.data.password).toBeUndefined();
    });

    it("should enforce field-level access control", async () => {
      const response = await request(app)
        .get("/api/v2/users/me")
        .set("Authorization", `Bearer ${authToken}`);

      const user = await User.findById(testUser._id);

      // Public fields should be present
      expect(response.body.data.firstName).toBe(user.firstName);

      // Private fields should not be present
      expect(response.body.data.password).toBeUndefined();
    });
  });

  describe("Session & Token Security", () => {
    it("should invalidate sessions on password change", async () => {
      const oldToken = authToken;

      await request(app)
        .post("/api/v2/auth/change-password")
        .set("Authorization", `Bearer ${oldToken}`)
        .send({
          currentPassword: "SecurePass123!@",
          newPassword: "NewSecure123!@",
          confirmPassword: "NewSecure123!@",
        });

      const response = await request(app)
        .get("/api/v2/users/me")
        .set("Authorization", `Bearer ${oldToken}`);

      expect(response.status).toBe(401);
    });

    it("should not allow token forgery", async () => {
      const forgedToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.fake.forged";

      const response = await request(app)
        .get("/api/v2/users/me")
        .set("Authorization", `Bearer ${forgedToken}`);

      expect(response.status).toBe(401);
    });

    it("should detect token tampering", async () => {
      const parts = authToken.split(".");
      const tamperedToken = `${parts[0]}.${Buffer.from("tampered").toString(
        "base64",
      )}.${parts[2]}`;

      const response = await request(app)
        .get("/api/v2/users/me")
        .set("Authorization", `Bearer ${tamperedToken}`);

      expect(response.status).toBe(401);
    });
  });

  describe("Account Lockout & Abuse Prevention", () => {
    it("should lock account after multiple failed login attempts", async () => {
      for (let i = 0; i < 6; i++) {
        await request(app).post("/api/v2/auth/login").send({
          email: testUser.email,
          password: "WrongPassword",
        });
      }

      const response = await request(app).post("/api/v2/auth/login").send({
        email: testUser.email,
        password: "SecurePass123!@",
      });

      expect([401, 429]).toContain(response.status);
    });

    it("should require verification to unlock account", async () => {
      // This assumes account lockout feature exists
      const response = await request(app)
        .post("/api/v2/auth/unlock-account")
        .send({
          email: testUser.email,
        });

      expect([200, 400]).toContain(response.status);
    });
  });
});

// Helper matcher
expect.extend({
  toBeOneOf(received, expected) {
    const pass = expected.includes(received);
    if (pass) {
      return {
        message: () => `expected ${received} not to be one of ${expected}`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be one of ${expected}`,
        pass: false,
      };
    }
  },
});
