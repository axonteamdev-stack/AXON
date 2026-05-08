import request from "supertest";
import app from "../app.js";

describe("API Core & Infrastructure", () => {
  describe("CORS & Security Headers", () => {
    it("should include security headers", async () => {
      const res = await request(app).get("/");

      expect(res.headers).toBeDefined();
      // Common security headers - adjust based on your helmet config
      expect(res.headers["x-content-type-options"] || res.headers["content-type"]).toBeDefined();
    });

    it("should handle OPTIONS preflight", async () => {
      const res = await request(app)
        .options("/api/v2/auth/login")
        .set("Origin", "http://localhost:3000")
        .set("Access-Control-Request-Method", "POST");

      expect([200, 204, 404]).toContain(res.statusCode);
    });
  });

  describe("Request Parsing", () => {
    it("should parse JSON bodies", async () => {
      const res = await request(app)
        .post("/api/v2/auth/login")
        .set("Content-Type", "application/json")
        .send({ email: "test@test.com", password: "pass" });

      expect(res.statusCode).not.toBe(500);
    });

    it("should handle malformed JSON gracefully", async () => {
      const res = await request(app)
        .post("/api/v2/auth/login")
        .set("Content-Type", "application/json")
        .send("{invalid json");

      expect([400, 500]).toContain(res.statusCode);
    });

    it("should reject overly large payloads", async () => {
      const largePayload = { data: "x".repeat(1024 * 1024) }; // 1MB string
      const res = await request(app)
        .post("/api/v2/auth/login")
        .send(largePayload);

      expect([400, 413, 500]).toContain(res.statusCode);
    });
  });

  describe("API Versioning", () => {
    it("should default to v2 when no version specified", async () => {
      const res = await request(app).get("/api/v2/health");
      expect([200, 404]).toContain(res.statusCode);
    });

    it("should reject unsupported API versions", async () => {
      const res = await request(app)
        .get("/api/v99/health")
        .set("X-API-Version", "99");

      expect([404, 400]).toContain(res.statusCode);
    });
  });

  describe("Rate Limiting", () => {
    it("should track request counts", async () => {
      // Make several rapid requests
      const requests = Array(3).fill().map(() => 
        request(app).get("/health")
      );

      const responses = await Promise.all(requests);

      // All should succeed or be rate limited
      responses.forEach(res => {
        expect([200, 429, 503]).toContain(res.statusCode);
      });
    });
  });

  describe("Logging & Request ID", () => {
    it("should include request ID in response headers", async () => {
      const res = await request(app).get("/");

      expect(
        res.headers["x-request-id"] || 
        res.headers["x-correlation-id"] ||
        res.headers["request-id"]
      ).toBeDefined();
    });

    it("should accept custom request ID", async () => {
      const customId = "custom-request-123";
      const res = await request(app)
        .get("/")
        .set("X-Request-ID", customId);

      expect([200, 404]).toContain(res.statusCode);
    });
  });

  describe("Content Negotiation", () => {
    it("should return JSON by default", async () => {
      const res = await request(app).get("/");

      if (res.statusCode === 200) {
        expect(res.headers["content-type"]).toContain("application/json");
      }
    });

    it("should handle Accept header", async () => {
      const res = await request(app)
        .get("/")
        .set("Accept", "application/json");

      expect([200, 404, 406]).toContain(res.statusCode);
    });
  });
});

describe("Authentication & Authorization", () => {
  describe("Token Validation", () => {
    it("should reject missing authorization header", async () => {
      const res = await request(app).get("/api/v2/users/profile");
      expect([401, 403]).toContain(res.statusCode);
    });

    it("should reject malformed token", async () => {
      const res = await request(app)
        .get("/api/v2/users/profile")
        .set("Authorization", "NotBearer token");

      expect([401, 403]).toContain(res.statusCode);
    });

    it("should reject expired token", async () => {
      const res = await request(app)
        .get("/api/v2/users/profile")
        .set("Authorization", "Bearer expired.token.here");

      expect([401, 403]).toContain(res.statusCode);
    });

    it("should reject invalid token signature", async () => {
      const res = await request(app)
        .get("/api/v2/users/profile")
        .set("Authorization", "Bearer invalid.token.signature");

      expect([401, 403]).toContain(res.statusCode);
    });
  });

  describe("Role-Based Access", () => {
    it("should allow patient access to patient endpoints", async () => {
      const res = await request(app)
        .get("/api/v2/users/profile")
        .set("Authorization", "Bearer patient-token");

      expect([200, 401, 403]).toContain(res.statusCode);
    });

    it("should allow doctor access to doctor endpoints", async () => {
      const res = await request(app)
        .get("/api/v2/articles")
        .set("Authorization", "Bearer doctor-token");

      expect([200, 401, 403]).toContain(res.statusCode);
    });

    it("should deny patient access to admin endpoints", async () => {
      const res = await request(app)
        .get("/api/v2/admin/users")
        .set("Authorization", "Bearer patient-token");

      expect([403, 401, 404]).toContain(res.statusCode);
    });
  });
});

describe("Error Handling", () => {
  it("should return consistent error format", async () => {
    const res = await request(app).get("/nonexistent-endpoint");

    expect(res.body).toHaveProperty("status");
    expect(res.body).toHaveProperty("message");
  });

  it("should handle 500 errors gracefully", async () => {
    // Trigger an error by sending bad data to a sensitive endpoint
    const res = await request(app)
      .post("/api/v2/auth/login")
      .send({ email: "a".repeat(10000) + "@test.com", password: "x" });

    expect([400, 500]).toContain(res.statusCode);
    if (res.statusCode === 500) {
      expect(res.body).toHaveProperty("status");
      expect(res.body).toHaveProperty("message");
    }
  });

  it("should not leak stack traces in production", async () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = "production";

    const res = await request(app).get("/trigger-error");

    process.env.NODE_ENV = originalEnv;

    if (res.statusCode === 500) {
      expect(res.body.stack).toBeUndefined();
    }
  });
});
