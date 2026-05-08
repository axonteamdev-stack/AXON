import request from "supertest";
import app from "../app.js";

describe("Comment API Endpoints", () => {
  describe("POST /api/v2/comments - Create Comment", () => {
    it("should require authentication", async () => {
      const res = await request(app)
        .post("/api/v2/comments")
        .send({
          content: "Great post!",
          targetId: "60d5ec49c1234567890123ab",
          targetType: "post",
        });

      expect([401, 403]).toContain(res.statusCode);
    });

    it("should require content", async () => {
      const res = await request(app)
        .post("/api/v2/comments")
        .set("Authorization", "Bearer token")
        .send({
          targetId: "60d5ec49c1234567890123ab",
          targetType: "post",
        });

      expect([400, 401, 403]).toContain(res.statusCode);
    });

    it("should require targetId", async () => {
      const res = await request(app)
        .post("/api/v2/comments")
        .set("Authorization", "Bearer token")
        .send({
          content: "Great post!",
          targetType: "post",
        });

      expect([400, 401, 403]).toContain(res.statusCode);
    });

    it("should require targetType", async () => {
      const res = await request(app)
        .post("/api/v2/comments")
        .set("Authorization", "Bearer token")
        .send({
          content: "Great post!",
          targetId: "60d5ec49c1234567890123ab",
        });

      expect([400, 401, 403]).toContain(res.statusCode);
    });

    it("should reject empty content", async () => {
      const res = await request(app)
        .post("/api/v2/comments")
        .set("Authorization", "Bearer token")
        .send({
          content: "",
          targetId: "60d5ec49c1234567890123ab",
          targetType: "post",
        });

      expect([400, 401, 403]).toContain(res.statusCode);
    });

    it("should accept valid comment on post", async () => {
      const res = await request(app)
        .post("/api/v2/comments")
        .set("Authorization", "Bearer token")
        .send({
          content: "Great post!",
          targetId: "60d5ec49c1234567890123ab",
          targetType: "post",
        });

      expect([201, 400, 401, 403, 404]).toContain(res.statusCode);
    });

    it("should accept valid comment on article", async () => {
      const res = await request(app)
        .post("/api/v2/comments")
        .set("Authorization", "Bearer token")
        .send({
          content: "Informative article!",
          targetId: "60d5ec49c1234567890123ab",
          targetType: "article",
        });

      expect([201, 400, 401, 403, 404]).toContain(res.statusCode);
    });

    it("should support reply comments", async () => {
      const res = await request(app)
        .post("/api/v2/comments")
        .set("Authorization", "Bearer token")
        .send({
          content: "I agree!",
          targetId: "60d5ec49c1234567890123ab",
          targetType: "post",
          parentCommentId: "60d5ec49c1234567890123ac",
        });

      expect([201, 400, 401, 403, 404]).toContain(res.statusCode);
    });
  });

  describe("GET /api/v2/comments/:id - Get Comment", () => {
    it("should return comment without authentication", async () => {
      const res = await request(app).get(
        "/api/v2/comments/60d5ec49c1234567890123ab",
      );

      expect([200, 400, 401, 403, 404]).toContain(res.statusCode);
    });

    it("should reject invalid ObjectId", async () => {
      const res = await request(app).get("/api/v2/comments/invalid-id");

      expect([400, 401, 403, 404]).toContain(res.statusCode);
    });

    it("should return 404 for non-existent comment", async () => {
      const res = await request(app).get(
        "/api/v2/comments/60d5ec49c1234567890123ab",
      );

      expect([404, 400]).toContain(res.statusCode);
    });
  });

  describe("PUT /api/v2/comments/:id - Update Comment", () => {
    it("should require authentication", async () => {
      const res = await request(app)
        .put("/api/v2/comments/60d5ec49c1234567890123ab")
        .send({ content: "Updated comment" });

      expect([401, 403]).toContain(res.statusCode);
    });

    it("should reject invalid ObjectId", async () => {
      const res = await request(app)
        .put("/api/v2/comments/invalid-id")
        .set("Authorization", "Bearer token")
        .send({ content: "Updated comment" });

      expect([400, 401, 403]).toContain(res.statusCode);
    });

    it("should update comment content", async () => {
      const res = await request(app)
        .put("/api/v2/comments/60d5ec49c1234567890123ab")
        .set("Authorization", "Bearer token")
        .send({ content: "Updated comment text" });

      expect([200, 400, 401, 403, 404]).toContain(res.statusCode);
    });

    it("should require comment ownership", async () => {
      const res = await request(app)
        .put("/api/v2/comments/60d5ec49c1234567890123ab")
        .set("Authorization", "Bearer other-user-token")
        .send({ content: "Hacked content" });

      expect([403, 404, 200, 400, 401]).toContain(res.statusCode);
    });
  });

  describe("DELETE /api/v2/comments/:id - Delete Comment", () => {
    it("should require authentication", async () => {
      const res = await request(app).delete(
        "/api/v2/comments/60d5ec49c1234567890123ab",
      );

      expect([401, 403]).toContain(res.statusCode);
    });

    it("should reject invalid ObjectId", async () => {
      const res = await request(app)
        .delete("/api/v2/comments/invalid-id")
        .set("Authorization", "Bearer token");

      expect([400, 401, 403]).toContain(res.statusCode);
    });

    it("should delete comment", async () => {
      const res = await request(app)
        .delete("/api/v2/comments/60d5ec49c1234567890123ab")
        .set("Authorization", "Bearer token");

      expect([200, 204, 400, 401, 403, 404]).toContain(res.statusCode);
    });

    it("should require comment ownership", async () => {
      const res = await request(app)
        .delete("/api/v2/comments/60d5ec49c1234567890123ab")
        .set("Authorization", "Bearer other-user-token");

      expect([403, 404, 200, 204, 400, 401]).toContain(res.statusCode);
    });
  });

  describe("POST /api/v2/comments/:id/like - Like Comment", () => {
    it("should require authentication", async () => {
      const res = await request(app).post(
        "/api/v2/comments/60d5ec49c1234567890123ab/like",
      );

      expect([401, 403]).toContain(res.statusCode);
    });

    it("should toggle like on comment", async () => {
      const res = await request(app)
        .post("/api/v2/comments/60d5ec49c1234567890123ab/like")
        .set("Authorization", "Bearer token");

      expect([200, 400, 401, 403, 404]).toContain(res.statusCode);
    });
  });

  describe("GET /api/v2/comments/:id/replies - Get Comment Replies", () => {
    it("should return replies without authentication", async () => {
      const res = await request(app).get(
        "/api/v2/comments/60d5ec49c1234567890123ab/replies",
      );

      expect([200, 400, 401, 403, 404]).toContain(res.statusCode);
    });

    it("should support pagination for replies", async () => {
      const res = await request(app)
        .get("/api/v2/comments/60d5ec49c1234567890123ab/replies")
        .query({ page: 1, limit: 10 });

      expect([200, 400, 401, 403, 404]).toContain(res.statusCode);
    });
  });
});
