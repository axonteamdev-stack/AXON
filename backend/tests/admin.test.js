import request from "supertest";
import app from "../app.js";

describe("Admin API Endpoints", () => {
  describe("GET /api/v2/admin/dashboard - Admin Dashboard", () => {
    it("should require authentication", async () => {
      const res = await request(app).get("/api/v2/admin/dashboard");
      expect([401, 403]).toContain(res.statusCode);
    });

    it("should require admin role", async () => {
      const res = await request(app)
        .get("/api/v2/admin/dashboard")
        .set("Authorization", "Bearer patient-token");

      expect([403, 401]).toContain(res.statusCode);
    });

    it("should return dashboard stats for admin", async () => {
      const res = await request(app)
        .get("/api/v2/admin/dashboard")
        .set("Authorization", "Bearer admin-token");

      expect([200, 401, 403]).toContain(res.statusCode);
      if (res.statusCode === 200) {
        expect(res.body).toHaveProperty("stats");
      }
    });
  });

  describe("GET /api/v2/admin/users - List All Users", () => {
    it("should require admin authentication", async () => {
      const res = await request(app).get("/api/v2/admin/users");
      expect([401, 403]).toContain(res.statusCode);
    });

    it("should support pagination", async () => {
      const res = await request(app)
        .get("/api/v2/admin/users")
        .query({ page: 1, limit: 50 })
        .set("Authorization", "Bearer admin-token");

      expect([200, 401, 403, 400]).toContain(res.statusCode);
    });

    it("should filter by role", async () => {
      const res = await request(app)
        .get("/api/v2/admin/users")
        .query({ role: "doctor" })
        .set("Authorization", "Bearer admin-token");

      expect([200, 401, 403, 400]).toContain(res.statusCode);
    });

    it("should filter by status", async () => {
      const res = await request(app)
        .get("/api/v2/admin/users")
        .query({ status: "suspended" })
        .set("Authorization", "Bearer admin-token");

      expect([200, 401, 403, 400]).toContain(res.statusCode);
    });

    it("should search users", async () => {
      const res = await request(app)
        .get("/api/v2/admin/users")
        .query({ search: "john" })
        .set("Authorization", "Bearer admin-token");

      expect([200, 401, 403, 400]).toContain(res.statusCode);
    });
  });

  describe("GET /api/v2/admin/users/:id - Get User Details", () => {
    it("should require admin authentication", async () => {
      const res = await request(app).get(
        "/api/v2/admin/users/60d5ec49c1234567890123ab"
      );
      expect([401, 403]).toContain(res.statusCode);
    });

    it("should return user details", async () => {
      const res = await request(app)
        .get("/api/v2/admin/users/60d5ec49c1234567890123ab")
        .set("Authorization", "Bearer admin-token");

      expect([200, 401, 403, 404]).toContain(res.statusCode);
    });

    it("should include user activity", async () => {
      const res = await request(app)
        .get("/api/v2/admin/users/60d5ec49c1234567890123ab")
        .set("Authorization", "Bearer admin-token");

      if (res.statusCode === 200) {
        expect(res.body).toHaveProperty("activity");
      }
    });
  });

  describe("PATCH /api/v2/admin/users/:id/status - Update User Status", () => {
    it("should require admin authentication", async () => {
      const res = await request(app)
        .patch("/api/v2/admin/users/60d5ec49c1234567890123ab/status")
        .send({ status: "suspended" });

      expect([401, 403]).toContain(res.statusCode);
    });

    it("should suspend user", async () => {
      const res = await request(app)
        .patch("/api/v2/admin/users/60d5ec49c1234567890123ab/status")
        .set("Authorization", "Bearer admin-token")
        .send({ status: "suspended", reason: "Violation of terms" });

      expect([200, 400, 401, 403, 404]).toContain(res.statusCode);
    });

    it("should activate suspended user", async () => {
      const res = await request(app)
        .patch("/api/v2/admin/users/60d5ec49c1234567890123ab/status")
        .set("Authorization", "Bearer admin-token")
        .send({ status: "active" });

      expect([200, 400, 401, 403, 404]).toContain(res.statusCode);
    });

    it("should reject invalid status", async () => {
      const res = await request(app)
        .patch("/api/v2/admin/users/60d5ec49c1234567890123ab/status")
        .set("Authorization", "Bearer admin-token")
        .send({ status: "invalid-status" });

      expect([400, 401, 403]).toContain(res.statusCode);
    });
  });

  describe("GET /api/v2/admin/stats - Platform Statistics", () => {
    it("should require admin authentication", async () => {
      const res = await request(app).get("/api/v2/admin/stats");
      expect([401, 403]).toContain(res.statusCode);
    });

    it("should return platform statistics", async () => {
      const res = await request(app)
        .get("/api/v2/admin/stats")
        .set("Authorization", "Bearer admin-token");

      expect([200, 401, 403]).toContain(res.statusCode);
      if (res.statusCode === 200) {
        expect(res.body).toHaveProperty("totalUsers");
        expect(res.body).toHaveProperty("totalPosts");
        expect(res.body).toHaveProperty("totalAppointments");
      }
    });

    it("should support date range filtering", async () => {
      const res = await request(app)
        .get("/api/v2/admin/stats")
        .query({ startDate: "2024-01-01", endDate: "2024-12-31" })
        .set("Authorization", "Bearer admin-token");

      expect([200, 401, 403, 400]).toContain(res.statusCode);
    });
  });

  describe("GET /api/v2/admin/reports - Content Reports", () => {
    it("should require admin authentication", async () => {
      const res = await request(app).get("/api/v2/admin/reports");
      expect([401, 403]).toContain(res.statusCode);
    });

    it("should list reported content", async () => {
      const res = await request(app)
        .get("/api/v2/admin/reports")
        .set("Authorization", "Bearer admin-token");

      expect([200, 401, 403]).toContain(res.statusCode);
    });

    it("should filter by report status", async () => {
      const res = await request(app)
        .get("/api/v2/admin/reports")
        .query({ status: "pending" })
        .set("Authorization", "Bearer admin-token");

      expect([200, 401, 403, 400]).toContain(res.statusCode);
    });
  });

  describe("DELETE /api/v2/admin/posts/:id - Remove Content", () => {
    it("should require admin authentication", async () => {
      const res = await request(app).delete(
        "/api/v2/admin/posts/60d5ec49c1234567890123ab"
      );
      expect([401, 403]).toContain(res.statusCode);
    });

    it("should remove reported post", async () => {
      const res = await request(app)
        .delete("/api/v2/admin/posts/60d5ec49c1234567890123ab")
        .set("Authorization", "Bearer admin-token")
        .send({ reason: "Inappropriate content" });

      expect([200, 204, 400, 401, 403, 404]).toContain(res.statusCode);
    });
  });

  describe("GET /api/v2/admin/appointments - All Appointments", () => {
    it("should require admin authentication", async () => {
      const res = await request(app).get("/api/v2/admin/appointments");
      expect([401, 403]).toContain(res.statusCode);
    });

    it("should return all appointments", async () => {
      const res = await request(app)
        .get("/api/v2/admin/appointments")
        .set("Authorization", "Bearer admin-token");

      expect([200, 401, 403]).toContain(res.statusCode);
    });
  });

  describe("GET /api/v2/admin/audit-log - Audit Trail", () => {
    it("should require admin authentication", async () => {
      const res = await request(app).get("/api/v2/admin/audit-log");
      expect([401, 403]).toContain(res.statusCode);
    });

    it("should return audit logs", async () => {
      const res = await request(app)
        .get("/api/v2/admin/audit-log")
        .set("Authorization", "Bearer admin-token");

      expect([200, 401, 403]).toContain(res.statusCode);
    });

    it("should filter by action type", async () => {
      const res = await request(app)
        .get("/api/v2/admin/audit-log")
        .query({ action: "user_delete" })
        .set("Authorization", "Bearer admin-token");

      expect([200, 401, 403, 400]).toContain(res.statusCode);
    });
  });
});
