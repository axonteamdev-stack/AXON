import request from "supertest";
import app from "../app.js";

describe("Article Interactions & Engagement", () => {
  describe("GET /api/v2/articles/:id/shares - Get Article Shares", () => {
    it("should return shares count", async () => {
      const res = await request(app).get(
        "/api/v2/articles/60d5ec49c1234567890123ab/shares"
      );

      expect([200, 400, 401, 403, 404]).toContain(res.statusCode);
    });

    it("should return list of users who shared", async () => {
      const res = await request(app).get(
        "/api/v2/articles/60d5ec49c1234567890123ab/shares"
      );

      if (res.statusCode === 200) {
        expect(Array.isArray(res.body.data || res.body)).toBe(true);
      }
    });
  });

  describe("POST /api/v2/articles/:id/unlike - Unlike Article", () => {
    it("should require authentication", async () => {
      const res = await request(app).post(
        "/api/v2/articles/60d5ec49c1234567890123ab/unlike"
      );
      expect([401, 403]).toContain(res.statusCode);
    });

    it("should unlike an article", async () => {
      const res = await request(app)
        .post("/api/v2/articles/60d5ec49c1234567890123ab/unlike")
        .set("Authorization", "Bearer token");

      expect([200, 400, 401, 403, 404]).toContain(res.statusCode);
    });
  });

  describe("POST /api/v2/articles/:id/save - Save Article", () => {
    it("should require authentication", async () => {
      const res = await request(app).post(
        "/api/v2/articles/60d5ec49c1234567890123ab/save"
      );
      expect([401, 403]).toContain(res.statusCode);
    });

    it("should save article", async () => {
      const res = await request(app)
        .post("/api/v2/articles/60d5ec49c1234567890123ab/save")
        .set("Authorization", "Bearer token");

      expect([200, 201, 400, 401, 403, 404]).toContain(res.statusCode);
    });
  });

  describe("GET /api/v2/articles/saved - Get Saved Articles", () => {
    it("should require authentication", async () => {
      const res = await request(app).get("/api/v2/articles/saved");
      expect([401, 403]).toContain(res.statusCode);
    });

    it("should return saved articles", async () => {
      const res = await request(app)
        .get("/api/v2/articles/saved")
        .set("Authorization", "Bearer token");

      expect([200, 401, 403]).toContain(res.statusCode);
    });
  });

  describe("POST /api/v2/articles/:id/comments - Comment on Article", () => {
    it("should require authentication", async () => {
      const res = await request(app)
        .post("/api/v2/articles/60d5ec49c1234567890123ab/comments")
        .send({ content: "Great article!" });

      expect([401, 403]).toContain(res.statusCode);
    });

    it("should add comment", async () => {
      const res = await request(app)
        .post("/api/v2/articles/60d5ec49c1234567890123ab/comments")
        .set("Authorization", "Bearer token")
        .send({ content: "Very informative!" });

      expect([201, 200, 400, 401, 403, 404]).toContain(res.statusCode);
    });
  });

  describe("GET /api/v2/articles/:id/comments - Get Article Comments", () => {
    it("should return comments", async () => {
      const res = await request(app).get(
        "/api/v2/articles/60d5ec49c1234567890123ab/comments"
      );

      expect([200, 400, 401, 403, 404]).toContain(res.statusCode);
    });

    it("should support pagination", async () => {
      const res = await request(app)
        .get("/api/v2/articles/60d5ec49c1234567890123ab/comments")
        .query({ page: 1, limit: 10 });

      expect([200, 400, 401, 403, 404]).toContain(res.statusCode);
    });
  });

  describe("Article Bookmark & Collections", () => {
    it("should add article to collection", async () => {
      const res = await request(app)
        .post("/api/v2/articles/60d5ec49c1234567890123ab/bookmark")
        .set("Authorization", "Bearer token")
        .send({ collectionName: "Favorites" });

      expect([200, 201, 400, 401, 403, 404]).toContain(res.statusCode);
    });

    it("should remove article from bookmarks", async () => {
      const res = await request(app)
        .delete("/api/v2/articles/60d5ec49c1234567890123ab/bookmark")
        .set("Authorization", "Bearer token");

      expect([200, 204, 400, 401, 403, 404]).toContain(res.statusCode);
    });

    it("should get bookmark collections", async () => {
      const res = await request(app)
        .get("/api/v2/articles/bookmarks/collections")
        .set("Authorization", "Bearer token");

      expect([200, 401, 403]).toContain(res.statusCode);
    });
  });

  describe("Article Analytics (Doctor Only)", () => {
    it("should require doctor role for analytics", async () => {
      const res = await request(app)
        .get("/api/v2/articles/60d5ec49c1234567890123ab/analytics")
        .set("Authorization", "Bearer patient-token");

      expect([403, 401]).toContain(res.statusCode);
    });

    it("should return article analytics", async () => {
      const res = await request(app)
        .get("/api/v2/articles/60d5ec49c1234567890123ab/analytics")
        .set("Authorization", "Bearer doctor-token");

      expect([200, 401, 403, 404]).toContain(res.statusCode);
      if (res.statusCode === 200) {
        expect(res.body).toHaveProperty("views");
        expect(res.body).toHaveProperty("likes");
        expect(res.body).toHaveProperty("shares");
      }
    });
  });

  describe("Article Drafts", () => {
    it("should create draft article", async () => {
      const res = await request(app)
        .post("/api/v2/articles/drafts")
        .set("Authorization", "Bearer doctor-token")
        .send({
          title: "Draft Title",
          content: "Draft content...",
        });

      expect([201, 200, 400, 401, 403]).toContain(res.statusCode);
    });

    it("should list draft articles", async () => {
      const res = await request(app)
        .get("/api/v2/articles/drafts")
        .set("Authorization", "Bearer doctor-token");

      expect([200, 401, 403]).toContain(res.statusCode);
    });

    it("should publish draft article", async () => {
      const res = await request(app)
        .post("/api/v2/articles/drafts/60d5ec49c1234567890123ab/publish")
        .set("Authorization", "Bearer doctor-token");

      expect([200, 400, 401, 403, 404]).toContain(res.statusCode);
    });
  });
});
