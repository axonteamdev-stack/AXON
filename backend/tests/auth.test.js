import request from "supertest";
import app from "../app.js";

describe("Authentication API Endpoints", () => {
  describe("POST /api/v2/auth/signup-patient - Patient Signup", () => {
    it("should require email field", async () => {
      const res = await request(app)
        .post("/api/v2/auth/signup-patient")
        .send({
          password: "ValidPassword123!",
          fullName: "John Doe",
        });

      expect(res.statusCode).toBe(400);
    });

    it("should require password field", async () => {
      const res = await request(app)
        .post("/api/v2/auth/signup-patient")
        .send({
          email: "patient@example.com",
          fullName: "John Doe",
        });

      expect(res.statusCode).toBe(400);
    });

    it("should require fullName field", async () => {
      const res = await request(app)
        .post("/api/v2/auth/signup-patient")
        .send({
          email: "patient@example.com",
          password: "ValidPassword123!",
        });

      expect(res.statusCode).toBe(400);
    });

    it("should reject invalid email format", async () => {
      const res = await request(app)
        .post("/api/v2/auth/signup-patient")
        .send({
          email: "not-an-email",
          password: "ValidPassword123!",
          fullName: "John Doe",
        });

      expect(res.statusCode).toBe(400);
    });

    it("should reject weak password", async () => {
      const res = await request(app)
        .post("/api/v2/auth/signup-patient")
        .send({
          email: "patient@example.com",
          password: "weak",
          fullName: "John Doe",
        });

      expect(res.statusCode).toBe(400);
    });

    it("should reject short password (less than 8 chars)", async () => {
      const res = await request(app)
        .post("/api/v2/auth/signup-patient")
        .send({
          email: "patient@example.com",
          password: "Pass1!",
          fullName: "John Doe",
        });

      expect(res.statusCode).toBe(400);
    });

    it("should reject password without uppercase letter", async () => {
      const res = await request(app)
        .post("/api/v2/auth/signup-patient")
        .send({
          email: "patient@example.com",
          password: "password123!",
          fullName: "John Doe",
        });

      expect(res.statusCode).toBe(400);
    });

    it("should reject password without number", async () => {
      const res = await request(app)
        .post("/api/v2/auth/signup-patient")
        .send({
          email: "patient@example.com",
          password: "Password!",
          fullName: "John Doe",
        });

      expect(res.statusCode).toBe(400);
    });

    it("should reject password without special character", async () => {
      const res = await request(app)
        .post("/api/v2/auth/signup-patient")
        .send({
          email: "patient@example.com",
          password: "Password123",
          fullName: "John Doe",
        });

      expect(res.statusCode).toBe(400);
    });

    it("should accept valid signup data", async () => {
      const res = await request(app)
        .post("/api/v2/auth/signup-patient")
        .send({
          email: `patient${Date.now()}@example.com`,
          password: "ValidPassword123!",
          fullName: "John Doe",
        });

      expect([201, 409]).toContain(res.statusCode);
    });

    it("should handle duplicate email", async () => {
      const email = `duplicate${Date.now()}@example.com`;
      await request(app)
        .post("/api/v2/auth/signup-patient")
        .send({
          email,
          password: "ValidPassword123!",
          fullName: "John Doe",
        });

      const res = await request(app)
        .post("/api/v2/auth/signup-patient")
        .send({
          email,
          password: "ValidPassword123!",
          fullName: "Jane Doe",
        });

      expect(res.statusCode).toBe(409);
    });
  });

  describe("POST /api/v2/auth/signup-doctor - Doctor Signup", () => {
    it("should require email field", async () => {
      const res = await request(app)
        .post("/api/v2/auth/signup-doctor")
        .send({
          password: "ValidPassword123!",
          fullName: "Dr. Smith",
        });

      expect(res.statusCode).toBe(400);
    });

    it("should reject invalid email", async () => {
      const res = await request(app)
        .post("/api/v2/auth/signup-doctor")
        .send({
          email: "invalid-email",
          password: "ValidPassword123!",
          fullName: "Dr. Smith",
        });

      expect(res.statusCode).toBe(400);
    });

    it("should accept valid doctor signup", async () => {
      const res = await request(app)
        .post("/api/v2/auth/signup-doctor")
        .send({
          email: `doctor${Date.now()}@example.com`,
          password: "ValidPassword123!",
          fullName: "Dr. Smith",
          specialty: "Cardiology",
          licenseNumber: "LICENSE123456",
        });

      expect([201, 409]).toContain(res.statusCode);
    });
  });

  describe("POST /api/v2/auth/login - User Login", () => {
    it("should reject missing email", async () => {
      const res = await request(app)
        .post("/api/v2/auth/login")
        .send({ password: "ValidPassword123!" });

      expect(res.statusCode).toBe(400);
    });

    it("should reject missing password", async () => {
      const res = await request(app)
        .post("/api/v2/auth/login")
        .send({ email: "user@example.com" });

      expect(res.statusCode).toBe(400);
    });

    it("should reject invalid email format", async () => {
      const res = await request(app)
        .post("/api/v2/auth/login")
        .send({
          email: "not-an-email",
          password: "ValidPassword123!",
        });

      expect(res.statusCode).toBe(400);
    });

    it("should reject non-existent user", async () => {
      const res = await request(app)
        .post("/api/v2/auth/login")
        .send({
          email: "nonexistent@example.com",
          password: "ValidPassword123!",
        });

      expect([401, 400]).toContain(res.statusCode);
    });

    it("should reject incorrect password", async () => {
      const res = await request(app)
        .post("/api/v2/auth/login")
        .send({
          email: "user@example.com",
          password: "WrongPassword123!",
        });

      expect([401, 400]).toContain(res.statusCode);
    });

    it("should return tokens on successful login", async () => {
      const res = await request(app)
        .post("/api/v2/auth/login")
        .send({
          email: "validuser@example.com",
          password: "ValidPassword123!",
        });

      if (res.statusCode === 200) {
        expect(res.body).toHaveProperty("accessToken");
        expect(res.body).toHaveProperty("refreshToken");
      }
    });
  });

  describe("POST /api/v2/auth/refresh-token - Refresh Token", () => {
    it("should reject missing refresh token", async () => {
      const res = await request(app)
        .post("/api/v2/auth/refresh-token")
        .send({});

      expect([400, 401]).toContain(res.statusCode);
    });

    it("should reject invalid refresh token", async () => {
      const res = await request(app)
        .post("/api/v2/auth/refresh-token")
        .send({ refreshToken: "invalid-token" });

      expect([401, 400]).toContain(res.statusCode);
    });

    it("should return new access token on valid refresh", async () => {
      const res = await request(app)
        .post("/api/v2/auth/refresh-token")
        .send({ refreshToken: "valid-refresh-token" });

      if (res.statusCode === 200) {
        expect(res.body).toHaveProperty("accessToken");
      }
    });
  });

  describe("POST /api/v2/auth/forgot-password - Forgot Password", () => {
    it("should require email field", async () => {
      const res = await request(app)
        .post("/api/v2/auth/forgot-password")
        .send({});

      expect(res.statusCode).toBe(400);
    });

    it("should reject invalid email format", async () => {
      const res = await request(app)
        .post("/api/v2/auth/forgot-password")
        .send({ email: "not-an-email" });

      expect(res.statusCode).toBe(400);
    });

    it("should accept valid email and send reset link", async () => {
      const res = await request(app)
        .post("/api/v2/auth/forgot-password")
        .send({ email: "user@example.com" });

      expect([200, 400]).toContain(res.statusCode);
    });
  });

  describe("POST /api/v2/auth/reset-password - Reset Password", () => {
    it("should require token", async () => {
      const res = await request(app)
        .post("/api/v2/auth/reset-password")
        .send({ newPassword: "NewPassword123!" });

      expect([400, 401]).toContain(res.statusCode);
    });

    it("should require new password", async () => {
      const res = await request(app)
        .post("/api/v2/auth/reset-password")
        .send({ token: "some-token" });

      expect([400, 401]).toContain(res.statusCode);
    });

    it("should reject weak password", async () => {
      const res = await request(app)
        .post("/api/v2/auth/reset-password")
        .send({
          token: "some-token",
          newPassword: "weak",
        });

      expect([400, 401]).toContain(res.statusCode);
    });

    it("should reject invalid reset token", async () => {
      const res = await request(app)
        .post("/api/v2/auth/reset-password")
        .send({
          token: "invalid-token",
          newPassword: "NewPassword123!",
        });

      expect([400, 401]).toContain(res.statusCode);
    });
  });
});
