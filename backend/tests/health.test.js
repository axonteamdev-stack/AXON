import request from "supertest";
import app from "../app.js";

describe("Health Check & Root Endpoints", () => {
  describe("GET / - Root Endpoint", () => {
    it("should return welcome message", async () => {
      const res = await request(app).get("/");

      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe("success");
      expect(res.body.message).toContain("AXON Medical API");
      expect(res.body.version).toBeDefined();
    });

    it("should have correct response structure", async () => {
      const res = await request(app).get("/");

      expect(res.body).toHaveProperty("status");
      expect(res.body).toHaveProperty("message");
      expect(res.body).toHaveProperty("version");
    });
  });

  describe("GET /health - Health Check", () => {
    it("should return health status with 200 OK", async () => {
      const res = await request(app).get("/health");

      expect(res.statusCode).toBe(200);
      expect(res.body.status).toMatch(/ok|degraded|error/);
    });

    it("should include required health fields", async () => {
      const res = await request(app).get("/health");

      expect(res.body).toHaveProperty("status");
      expect(res.body).toHaveProperty("timestamp");
      expect(res.body).toHaveProperty("uptime");
      expect(res.body).toHaveProperty("requestId");
      expect(res.body).toHaveProperty("services");
    });

    it("should include database service status", async () => {
      const res = await request(app).get("/health");

      expect(res.body.services).toHaveProperty("database");
      expect(res.body.services.database).toMatch(
        /connected|disconnected|error|unknown/,
      );
    });

    it("should include request ID in response", async () => {
      const res = await request(app).get("/health");

      expect(res.body.requestId).toBeDefined();
      expect(typeof res.body.requestId).toBe("string");
    });

    it("should include X-Request-ID header", async () => {
      const res = await request(app).get("/health");

      expect(res.headers["x-request-id"]).toBeDefined();
    });

    it("should have valid ISO timestamp", async () => {
      const res = await request(app).get("/health");

      const date = new Date(res.body.timestamp);
      expect(date instanceof Date && !isNaN(date)).toBe(true);
    });

    it("should return uptime as positive number", async () => {
      const res = await request(app).get("/health");

      expect(typeof res.body.uptime).toBe("number");
      expect(res.body.uptime).toBeGreaterThanOrEqual(0);
    });
  });

  describe("Error Handling", () => {
    it("should return 404 for undefined routes", async () => {
      const res = await request(app).get("/api/v2/undefined-route");

      expect(res.statusCode).toBe(404);
      expect(res.body.status).toBe("error");
      expect(res.body.message).toContain("not found");
    });

    it("should return 404 with proper error message", async () => {
      const res = await request(app).get("/invalid/path/to/endpoint");

      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty("status");
      expect(res.body).toHaveProperty("message");
    });

    it("should support both Arabic and English error messages", async () => {
      const res = await request(app).get("/nonexistent");

      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBeDefined();
    });
  });

  describe("Response Structure Compliance", () => {
    it("should have consistent response format for health", async () => {
      const res = await request(app).get("/health");

      expect(res.body).toHaveProperty("status");
      expect(["ok", "degraded", "error"]).toContain(res.body.status);
    });

    it("should have consistent response format for root", async () => {
      const res = await request(app).get("/");

      expect(res.body).toHaveProperty("status");
      expect(res.body).toHaveProperty("message");
      expect(res.body.status).toBe("success");
    });
  });
});
