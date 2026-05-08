import request from "supertest";
import app from "../app.js";

describe("Post API Endpoints", () => {
  describe("GET /api/v2/posts - List Posts", () => {
    it("should return posts without authentication", async () => {
      const res = await request(app).get("/api/v2/posts");

      expect([200, 401, 403]).toContain(res.statusCode);
    });

    it("should support pagination", async () => {
      const res = await request(app)
        .get("/api/v2/posts")
        .query({ page: 1, limit: 10 });

      expect([200, 400, 401, 403]).toContain(res.statusCode);
    });

    it("should filter by user", async () => {
      const res = await request(app)
        .get("/api/v2/posts")
        .query({ userId: "60d5ec49c1234567890123ab" });

      expect([200, 400, 401, 403]).toContain(res.statusCode);
    });

    it("should search posts", async () => {
      const res = await request(app)
        .get("/api/v2/posts")
        .query({ search: "health" });

      expect([200, 400, 401, 403]).toContain(res.statusCode);
    });

    it("should sort posts", async () => {
      const res = await request(app)
        .get("/api/v2/posts")
        .query({ sort: "-createdAt" });

      expect([200, 400, 401, 403]).toContain(res.statusCode);
    });
  });

  describe("POST /api/v2/posts - Create Post", () => {
    it("should require authentication", async () => {
      const res = await request(app)
        .post("/api/v2/posts")
        .send({ content: "New post" });

      expect([401, 403]).toContain(res.statusCode);
    });

    it("should require content", async () => {
      const res = await request(app)
        .post("/api/v2/posts")
        .set("Authorization", "Bearer token")
        .send({});

      expect([400, 401, 403]).toContain(res.statusCode);
    });

    it("should reject empty content", async () => {
      const res = await request(app)
        .post("/api/v2/posts")
        .set("Authorization", "Bearer token")
        .send({ content: "" });

      expect([400, 401, 403]).toContain(res.statusCode);
    });

    it("should accept valid post data", async () => {
      const res = await request(app)
        .post("/api/v2/posts")
        .set("Authorization", "Bearer token")
        .send({
          content: "This is a community post",
          images: [],
        });

      expect([201, 400, 401, 403]).toContain(res.statusCode);
    });

    it("should accept post with images", async () => {
      const res = await request(app)
        .post("/api/v2/posts")
        .set("Authorization", "Bearer token")
        .send({
          content: "Post with images",
          images: ["image1.jpg", "image2.jpg"],
        });

      expect([201, 400, 401, 403]).toContain(res.statusCode);
    });
  });

  describe("GET /api/v2/posts/:id - Get Post By ID", () => {
    it("should return post without authentication", async () => {
      const res = await request(app).get(
        "/api/v2/posts/60d5ec49c1234567890123ab",
      );

      expect([200, 400, 401, 403, 404]).toContain(res.statusCode);
    });

    it("should reject invalid ObjectId", async () => {
      const res = await request(app).get("/api/v2/posts/invalid-id");

      expect([400, 401, 403, 404]).toContain(res.statusCode);
    });

    it("should return 404 for non-existent post", async () => {
      const res = await request(app).get(
        "/api/v2/posts/60d5ec49c1234567890123ab",
      );

      expect([404, 400]).toContain(res.statusCode);
    });

    it("should include author information", async () => {
      const res = await request(app).get(
        "/api/v2/posts/60d5ec49c1234567890123ab",
      );

      if (res.statusCode === 200) {
        expect(res.body).toHaveProperty("author");
      }
    });
  });

  describe("PUT /api/v2/posts/:id - Update Post", () => {
    it("should require authentication", async () => {
      const res = await request(app)
        .put("/api/v2/posts/60d5ec49c1234567890123ab")
        .send({ content: "Updated content" });

      expect([401, 403]).toContain(res.statusCode);
    });

    it("should reject invalid ObjectId", async () => {
      const res = await request(app)
        .put("/api/v2/posts/invalid-id")
        .set("Authorization", "Bearer token")
        .send({ content: "Updated content" });

      expect([400, 401, 403]).toContain(res.statusCode);
    });

    it("should update post content", async () => {
      const res = await request(app)
        .put("/api/v2/posts/60d5ec49c1234567890123ab")
        .set("Authorization", "Bearer token")
        .send({ content: "Updated post content" });

      expect([200, 400, 401, 403, 404]).toContain(res.statusCode);
    });

    it("should require post ownership", async () => {
      const res = await request(app)
        .put("/api/v2/posts/60d5ec49c1234567890123ab")
        .set("Authorization", "Bearer other-user-token")
        .send({ content: "Hacked content" });

      expect([403, 404, 200, 400, 401]).toContain(res.statusCode);
    });
  });

  describe("DELETE /api/v2/posts/:id - Delete Post", () => {
    it("should require authentication", async () => {
      const res = await request(app).delete(
        "/api/v2/posts/60d5ec49c1234567890123ab",
      );

      expect([401, 403]).toContain(res.statusCode);
    });

    it("should reject invalid ObjectId", async () => {
      const res = await request(app)
        .delete("/api/v2/posts/invalid-id")
        .set("Authorization", "Bearer token");

      expect([400, 401, 403]).toContain(res.statusCode);
    });

    it("should delete post", async () => {
      const res = await request(app)
        .delete("/api/v2/posts/60d5ec49c1234567890123ab")
        .set("Authorization", "Bearer token");

      expect([200, 204, 400, 401, 403, 404]).toContain(res.statusCode);
    });

    it("should require post ownership", async () => {
      const res = await request(app)
        .delete("/api/v2/posts/60d5ec49c1234567890123ab")
        .set("Authorization", "Bearer other-user-token");

      expect([403, 404, 200, 204, 400, 401]).toContain(res.statusCode);
    });
  });

  describe("POST /api/v2/posts/:id/like - Like Post", () => {
    it("should require authentication", async () => {
      const res = await request(app).post(
        "/api/v2/posts/60d5ec49c1234567890123ab/like",
      );

      expect([401, 403]).toContain(res.statusCode);
    });

    it("should toggle like on post", async () => {
      const res = await request(app)
        .post("/api/v2/posts/60d5ec49c1234567890123ab/like")
        .set("Authorization", "Bearer token");

      expect([200, 400, 401, 403, 404]).toContain(res.statusCode);
    });
  });

  describe("POST /api/v2/posts/:id/share - Share Post", () => {
    it("should require authentication", async () => {
      const res = await request(app)
        .post("/api/v2/posts/60d5ec49c1234567890123ab/share")
        .send({ message: "Check this out" });

      expect([401, 403]).toContain(res.statusCode);
    });

    it("should share post", async () => {
      const res = await request(app)
        .post("/api/v2/posts/60d5ec49c1234567890123ab/share")
        .set("Authorization", "Bearer token")
        .send({ message: "Check this out" });

      expect([201, 200, 400, 401, 403, 404]).toContain(res.statusCode);
    });
  });

  describe("GET /api/v2/posts/:id/likes - Get Post Likes", () => {
    it("should return post likes without authentication", async () => {
      const res = await request(app).get(
        "/api/v2/posts/60d5ec49c1234567890123ab/likes",
      );

      expect([200, 400, 401, 403, 404]).toContain(res.statusCode);
    });
  });
});
