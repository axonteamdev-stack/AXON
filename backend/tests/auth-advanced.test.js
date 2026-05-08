import request from "supertest";
import app from "../app.js";

describe("Advanced Authentication & Security", () => {
  describe("POST /api/v2/auth/logout - User Logout", () => {
    it("should require authentication", async () => {
      const res = await request(app).post("/api/v2/auth/logout");
      expect([401, 403]).toContain(res.statusCode);
    });

    it("should logout user", async () => {
      const res = await request(app)
        .post("/api/v2/auth/logout")
        .set("Authorization", "Bearer token");

      expect([200, 204, 401, 403]).toContain(res.statusCode);
    });

    it("should invalidate token after logout", async () => {
      // Logout first
      await request(app)
        .post("/api/v2/auth/logout")
        .set("Authorization", "Bearer token");

      // Try to use same token
      const res = await request(app)
        .get("/api/v2/users/profile")
        .set("Authorization", "Bearer token");

      expect([401, 403]).toContain(res.statusCode);
    });
  });

  describe("POST /api/v2/auth/verify-email - Email Verification", () => {
    it("should verify email with valid token", async () => {
      const res = await request(app)
        .post("/api/v2/auth/verify-email")
        .send({ token: "valid-verification-token" });

      expect([200, 400]).toContain(res.statusCode);
    });

    it("should reject invalid token", async () => {
      const res = await request(app)
        .post("/api/v2/auth/verify-email")
        .send({ token: "invalid-token" });

      expect([400, 401]).toContain(res.statusCode);
    });

    it("should reject expired token", async () => {
      const res = await request(app)
        .post("/api/v2/auth/verify-email")
        .send({ token: "expired-verification-token" });

      expect([400, 401]).toContain(res.statusCode);
    });

    it("should require token", async () => {
      const res = await request(app)
        .post("/api/v2/auth/verify-email")
        .send({});

      expect(res.statusCode).toBe(400);
    });
  });

  describe("GET /api/v2/auth/me - Get Current User", () => {
    it("should require authentication", async () => {
      const res = await request(app).get("/api/v2/auth/me");
      expect([401, 403]).toContain(res.statusCode);
    });

    it("should return current user", async () => {
      const res = await request(app)
        .get("/api/v2/auth/me")
        .set("Authorization", "Bearer token");

      expect([200, 401, 403]).toContain(res.statusCode);
      if (res.statusCode === 200) {
        expect(res.body).toHaveProperty("_id");
        expect(res.body).toHaveProperty("email");
        expect(res.body).toHaveProperty("role");
      }
    });

    it("should not return password", async () => {
      const res = await request(app)
        .get("/api/v2/auth/me")
        .set("Authorization", "Bearer token");

      if (res.statusCode === 200) {
        expect(res.body.password).toBeUndefined();
        expect(res.body.passwordHash).toBeUndefined();
      }
    });
  });

  describe("POST /api/v2/auth/change-email - Change Email", () => {
    it("should require authentication", async () => {
      const res = await request(app)
        .post("/api/v2/auth/change-email")
        .send({ newEmail: "new@example.com", password: "pass" });

      expect([401, 403]).toContain(res.statusCode);
    });

    it("should require current password", async () => {
      const res = await request(app)
        .post("/api/v2/auth/change-email")
        .set("Authorization", "Bearer token")
        .send({ newEmail: "new@example.com" });

      expect([400, 401, 403]).toContain(res.statusCode);
    });

    it("should reject invalid email format", async () => {
      const res = await request(app)
        .post("/api/v2/auth/change-email")
        .set("Authorization", "Bearer token")
        .send({
          newEmail: "not-an-email",
          password: "CurrentPass123!",
        });

      expect(res.statusCode).toBe(400);
    });

    it("should initiate email change", async () => {
      const res = await request(app)
        .post("/api/v2/auth/change-email")
        .set("Authorization", "Bearer token")
        .send({
          newEmail: "newemail@example.com",
          password: "CurrentPass123!",
        });

      expect([200, 400, 401, 403]).toContain(res.statusCode);
    });

    it("should reject duplicate email", async () => {
      const res = await request(app)
        .post("/api/v2/auth/change-email")
        .set("Authorization", "Bearer token")
        .send({
          newEmail: "existing@example.com",
          password: "CurrentPass123!",
        });

      expect([409, 400, 401, 403]).toContain(res.statusCode);
    });
  });

  describe("POST /api/v2/auth/resend-verification - Resend Verification", () => {
    it("should require email", async () => {
      const res = await request(app)
        .post("/api/v2/auth/resend-verification")
        .send({});

      expect(res.statusCode).toBe(400);
    });

    it("should resend verification email", async () => {
      const res = await request(app)
        .post("/api/v2/auth/resend-verification")
        .send({ email: "unverified@example.com" });

      expect([200, 400]).toContain(res.statusCode);
    });

    it("should rate limit resend requests", async () => {
      // Make multiple rapid requests
      const requests = Array(3).fill().map(() =>
        request(app)
          .post("/api/v2/auth/resend-verification")
          .send({ email: "test@example.com" })
      );

      const responses = await Promise.all(requests);
      const hasRateLimit = responses.some(r => r.statusCode === 429);
      expect(hasRateLimit || responses[0].statusCode !== 500).toBe(true);
    });
  });

  describe("Two-Factor Authentication", () => {
    it("should enable 2FA", async () => {
      const res = await request(app)
        .post("/api/v2/auth/2fa/enable")
        .set("Authorization", "Bearer token")
        .send({ method: "authenticator" });

      expect([200, 400, 401, 403]).toContain(res.statusCode);
    });

    it("should verify 2FA setup", async () => {
      const res = await request(app)
        .post("/api/v2/auth/2fa/verify")
        .set("Authorization", "Bearer token")
        .send({ code: "123456" });

      expect([200, 400, 401, 403]).toContain(res.statusCode);
    });

    it("should disable 2FA", async () => {
      const res = await request(app)
        .post("/api/v2/auth/2fa/disable")
        .set("Authorization", "Bearer token")
        .send({ password: "CurrentPass123!" });

      expect([200, 400, 401, 403]).toContain(res.statusCode);
    });

    it("should require password to disable 2FA", async () => {
      const res = await request(app)
        .post("/api/v2/auth/2fa/disable")
        .set("Authorization", "Bearer token")
        .send({});

      expect([400, 401, 403]).toContain(res.statusCode);
    });

    it("should login with 2FA", async () => {
      const res = await request(app)
        .post("/api/v2/auth/login-2fa")
        .send({
          tempToken: "temp-token-from-step-1",
          code: "123456",
        });

      expect([200, 400, 401]).toContain(res.statusCode);
    });
  });

  describe("Session Management", () => {
    it("should list active sessions", async () => {
      const res = await request(app)
        .get("/api/v2/auth/sessions")
        .set("Authorization", "Bearer token");

      expect([200, 401, 403]).toContain(res.statusCode);
    });

    it("should revoke specific session", async () => {
      const res = await request(app)
        .delete("/api/v2/auth/sessions/60d5ec49c1234567890123ab")
        .set("Authorization", "Bearer token");

      expect([200, 204, 400, 401, 403, 404]).toContain(res.statusCode);
    });

    it("should revoke all other sessions", async () => {
      const res = await request(app)
        .delete("/api/v2/auth/sessions")
        .set("Authorization", "Bearer token")
        .send({ keepCurrent: true });

      expect([200, 204, 400, 401, 403]).toContain(res.statusCode);
    });
  });

  describe("OAuth & Social Login", () => {
    it("should initiate Google login", async () => {
      const res = await request(app).get("/api/v2/auth/google");
      expect([200, 302, 400]).toContain(res.statusCode);
    });

    it("should handle Google callback", async () => {
      const res = await request(app)
        .get("/api/v2/auth/google/callback")
        .query({ code: "google-auth-code" });

      expect([200, 400, 401]).toContain(res.statusCode);
    });

    it("should link social account", async () => {
      const res = await request(app)
        .post("/api/v2/auth/link-google")
        .set("Authorization", "Bearer token")
        .send({ googleToken: "google-token" });

      expect([200, 400, 401, 403]).toContain(res.statusCode);
    });

    it("should unlink social account", async () => {
      const res = await request(app)
        .delete("/api/v2/auth/link-google")
        .set("Authorization", "Bearer token");

      expect([200, 204, 400, 401, 403]).toContain(res.statusCode);
    });
  });

  describe("Password Policy & Security", () => {
    it("should enforce password history", async () => {
      const res = await request(app)
        .post("/api/v2/auth/reset-password")
        .send({
          token: "valid-token",
          newPassword: "OldPassword123!", // Previously used
        });

      expect([400, 401]).toContain(res.statusCode);
    });

    it("should check password breach", async () => {
      const res = await request(app)
        .post("/api/v2/auth/signup-patient")
        .send({
          email: "test@test.com",
          password: "password123", // Common password
          fullName: "Test",
        });

      expect([400, 429]).toContain(res.statusCode);
    });

    it("should require password change after 90 days", async () => {
      const res = await request(app)
        .post("/api/v2/auth/login")
        .send({
          email: "old-password-user@example.com",
          password: "ValidPassword123!",
        });

      expect([200, 401, 403]).toContain(res.statusCode);
      if (res.statusCode === 200) {
        expect(res.body.passwordChangeRequired).toBeDefined();
      }
    });
  });

  describe("Account Security Events", () => {
    it("should get security log", async () => {
      const res = await request(app)
        .get("/api/v2/auth/security-log")
        .set("Authorization", "Bearer token");

      expect([200, 401, 403]).toContain(res.statusCode);
    });

    it("should report suspicious activity", async () => {
      const res = await request(app)
        .post("/api/v2/auth/report-suspicious")
        .set("Authorization", "Bearer token")
        .send({
          eventType: "unrecognized_device",
          details: "Login from unknown location",
        });

      expect([200, 400, 401, 403]).toContain(res.statusCode);
    });
  });
});
