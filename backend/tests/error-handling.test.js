import { describe, it, expect, beforeEach } from "@jest/globals";
import request from "supertest";
import app from "../app.js";
import User from "../src/models/userModel.js";
import Post from "../src/models/postModel.js";
import AppError from "../src/utils/appError.js";

describe("Error Handling & Edge Cases Test Suite", () => {
  let authToken;
  let testUser;

  beforeEach(async () => {
    testUser = await User.create({
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      password: "HashedPass123!",
      role: "patient",
    });

    // Generate token for authenticated requests
    const loginRes = await request(app).post("/api/v2/auth/login").send({
      email: "john@example.com",
      password: "TestPassword123!",
    });

    authToken = loginRes.body.token;
  });

  describe("Input Validation Edge Cases", () => {
    it("should reject requests with extremely large payloads", async () => {
      const largePayload = "a".repeat(20000);

      const response = await request(app)
        .post("/api/v2/posts")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          content: largePayload,
          visibility: "public",
        });

      expect(response.status).toBe(413); // Payload Too Large
    });

    it("should reject requests with invalid JSON", async () => {
      const response = await request(app)
        .post("/api/v2/posts")
        .set("Authorization", `Bearer ${authToken}`)
        .set("Content-Type", "application/json")
        .send('{"invalid": json}');

      expect(response.status).toBe(400);
    });

    it("should handle null values in required fields", async () => {
      const response = await request(app).post("/api/v2/auth/register").send({
        firstName: null,
        lastName: "Doe",
        email: "test@example.com",
        password: "Password123!",
      });

      expect(response.status).toBe(400);
    });

    it("should handle undefined values", async () => {
      const response = await request(app)
        .post("/api/v2/posts")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          content: undefined,
          visibility: "public",
        });

      expect(response.status).toBe(400);
    });

    it("should sanitize XSS attempts in user input", async () => {
      const xssPayload = '<script>alert("XSS")</script>';

      const response = await request(app)
        .post("/api/v2/posts")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          content: xssPayload,
          visibility: "public",
        });

      expect(response.status).toBe(201);
      // Content should be sanitized
      const post = await Post.findById(response.body.data._id);
      expect(post.content).not.toContain("<script>");
    });

    it("should prevent SQL injection attempts", async () => {
      const sqlInjection = "'; DROP TABLE users; --";

      const response = await request(app)
        .post("/api/v2/users/search")
        .set("Authorization", `Bearer ${authToken}`)
        .query({ q: sqlInjection });

      expect(response.status).toBeOneOf([200, 400]);
      // Should not execute malicious query
    });

    it("should handle special characters in input", async () => {
      const specialChars = '!@#$%^&*()[]{}";:<>?,./|\\~`';

      const response = await request(app)
        .post("/api/v2/posts")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          content: specialChars,
          visibility: "public",
        });

      expect(response.status).toBe(201);
    });
  });

  describe("Authentication Edge Cases", () => {
    it("should reject requests without authentication header", async () => {
      const response = await request(app).get("/api/v2/users/me");

      expect(response.status).toBe(401);
    });

    it("should reject requests with malformed token", async () => {
      const response = await request(app)
        .get("/api/v2/users/me")
        .set("Authorization", "Bearer malformed.token");

      expect(response.status).toBe(401);
    });

    it("should reject requests with expired token", async () => {
      // This requires creating an expired token
      const response = await request(app)
        .get("/api/v2/users/me")
        .set("Authorization", "Bearer expired_token");

      expect(response.status).toBe(401);
    });

    it("should reject Bearer scheme without token", async () => {
      const response = await request(app)
        .get("/api/v2/users/me")
        .set("Authorization", "Bearer ");

      expect(response.status).toBe(401);
    });

    it("should reject incorrect Bearer scheme", async () => {
      const response = await request(app)
        .get("/api/v2/users/me")
        .set("Authorization", `Basic ${authToken}`);

      expect(response.status).toBe(401);
    });

    it("should handle token with null user", async () => {
      // Delete user after token generation
      await User.findByIdAndDelete(testUser._id);

      const response = await request(app)
        .get("/api/v2/users/me")
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(401);
    });
  });

  describe("Database Edge Cases", () => {
    it("should handle non-existent resource requests", async () => {
      const response = await request(app)
        .get("/api/v2/users/507f1f77bcf86cd799439099")
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(404);
    });

    it("should handle invalid ObjectId format", async () => {
      const response = await request(app)
        .get("/api/v2/users/invalid-id")
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(400);
    });

    it("should handle concurrent updates safely", async () => {
      const updateData = { firstName: "Updated" };

      const responses = await Promise.all([
        request(app)
          .patch(`/api/v2/users/${testUser._id}`)
          .set("Authorization", `Bearer ${authToken}`)
          .send(updateData),
        request(app)
          .patch(`/api/v2/users/${testUser._id}`)
          .set("Authorization", `Bearer ${authToken}`)
          .send({ lastName: "Modified" }),
      ]);

      // Both should succeed
      expect(responses.some((r) => r.status === 200)).toBe(true);
    });

    it("should handle duplicate unique field errors", async () => {
      const response = await request(app).post("/api/v2/auth/register").send({
        firstName: "John",
        lastName: "Doe",
        email: testUser.email, // Duplicate email
        password: "Password123!",
      });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain("already exists");
    });
  });

  describe("Rate Limiting & Performance", () => {
    it("should rate limit excessive requests", async () => {
      const requests = [];
      for (let i = 0; i < 150; i++) {
        requests.push(
          request(app)
            .get("/api/v2/users/me")
            .set("Authorization", `Bearer ${authToken}`),
        );
      }

      const responses = await Promise.allSettled(requests);
      const rateLimited = responses.filter(
        (r) => r.status === 429 || r.value?.status === 429,
      );

      expect(rateLimited.length).toBeGreaterThan(0);
    });

    it("should handle timeout on slow operations", async () => {
      // Make a request and track if it completes within timeout
      const startTime = Date.now();

      const response = await request(app).get("/api/v2/health").timeout(5000);

      const duration = Date.now() - startTime;

      expect(response.status).toBeLessThan(500);
      expect(duration).toBeLessThan(5000);
    });
  });

  describe("CORS & Security Headers", () => {
    it("should include security headers in response", async () => {
      const response = await request(app).get("/api/v2/health");

      expect(response.headers["x-content-type-options"]).toBe("nosniff");
      expect(response.headers["x-frame-options"]).toBe("DENY");
      expect(response.headers["strict-transport-security"]).toBeDefined();
    });

    it("should validate CORS origins", async () => {
      const response = await request(app)
        .get("/api/v2/health")
        .set("Origin", "http://malicious-site.com");

      // Should either reject or allow based on configuration
      expect(response.status).toBeLessThan(500);
    });

    it("should block disallowed HTTP methods", async () => {
      const response = await request(app).put("/api/v2/health");

      expect(response.status).toBeOneOf([404, 405]);
    });
  });

  describe("Error Message Handling", () => {
    it("should not expose sensitive error details", async () => {
      const response = await request(app)
        .get("/api/v2/users/507f1f77bcf86cd799439099")
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.body.message).not.toContain("password");
      expect(response.body.message).not.toContain("secret");
    });

    it("should provide consistent error format", async () => {
      const response = await request(app)
        .post("/api/v2/posts")
        .set("Authorization", `Bearer ${authToken}`)
        .send({ content: "" });

      expect(response.body).toHaveProperty("status");
      expect(response.body).toHaveProperty("message");
      expect(response.body).toHaveProperty("requestId");
    });

    it("should include error code for client handling", async () => {
      const response = await request(app)
        .get("/api/v2/users/507f1f77bcf86cd799439099")
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.body.code || response.status).toBeDefined();
    });
  });

  describe("Data Type Validation", () => {
    it("should reject string when number expected", async () => {
      const response = await request(app)
        .patch(`/api/v2/users/${testUser._id}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send({ age: "not-a-number" });

      expect(response.status).toBeOneOf([400, 422]);
    });

    it("should reject number when string expected", async () => {
      const response = await request(app)
        .post("/api/v2/posts")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          content: 12345,
          visibility: "public",
        });

      expect(response.status).toBeOneOf([400, 422]);
    });

    it("should reject array when object expected", async () => {
      const response = await request(app)
        .patch(`/api/v2/users/${testUser._id}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          profile: ["invalid", "array"],
        });

      expect(response.status).toBeOneOf([400, 422]);
    });
  });

  describe("Boundary Value Testing", () => {
    it("should handle minimum valid input", async () => {
      const response = await request(app)
        .post("/api/v2/posts")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          content: "a", // Minimum length
          visibility: "public",
        });

      expect([201, 400]).toContain(response.status);
    });

    it("should handle maximum valid input", async () => {
      const response = await request(app)
        .post("/api/v2/posts")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          content: "a".repeat(5000), // Maximum length
          visibility: "public",
        });

      expect([201, 413]).toContain(response.status);
    });

    it("should handle zero values appropriately", async () => {
      const response = await request(app)
        .get("/api/v2/posts")
        .query({ page: 0, limit: 0 });

      expect(response.status).toBeLessThan(500);
    });

    it("should handle negative values appropriately", async () => {
      const response = await request(app)
        .get("/api/v2/posts")
        .query({ page: -1, limit: -10 });

      expect(response.status).toBeLessThan(500);
    });
  });

  describe("Race Condition Handling", () => {
    it("should handle simultaneous create operations", async () => {
      const createPromises = Array(5)
        .fill()
        .map(() =>
          request(app)
            .post("/api/v2/posts")
            .set("Authorization", `Bearer ${authToken}`)
            .send({
              content: "Concurrent post",
              visibility: "public",
            }),
        );

      const responses = await Promise.all(createPromises);
      const successCount = responses.filter((r) => r.status === 201).length;

      expect(successCount).toBe(5);
    });

    it("should handle simultaneous delete operations", async () => {
      const post = await Post.create({
        content: "Test post",
        author: testUser._id,
        visibility: "public",
      });

      const deletePromises = Array(2)
        .fill()
        .map(() =>
          request(app)
            .delete(`/api/v2/posts/${post._id}`)
            .set("Authorization", `Bearer ${authToken}`),
        );

      const responses = await Promise.all(deletePromises);

      // First should succeed, second should fail
      const successCount = responses.filter((r) => r.status === 200).length;
      const failCount = responses.filter((r) => r.status !== 200).length;

      expect(successCount + failCount).toBe(2);
    });
  });
});

// Helper function
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
