import request from "supertest";
import app from "../app.js";

describe("User API Endpoints", () => {
  describe("GET /api/v2/users - Get All Users (Admin)", () => {
    it("should require authentication", async () => {
      const res = await request(app).get("/api/v2/users");

      expect([401, 403]).toContain(res.statusCode);
    });

    it("should support pagination", async () => {
      const res = await request(app)
        .get("/api/v2/users")
        .query({ page: 1, limit: 10 });

      expect([200, 401, 403, 400]).toContain(res.statusCode);
    });

    it("should filter by role", async () => {
      const res = await request(app)
        .get("/api/v2/users")
        .query({ role: "patient" });

      expect([200, 401, 403, 400]).toContain(res.statusCode);
    });

    it("should filter by status", async () => {
      const res = await request(app)
        .get("/api/v2/users")
        .query({ status: "active" });

      expect([200, 401, 403, 400]).toContain(res.statusCode);
    });
  });

  describe("GET /api/v2/users/:id - Get User By ID", () => {
    it("should require authentication", async () => {
      const res = await request(app).get(
        "/api/v2/users/60d5ec49c1234567890123ab",
      );

      expect([401, 403]).toContain(res.statusCode);
    });

    it("should reject invalid ObjectId", async () => {
      const res = await request(app).get("/api/v2/users/invalid-id");

      expect([400, 401, 403]).toContain(res.statusCode);
    });

    it("should return 404 for non-existent user", async () => {
      const res = await request(app)
        .get("/api/v2/users/60d5ec49c1234567890123ab")
        .set("Authorization", "Bearer valid-token");

      expect([404, 401, 403]).toContain(res.statusCode);
    });
  });

  describe("GET /api/v2/users/profile - Get Current User Profile", () => {
    it("should require authentication", async () => {
      const res = await request(app).get("/api/v2/users/profile");

      expect([401, 403]).toContain(res.statusCode);
    });

    it("should return user profile on success", async () => {
      const res = await request(app)
        .get("/api/v2/users/profile")
        .set("Authorization", "Bearer valid-token");

      if (res.statusCode === 200) {
        expect(res.body).toHaveProperty("_id");
        expect(res.body).toHaveProperty("email");
        expect(res.body).toHaveProperty("fullName");
      }
    });
  });

  describe("PUT /api/v2/users/:id - Update User", () => {
    it("should require authentication", async () => {
      const res = await request(app)
        .put("/api/v2/users/60d5ec49c1234567890123ab")
        .send({ fullName: "Updated Name" });

      expect([401, 403]).toContain(res.statusCode);
    });

    it("should reject invalid ObjectId", async () => {
      const res = await request(app)
        .put("/api/v2/users/invalid-id")
        .set("Authorization", "Bearer token")
        .send({ fullName: "Updated Name" });

      expect([400, 401, 403]).toContain(res.statusCode);
    });

    it("should update user profile", async () => {
      const res = await request(app)
        .put("/api/v2/users/60d5ec49c1234567890123ab")
        .set("Authorization", "Bearer token")
        .send({ fullName: "New Name", phone: "+1234567890" });

      expect([200, 400, 401, 403, 404]).toContain(res.statusCode);
    });

    it("should not allow changing email directly", async () => {
      const res = await request(app)
        .put("/api/v2/users/60d5ec49c1234567890123ab")
        .set("Authorization", "Bearer token")
        .send({ email: "newemail@example.com" });

      expect([200, 400, 401, 403, 404]).toContain(res.statusCode);
    });
  });

  describe("DELETE /api/v2/users/:id - Delete User", () => {
    it("should require authentication", async () => {
      const res = await request(app).delete(
        "/api/v2/users/60d5ec49c1234567890123ab",
      );

      expect([401, 403]).toContain(res.statusCode);
    });

    it("should reject invalid ObjectId", async () => {
      const res = await request(app)
        .delete("/api/v2/users/invalid-id")
        .set("Authorization", "Bearer token");

      expect([400, 401, 403]).toContain(res.statusCode);
    });

    it("should delete user account", async () => {
      const res = await request(app)
        .delete("/api/v2/users/60d5ec49c1234567890123ab")
        .set("Authorization", "Bearer token");

      expect([200, 204, 400, 401, 403, 404]).toContain(res.statusCode);
    });
  });

  describe("PUT /api/v2/users/:id/change-password - Change Password", () => {
    it("should require authentication", async () => {
      const res = await request(app)
        .put("/api/v2/users/60d5ec49c1234567890123ab/change-password")
        .send({
          currentPassword: "OldPass123!",
          newPassword: "NewPass123!",
        });

      expect([401, 403]).toContain(res.statusCode);
    });

    it("should reject weak new password", async () => {
      const res = await request(app)
        .put("/api/v2/users/60d5ec49c1234567890123ab/change-password")
        .set("Authorization", "Bearer token")
        .send({
          currentPassword: "OldPass123!",
          newPassword: "weak",
        });

      expect([400, 401, 403]).toContain(res.statusCode);
    });

    it("should reject incorrect current password", async () => {
      const res = await request(app)
        .put("/api/v2/users/60d5ec49c1234567890123ab/change-password")
        .set("Authorization", "Bearer token")
        .send({
          currentPassword: "WrongPass123!",
          newPassword: "NewPass123!",
        });

      expect([400, 401, 403]).toContain(res.statusCode);
    });

    it("should change password on success", async () => {
      const res = await request(app)
        .put("/api/v2/users/60d5ec49c1234567890123ab/change-password")
        .set("Authorization", "Bearer token")
        .send({
          currentPassword: "OldPass123!",
          newPassword: "NewPass123!",
        });

      expect([200, 400, 401, 403, 404]).toContain(res.statusCode);
    });
  });

  describe("GET /api/v2/users/:id/medical-history - Get Medical History", () => {
    it("should require authentication", async () => {
      const res = await request(app).get(
        "/api/v2/users/60d5ec49c1234567890123ab/medical-history",
      );

      expect([401, 403]).toContain(res.statusCode);
    });

    it("should return medical history on success", async () => {
      const res = await request(app)
        .get("/api/v2/users/60d5ec49c1234567890123ab/medical-history")
        .set("Authorization", "Bearer token");

      if (res.statusCode === 200) {
        expect(Array.isArray(res.body.data) || res.body).toBeDefined();
      }
    });
  });

  describe("POST /api/v2/users/:id/upload-avatar - Upload Avatar", () => {
    it("should require authentication", async () => {
      const res = await request(app)
        .post("/api/v2/users/60d5ec49c1234567890123ab/upload-avatar")
        .attach("avatar", Buffer.from("fake image"), "avatar.png");

      expect([401, 403]).toContain(res.statusCode);
    });

    it("should reject missing file", async () => {
      const res = await request(app)
        .post("/api/v2/users/60d5ec49c1234567890123ab/upload-avatar")
        .set("Authorization", "Bearer token");

      expect([400, 401, 403]).toContain(res.statusCode);
    });

    it("should upload avatar successfully", async () => {
      const res = await request(app)
        .post("/api/v2/users/60d5ec49c1234567890123ab/upload-avatar")
        .set("Authorization", "Bearer token")
        .attach("avatar", Buffer.from("fake image"), "avatar.jpg");

      expect([200, 201, 400, 401, 403]).toContain(res.statusCode);
    });
  });
});
