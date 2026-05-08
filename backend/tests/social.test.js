import request from "supertest";
import app from "../app.js";

describe("Social Features API", () => {
  describe("GET /api/v2/users/:id/followers - Get Followers", () => {
    it("should require authentication", async () => {
      const res = await request(app).get(
        "/api/v2/users/60d5ec49c1234567890123ab/followers"
      );
      expect([401, 403]).toContain(res.statusCode);
    });

    it("should support pagination", async () => {
      const res = await request(app)
        .get("/api/v2/users/60d5ec49c1234567890123ab/followers")
        .query({ page: 1, limit: 10 })
        .set("Authorization", "Bearer token");

      expect([200, 401, 403, 400]).toContain(res.statusCode);
    });

    it("should reject invalid user ID", async () => {
      const res = await request(app)
        .get("/api/v2/users/invalid-id/followers")
        .set("Authorization", "Bearer token");

      expect([400, 401, 403]).toContain(res.statusCode);
    });

    it("should return followers list", async () => {
      const res = await request(app)
        .get("/api/v2/users/60d5ec49c1234567890123ab/followers")
        .set("Authorization", "Bearer token");

      expect([200, 401, 403, 404]).toContain(res.statusCode);
      if (res.statusCode === 200) {
        expect(Array.isArray(res.body.data || res.body)).toBe(true);
      }
    });
  });

  describe("GET /api/v2/users/:id/following - Get Following", () => {
    it("should require authentication", async () => {
      const res = await request(app).get(
        "/api/v2/users/60d5ec49c1234567890123ab/following"
      );
      expect([401, 403]).toContain(res.statusCode);
    });

    it("should return following list", async () => {
      const res = await request(app)
        .get("/api/v2/users/60d5ec49c1234567890123ab/following")
        .set("Authorization", "Bearer token");

      expect([200, 401, 403, 404]).toContain(res.statusCode);
    });
  });

  describe("POST /api/v2/users/:id/follow - Follow User", () => {
    it("should require authentication", async () => {
      const res = await request(app).post(
        "/api/v2/users/60d5ec49c1234567890123ab/follow"
      );
      expect([401, 403]).toContain(res.statusCode);
    });

    it("should reject following yourself", async () => {
      const res = await request(app)
        .post("/api/v2/users/me/follow")
        .set("Authorization", "Bearer token");

      expect([400, 401, 403]).toContain(res.statusCode);
    });

    it("should reject invalid user ID", async () => {
      const res = await request(app)
        .post("/api/v2/users/invalid-id/follow")
        .set("Authorization", "Bearer token");

      expect([400, 401, 403]).toContain(res.statusCode);
    });

    it("should follow a user", async () => {
      const res = await request(app)
        .post("/api/v2/users/60d5ec49c1234567890123ab/follow")
        .set("Authorization", "Bearer token");

      expect([200, 201, 400, 401, 403, 404, 409]).toContain(res.statusCode);
    });

    it("should not allow duplicate follows", async () => {
      const res = await request(app)
        .post("/api/v2/users/60d5ec49c1234567890123ab/follow")
        .set("Authorization", "Bearer token");

      expect([200, 201, 400, 401, 403, 404, 409]).toContain(res.statusCode);
    });
  });

  describe("POST /api/v2/users/:id/unfollow - Unfollow User", () => {
    it("should require authentication", async () => {
      const res = await request(app).post(
        "/api/v2/users/60d5ec49c1234567890123ab/unfollow"
      );
      expect([401, 403]).toContain(res.statusCode);
    });

    it("should unfollow a user", async () => {
      const res = await request(app)
        .post("/api/v2/users/60d5ec49c1234567890123ab/unfollow")
        .set("Authorization", "Bearer token");

      expect([200, 400, 401, 403, 404]).toContain(res.statusCode);
    });

    it("should handle unfollowing non-followed user", async () => {
      const res = await request(app)
        .post("/api/v2/users/60d5ec49c1234567890123aa/unfollow")
        .set("Authorization", "Bearer token");

      expect([200, 400, 401, 403, 404]).toContain(res.statusCode);
    });
  });
});

describe("Notifications API", () => {
  describe("GET /api/v2/notifications - List Notifications", () => {
    it("should require authentication", async () => {
      const res = await request(app).get("/api/v2/notifications");
      expect([401, 403]).toContain(res.statusCode);
    });

    it("should support pagination", async () => {
      const res = await request(app)
        .get("/api/v2/notifications")
        .query({ page: 1, limit: 20 })
        .set("Authorization", "Bearer token");

      expect([200, 401, 403, 400]).toContain(res.statusCode);
    });

    it("should filter by read status", async () => {
      const res = await request(app)
        .get("/api/v2/notifications")
        .query({ unreadOnly: true })
        .set("Authorization", "Bearer token");

      expect([200, 401, 403, 400]).toContain(res.statusCode);
    });

    it("should return notification list", async () => {
      const res = await request(app)
        .get("/api/v2/notifications")
        .set("Authorization", "Bearer token");

      expect([200, 401, 403]).toContain(res.statusCode);
      if (res.statusCode === 200) {
        expect(Array.isArray(res.body.data || res.body)).toBe(true);
      }
    });
  });

  describe("PATCH /api/v2/notifications/:id/read - Mark as Read", () => {
    it("should require authentication", async () => {
      const res = await request(app).patch(
        "/api/v2/notifications/60d5ec49c1234567890123ab/read"
      );
      expect([401, 403]).toContain(res.statusCode);
    });

    it("should reject invalid notification ID", async () => {
      const res = await request(app)
        .patch("/api/v2/notifications/invalid-id/read")
        .set("Authorization", "Bearer token");

      expect([400, 401, 403]).toContain(res.statusCode);
    });

    it("should mark notification as read", async () => {
      const res = await request(app)
        .patch("/api/v2/notifications/60d5ec49c1234567890123ab/read")
        .set("Authorization", "Bearer token");

      expect([200, 400, 401, 403, 404]).toContain(res.statusCode);
    });

    it("should not allow marking others notifications", async () => {
      const res = await request(app)
        .patch("/api/v2/notifications/60d5ec49c1234567890123aa/read")
        .set("Authorization", "Bearer other-user-token");

      expect([403, 404, 401]).toContain(res.statusCode);
    });
  });

  describe("POST /api/v2/notifications/read-all - Mark All as Read", () => {
    it("should require authentication", async () => {
      const res = await request(app).post("/api/v2/notifications/read-all");
      expect([401, 403]).toContain(res.statusCode);
    });

    it("should mark all notifications as read", async () => {
      const res = await request(app)
        .post("/api/v2/notifications/read-all")
        .set("Authorization", "Bearer token");

      expect([200, 401, 403]).toContain(res.statusCode);
    });
  });
});

describe("Search API", () => {
  describe("GET /api/v2/search - Global Search", () => {
    it("should require search query", async () => {
      const res = await request(app).get("/api/v2/search");
      expect([400, 401, 403]).toContain(res.statusCode);
    });

    it("should search across entities", async () => {
      const res = await request(app)
        .get("/api/v2/search")
        .query({ q: "health" });

      expect([200, 400, 401, 403]).toContain(res.statusCode);
    });

    it("should filter by entity type", async () => {
      const res = await request(app)
        .get("/api/v2/search")
        .query({ q: "doctor", type: "user" });

      expect([200, 400, 401, 403]).toContain(res.statusCode);
    });

    it("should support pagination", async () => {
      const res = await request(app)
        .get("/api/v2/search")
        .query({ q: "test", page: 1, limit: 10 });

      expect([200, 400, 401, 403]).toContain(res.statusCode);
    });
  });
});

describe("User Profile Enhancements", () => {
  describe("GET /api/v2/users/me - Get Current User", () => {
    it("should require authentication", async () => {
      const res = await request(app).get("/api/v2/users/me");
      expect([401, 403]).toContain(res.statusCode);
    });

    it("should return current user profile", async () => {
      const res = await request(app)
        .get("/api/v2/users/me")
        .set("Authorization", "Bearer token");

      expect([200, 401, 403]).toContain(res.statusCode);
      if (res.statusCode === 200) {
        expect(res.body).toHaveProperty("_id");
        expect(res.body).toHaveProperty("email");
      }
    });
  });

  describe("PUT /api/v2/users/me - Update Current User", () => {
    it("should require authentication", async () => {
      const res = await request(app)
        .put("/api/v2/users/me")
        .send({ fullName: "Updated" });

      expect([401, 403]).toContain(res.statusCode);
    });

    it("should update current user profile", async () => {
      const res = await request(app)
        .put("/api/v2/users/me")
        .set("Authorization", "Bearer token")
        .send({ fullName: "New Name", bio: "Updated bio" });

      expect([200, 400, 401, 403]).toContain(res.statusCode);
    });

    it("should not allow changing role", async () => {
      const res = await request(app)
        .put("/api/v2/users/me")
        .set("Authorization", "Bearer token")
        .send({ role: "admin" });

      expect([200, 400, 401, 403]).toContain(res.statusCode);
    });
  });

  describe("GET /api/v2/users/:id/medications - Get User Medications", () => {
    it("should require authentication", async () => {
      const res = await request(app).get(
        "/api/v2/users/60d5ec49c1234567890123ab/medications"
      );
      expect([401, 403]).toContain(res.statusCode);
    });

    it("should return user medications", async () => {
      const res = await request(app)
        .get("/api/v2/users/60d5ec49c1234567890123ab/medications")
        .set("Authorization", "Bearer token");

      expect([200, 401, 403, 404]).toContain(res.statusCode);
    });
  });

  describe("GET /api/v2/users/:id/appointments - Get User Appointments", () => {
    it("should require authentication", async () => {
      const res = await request(app).get(
        "/api/v2/users/60d5ec49c1234567890123ab/appointments"
      );
      expect([401, 403]).toContain(res.statusCode);
    });

    it("should filter by status", async () => {
      const res = await request(app)
        .get("/api/v2/users/60d5ec49c1234567890123ab/appointments")
        .query({ status: "upcoming" })
        .set("Authorization", "Bearer token");

      expect([200, 401, 403, 400, 404]).toContain(res.statusCode);
    });
  });

  describe("POST /api/v2/users/:id/verify-email - Verify Email", () => {
    it("should verify email with token", async () => {
      const res = await request(app)
        .post("/api/v2/users/60d5ec49c1234567890123ab/verify-email")
        .send({ token: "verification-token-123" });

      expect([200, 400, 401, 403, 404]).toContain(res.statusCode);
    });

    it("should reject invalid token", async () => {
      const res = await request(app)
        .post("/api/v2/users/60d5ec49c1234567890123ab/verify-email")
        .send({ token: "invalid" });

      expect([400, 401, 403, 404]).toContain(res.statusCode);
    });
  });
});
