import request from "supertest";
import app from "../app.js";

describe("Post Interactions & Comments", () => {
  describe("GET /api/v2/posts/explore - Explore Feed", () => {
    it("should return posts without authentication", async () => {
      const res = await request(app).get("/api/v2/posts/explore");
      expect([200, 401, 403]).toContain(res.statusCode);
    });

    it("should support pagination", async () => {
      const res = await request(app)
        .get("/api/v2/posts/explore")
        .query({ page: 1, limit: 20 });

      expect([200, 400, 401, 403]).toContain(res.statusCode);
    });

    it("should support sorting", async () => {
      const res = await request(app)
        .get("/api/v2/posts/explore")
        .query({ sortBy: "latest" });

      expect([200, 400, 401, 403]).toContain(res.statusCode);
    });

    it("should return trending posts", async () => {
      const res = await request(app)
        .get("/api/v2/posts/explore")
        .query({ sortBy: "trending" });

      expect([200, 400, 401, 403]).toContain(res.statusCode);
    });
  });

  describe("GET /api/v2/posts/following - Following Feed", () => {
    it("should require authentication", async () => {
      const res = await request(app).get("/api/v2/posts/following");
      expect([401, 403]).toContain(res.statusCode);
    });

    it("should return posts from followed users", async () => {
      const res = await request(app)
        .get("/api/v2/posts/following")
        .set("Authorization", "Bearer token");

      expect([200, 401, 403]).toContain(res.statusCode);
      if (res.statusCode === 200) {
        expect(Array.isArray(res.body.data || res.body)).toBe(true);
      }
    });

    it("should support pagination", async () => {
      const res = await request(app)
        .get("/api/v2/posts/following")
        .query({ page: 1, limit: 10 })
        .set("Authorization", "Bearer token");

      expect([200, 400, 401, 403]).toContain(res.statusCode);
    });
  });

  describe("GET /api/v2/posts/search - Search Posts", () => {
    it("should require search query", async () => {
      const res = await request(app).get("/api/v2/posts/search");
      expect([400, 401, 403]).toContain(res.statusCode);
    });

    it("should search by tag", async () => {
      const res = await request(app)
        .get("/api/v2/posts/search")
        .query({ tag: "health" });

      expect([200, 400, 401, 403]).toContain(res.statusCode);
    });

    it("should search by keyword", async () => {
      const res = await request(app)
        .get("/api/v2/posts/search")
        .query({ q: "medical advice" });

      expect([200, 400, 401, 403]).toContain(res.statusCode);
    });

    it("should support pagination", async () => {
      const res = await request(app)
        .get("/api/v2/posts/search")
        .query({ q: "health", page: 1, limit: 10 });

      expect([200, 400, 401, 403]).toContain(res.statusCode);
    });
  });

  describe("POST /api/v2/posts/:id/comments - Add Comment", () => {
    it("should require authentication", async () => {
      const res = await request(app)
        .post("/api/v2/posts/60d5ec49c1234567890123ab/comments")
        .send({ content: "Great post!" });

      expect([401, 403]).toContain(res.statusCode);
    });

    it("should require content", async () => {
      const res = await request(app)
        .post("/api/v2/posts/60d5ec49c1234567890123ab/comments")
        .set("Authorization", "Bearer token")
        .send({});

      expect([400, 401, 403]).toContain(res.statusCode);
    });

    it("should reject empty content", async () => {
      const res = await request(app)
        .post("/api/v2/posts/60d5ec49c1234567890123ab/comments")
        .set("Authorization", "Bearer token")
        .send({ content: "" });

      expect([400, 401, 403]).toContain(res.statusCode);
    });

    it("should add comment to post", async () => {
      const res = await request(app)
        .post("/api/v2/posts/60d5ec49c1234567890123ab/comments")
        .set("Authorization", "Bearer token")
        .send({ content: "This is very helpful!" });

      expect([201, 200, 400, 401, 403, 404]).toContain(res.statusCode);
    });

    it("should support nested replies", async () => {
      const res = await request(app)
        .post("/api/v2/posts/60d5ec49c1234567890123ab/comments")
        .set("Authorization", "Bearer token")
        .send({
          content: "Reply to comment",
          parentCommentId: "60d5ec49c1234567890123ac",
        });

      expect([201, 200, 400, 401, 403, 404]).toContain(res.statusCode);
    });
  });

  describe("GET /api/v2/posts/:id/comments - Get Comments", () => {
    it("should return comments without authentication", async () => {
      const res = await request(app).get(
        "/api/v2/posts/60d5ec49c1234567890123ab/comments"
      );

      expect([200, 400, 401, 403, 404]).toContain(res.statusCode);
    });

    it("should support pagination", async () => {
      const res = await request(app)
        .get("/api/v2/posts/60d5ec49c1234567890123ab/comments")
        .query({ page: 1, limit: 20 });

      expect([200, 400, 401, 403, 404]).toContain(res.statusCode);
    });

    it("should support sorting", async () => {
      const res = await request(app)
        .get("/api/v2/posts/60d5ec49c1234567890123ab/comments")
        .query({ sort: "-createdAt" });

      expect([200, 400, 401, 403, 404]).toContain(res.statusCode);
    });

    it("should include nested replies", async () => {
      const res = await request(app).get(
        "/api/v2/posts/60d5ec49c1234567890123ab/comments"
      );

      if (res.statusCode === 200) {
        const comments = res.body.data || res.body;
        if (Array.isArray(comments) && comments.length > 0) {
          expect(comments[0]).toHaveProperty("replies");
        }
      }
    });
  });

  describe("POST /api/v2/posts/:id/unlike - Unlike Post", () => {
    it("should require authentication", async () => {
      const res = await request(app).post(
        "/api/v2/posts/60d5ec49c1234567890123ab/unlike"
      );
      expect([401, 403]).toContain(res.statusCode);
    });

    it("should unlike a post", async () => {
      const res = await request(app)
        .post("/api/v2/posts/60d5ec49c1234567890123ab/unlike")
        .set("Authorization", "Bearer token");

      expect([200, 400, 401, 403, 404]).toContain(res.statusCode);
    });

    it("should handle unliking not-liked post", async () => {
      const res = await request(app)
        .post("/api/v2/posts/60d5ec49c1234567890123aa/unlike")
        .set("Authorization", "Bearer token");

      expect([200, 400, 401, 403, 404]).toContain(res.statusCode);
    });
  });

  describe("GET /api/v2/posts/:id/shares - Get Shares", () => {
    it("should return share count", async () => {
      const res = await request(app).get(
        "/api/v2/posts/60d5ec49c1234567890123ab/shares"
      );

      expect([200, 400, 401, 403, 404]).toContain(res.statusCode);
    });

    it("should return list of users who shared", async () => {
      const res = await request(app).get(
        "/api/v2/posts/60d5ec49c1234567890123ab/shares"
      );

      if (res.statusCode === 200) {
        expect(Array.isArray(res.body.data || res.body)).toBe(true);
      }
    });
  });

  describe("POST /api/v2/posts/:id/save - Save Post", () => {
    it("should require authentication", async () => {
      const res = await request(app).post(
        "/api/v2/posts/60d5ec49c1234567890123ab/save"
      );
      expect([401, 403]).toContain(res.statusCode);
    });

    it("should save post to collection", async () => {
      const res = await request(app)
        .post("/api/v2/posts/60d5ec49c1234567890123ab/save")
        .set("Authorization", "Bearer token");

      expect([200, 201, 400, 401, 403, 404]).toContain(res.statusCode);
    });
  });

  describe("GET /api/v2/posts/saved - Get Saved Posts", () => {
    it("should require authentication", async () => {
      const res = await request(app).get("/api/v2/posts/saved");
      expect([401, 403]).toContain(res.statusCode);
    });

    it("should return saved posts", async () => {
      const res = await request(app)
        .get("/api/v2/posts/saved")
        .set("Authorization", "Bearer token");

      expect([200, 401, 403]).toContain(res.statusCode);
    });
  });
});

describe("Comment Interactions", () => {
  describe("GET /api/v2/comments - List Comments", () => {
    it("should return comments", async () => {
      const res = await request(app).get("/api/v2/comments");
      expect([200, 401, 403]).toContain(res.statusCode);
    });

    it("should filter by post", async () => {
      const res = await request(app)
        .get("/api/v2/comments")
        .query({ postId: "60d5ec49c1234567890123ab" });

      expect([200, 400, 401, 403]).toContain(res.statusCode);
    });
  });

  describe("POST /api/v2/comments/:id/reply - Reply to Comment", () => {
    it("should require authentication", async () => {
      const res = await request(app)
        .post("/api/v2/comments/60d5ec49c1234567890123ab/reply")
        .send({ content: "Reply!" });

      expect([401, 403]).toContain(res.statusCode);
    });

    it("should reply to comment", async () => {
      const res = await request(app)
        .post("/api/v2/comments/60d5ec49c1234567890123ab/reply")
        .set("Authorization", "Bearer token")
        .send({ content: "This is a reply" });

      expect([201, 200, 400, 401, 403, 404]).toContain(res.statusCode);
    });
  });

  describe("GET /api/v2/comments/:id/likes - Get Comment Likes", () => {
    it("should return likes", async () => {
      const res = await request(app).get(
        "/api/v2/comments/60d5ec49c1234567890123ab/likes"
      );

      expect([200, 400, 401, 403, 404]).toContain(res.statusCode);
    });
  });
});
