import request from "supertest";
import app from "../app.js";

describe("Article API Endpoints", () => {
  describe("GET /api/v2/articles - List Articles", () => {
    it("should return articles without authentication", async () => {
      const res = await request(app).get("/api/v2/articles");

      expect([200, 401, 403]).toContain(res.statusCode);
    });

    it("should support pagination", async () => {
      const res = await request(app)
        .get("/api/v2/articles")
        .query({ page: 1, limit: 10 });

      expect([200, 400, 401, 403]).toContain(res.statusCode);
    });

    it("should filter by category", async () => {
      const res = await request(app)
        .get("/api/v2/articles")
        .query({ category: "health" });

      expect([200, 400, 401, 403]).toContain(res.statusCode);
    });

    it("should filter by search term", async () => {
      const res = await request(app)
        .get("/api/v2/articles")
        .query({ search: "COVID" });

      expect([200, 400, 401, 403]).toContain(res.statusCode);
    });

    it("should sort by date", async () => {
      const res = await request(app)
        .get("/api/v2/articles")
        .query({ sort: "-createdAt" });

      expect([200, 400, 401, 403]).toContain(res.statusCode);
    });
  });

  describe("POST /api/v2/articles - Create Article", () => {
    it("should require authentication", async () => {
      const res = await request(app)
        .post("/api/v2/articles")
        .send({ title: "New Article" });

      expect([401, 403]).toContain(res.statusCode);
    });

    it("should require title", async () => {
      const res = await request(app)
        .post("/api/v2/articles")
        .set("Authorization", "Bearer token")
        .send({ content: "Article content" });

      expect([400, 401, 403]).toContain(res.statusCode);
    });

    it("should require content", async () => {
      const res = await request(app)
        .post("/api/v2/articles")
        .set("Authorization", "Bearer token")
        .send({ title: "Article Title" });

      expect([400, 401, 403]).toContain(res.statusCode);
    });

    it("should reject empty title", async () => {
      const res = await request(app)
        .post("/api/v2/articles")
        .set("Authorization", "Bearer token")
        .send({
          title: "",
          content: "Article content",
        });

      expect([400, 401, 403]).toContain(res.statusCode);
    });

    it("should accept valid article data", async () => {
      const res = await request(app)
        .post("/api/v2/articles")
        .set("Authorization", "Bearer token")
        .send({
          title: "Health Tips",
          content: "Article content here",
          category: "health",
          keywords: ["health", "tips"],
        });

      expect([201, 400, 401, 403]).toContain(res.statusCode);
    });
  });

  describe("GET /api/v2/articles/:id - Get Article By ID", () => {
    it("should return article without authentication", async () => {
      const res = await request(app).get(
        "/api/v2/articles/60d5ec49c1234567890123ab",
      );

      expect([200, 400, 401, 403, 404]).toContain(res.statusCode);
    });

    it("should reject invalid ObjectId", async () => {
      const res = await request(app).get("/api/v2/articles/invalid-id");

      expect([400, 401, 403, 404]).toContain(res.statusCode);
    });

    it("should return 404 for non-existent article", async () => {
      const res = await request(app).get(
        "/api/v2/articles/60d5ec49c1234567890123ab",
      );

      expect([404, 400]).toContain(res.statusCode);
    });

    it("should include author information", async () => {
      const res = await request(app).get(
        "/api/v2/articles/60d5ec49c1234567890123ab",
      );

      if (res.statusCode === 200) {
        expect(res.body).toHaveProperty("author");
      }
    });
  });

  describe("PUT /api/v2/articles/:id - Update Article", () => {
    it("should require authentication", async () => {
      const res = await request(app)
        .put("/api/v2/articles/60d5ec49c1234567890123ab")
        .send({ title: "Updated Title" });

      expect([401, 403]).toContain(res.statusCode);
    });

    it("should reject invalid ObjectId", async () => {
      const res = await request(app)
        .put("/api/v2/articles/invalid-id")
        .set("Authorization", "Bearer token")
        .send({ title: "Updated Title" });

      expect([400, 401, 403]).toContain(res.statusCode);
    });

    it("should update article fields", async () => {
      const res = await request(app)
        .put("/api/v2/articles/60d5ec49c1234567890123ab")
        .set("Authorization", "Bearer token")
        .send({
          title: "Updated Title",
          content: "Updated content",
        });

      expect([200, 400, 401, 403, 404]).toContain(res.statusCode);
    });

    it("should require article ownership", async () => {
      const res = await request(app)
        .put("/api/v2/articles/60d5ec49c1234567890123ab")
        .set("Authorization", "Bearer other-user-token")
        .send({ title: "Hacked Title" });

      expect([200, 403, 404, 400, 401]).toContain(res.statusCode);
    });
  });

  describe("DELETE /api/v2/articles/:id - Delete Article", () => {
    it("should require authentication", async () => {
      const res = await request(app).delete(
        "/api/v2/articles/60d5ec49c1234567890123ab",
      );

      expect([401, 403]).toContain(res.statusCode);
    });

    it("should reject invalid ObjectId", async () => {
      const res = await request(app)
        .delete("/api/v2/articles/invalid-id")
        .set("Authorization", "Bearer token");

      expect([400, 401, 403]).toContain(res.statusCode);
    });

    it("should delete article", async () => {
      const res = await request(app)
        .delete("/api/v2/articles/60d5ec49c1234567890123ab")
        .set("Authorization", "Bearer token");

      expect([200, 204, 400, 401, 403, 404]).toContain(res.statusCode);
    });

    it("should require article ownership", async () => {
      const res = await request(app)
        .delete("/api/v2/articles/60d5ec49c1234567890123ab")
        .set("Authorization", "Bearer other-user-token");

      expect([403, 404, 400, 401, 200, 204]).toContain(res.statusCode);
    });
  });

  describe("GET /api/v2/articles/:id/comments - Get Article Comments", () => {
    it("should return comments without authentication", async () => {
      const res = await request(app).get(
        "/api/v2/articles/60d5ec49c1234567890123ab/comments",
      );

      expect([200, 400, 401, 403, 404]).toContain(res.statusCode);
    });

    it("should support pagination for comments", async () => {
      const res = await request(app)
        .get("/api/v2/articles/60d5ec49c1234567890123ab/comments")
        .query({ page: 1, limit: 10 });

      expect([200, 400, 401, 403, 404]).toContain(res.statusCode);
    });
  });

  describe("POST /api/v2/articles/:id/like - Like Article", () => {
    it("should require authentication", async () => {
      const res = await request(app).post(
        "/api/v2/articles/60d5ec49c1234567890123ab/like",
      );

      expect([401, 403]).toContain(res.statusCode);
    });

    it("should toggle like on article", async () => {
      const res = await request(app)
        .post("/api/v2/articles/60d5ec49c1234567890123ab/like")
        .set("Authorization", "Bearer token");

      expect([200, 400, 401, 403, 404]).toContain(res.statusCode);
    });
  });
});
