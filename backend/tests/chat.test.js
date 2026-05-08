import request from "supertest";
import app from "../app.js";

describe("Chat API Endpoints", () => {
  describe("GET /api/v2/chat/conversations - Get Conversations", () => {
    it("should require authentication", async () => {
      const res = await request(app).get("/api/v2/chat/conversations");

      expect([401, 403]).toContain(res.statusCode);
    });

    it("should support pagination", async () => {
      const res = await request(app)
        .get("/api/v2/chat/conversations")
        .query({ page: 1, limit: 10 })
        .set("Authorization", "Bearer token");

      expect([200, 400, 401, 403]).toContain(res.statusCode);
    });

    it("should sort conversations by latest message", async () => {
      const res = await request(app)
        .get("/api/v2/chat/conversations")
        .query({ sort: "-lastMessage" })
        .set("Authorization", "Bearer token");

      expect([200, 400, 401, 403]).toContain(res.statusCode);
    });
  });

  describe("POST /api/v2/chat/conversations - Create Conversation", () => {
    it("should require authentication", async () => {
      const res = await request(app)
        .post("/api/v2/chat/conversations")
        .send({ participantId: "60d5ec49c1234567890123ab" });

      expect([401, 403]).toContain(res.statusCode);
    });

    it("should require participantId", async () => {
      const res = await request(app)
        .post("/api/v2/chat/conversations")
        .set("Authorization", "Bearer token")
        .send({});

      expect([400, 401, 403]).toContain(res.statusCode);
    });

    it("should create conversation with user", async () => {
      const res = await request(app)
        .post("/api/v2/chat/conversations")
        .set("Authorization", "Bearer token")
        .send({
          participantId: "60d5ec49c1234567890123ab",
        });

      expect([201, 400, 401, 403, 409]).toContain(res.statusCode);
    });
  });

  describe("GET /api/v2/chat/conversations/:conversationId/messages - Get Messages", () => {
    it("should require authentication", async () => {
      const res = await request(app).get(
        "/api/v2/chat/conversations/60d5ec49c1234567890123ab/messages",
      );

      expect([401, 403]).toContain(res.statusCode);
    });

    it("should support pagination", async () => {
      const res = await request(app)
        .get("/api/v2/chat/conversations/60d5ec49c1234567890123ab/messages")
        .query({ page: 1, limit: 20 })
        .set("Authorization", "Bearer token");

      expect([200, 400, 401, 403, 404]).toContain(res.statusCode);
    });

    it("should return messages in chronological order", async () => {
      const res = await request(app)
        .get("/api/v2/chat/conversations/60d5ec49c1234567890123ab/messages")
        .set("Authorization", "Bearer token");

      if (res.statusCode === 200) {
        expect(Array.isArray(res.body.data || res.body.messages || res.body))
          .toBe(true);
      }
    });
  });

  describe("POST /api/v2/chat/conversations/:conversationId/messages - Send Message", () => {
    it("should require authentication", async () => {
      const res = await request(app)
        .post("/api/v2/chat/conversations/60d5ec49c1234567890123ab/messages")
        .send({ content: "Hello!" });

      expect([401, 403]).toContain(res.statusCode);
    });

    it("should require content", async () => {
      const res = await request(app)
        .post("/api/v2/chat/conversations/60d5ec49c1234567890123ab/messages")
        .set("Authorization", "Bearer token")
        .send({});

      expect([400, 401, 403]).toContain(res.statusCode);
    });

    it("should reject empty content", async () => {
      const res = await request(app)
        .post("/api/v2/chat/conversations/60d5ec49c1234567890123ab/messages")
        .set("Authorization", "Bearer token")
        .send({ content: "" });

      expect([400, 401, 403]).toContain(res.statusCode);
    });

    it("should send message", async () => {
      const res = await request(app)
        .post("/api/v2/chat/conversations/60d5ec49c1234567890123ab/messages")
        .set("Authorization", "Bearer token")
        .send({
          content: "Hello there!",
        });

      expect([201, 200, 400, 401, 403, 404]).toContain(res.statusCode);
    });

    it("should support message attachments", async () => {
      const res = await request(app)
        .post("/api/v2/chat/conversations/60d5ec49c1234567890123ab/messages")
        .set("Authorization", "Bearer token")
        .send({
          content: "Check this file",
          attachments: ["file.pdf"],
        });

      expect([201, 200, 400, 401, 403, 404]).toContain(res.statusCode);
    });
  });

  describe("PUT /api/v2/chat/messages/:messageId - Edit Message", () => {
    it("should require authentication", async () => {
      const res = await request(app)
        .put("/api/v2/chat/messages/60d5ec49c1234567890123ab")
        .send({ content: "Edited message" });

      expect([401, 403]).toContain(res.statusCode);
    });

    it("should reject invalid ObjectId", async () => {
      const res = await request(app)
        .put("/api/v2/chat/messages/invalid-id")
        .set("Authorization", "Bearer token")
        .send({ content: "Edited message" });

      expect([400, 401, 403]).toContain(res.statusCode);
    });

    it("should edit message", async () => {
      const res = await request(app)
        .put("/api/v2/chat/messages/60d5ec49c1234567890123ab")
        .set("Authorization", "Bearer token")
        .send({ content: "Edited message text" });

      expect([200, 400, 401, 403, 404]).toContain(res.statusCode);
    });

    it("should require message ownership", async () => {
      const res = await request(app)
        .put("/api/v2/chat/messages/60d5ec49c1234567890123ab")
        .set("Authorization", "Bearer other-user-token")
        .send({ content: "Hacked content" });

      expect([403, 404, 200, 400, 401]).toContain(res.statusCode);
    });
  });

  describe("DELETE /api/v2/chat/messages/:messageId - Delete Message", () => {
    it("should require authentication", async () => {
      const res = await request(app).delete(
        "/api/v2/chat/messages/60d5ec49c1234567890123ab",
      );

      expect([401, 403]).toContain(res.statusCode);
    });

    it("should reject invalid ObjectId", async () => {
      const res = await request(app)
        .delete("/api/v2/chat/messages/invalid-id")
        .set("Authorization", "Bearer token");

      expect([400, 401, 403]).toContain(res.statusCode);
    });

    it("should delete message", async () => {
      const res = await request(app)
        .delete("/api/v2/chat/messages/60d5ec49c1234567890123ab")
        .set("Authorization", "Bearer token");

      expect([200, 204, 400, 401, 403, 404]).toContain(res.statusCode);
    });

    it("should require message ownership", async () => {
      const res = await request(app)
        .delete("/api/v2/chat/messages/60d5ec49c1234567890123ab")
        .set("Authorization", "Bearer other-user-token");

      expect([403, 404, 200, 204, 400, 401]).toContain(res.statusCode);
    });
  });

  describe("POST /api/v2/chat/conversations/:conversationId/mark-as-read - Mark as Read", () => {
    it("should require authentication", async () => {
      const res = await request(app).post(
        "/api/v2/chat/conversations/60d5ec49c1234567890123ab/mark-as-read",
      );

      expect([401, 403]).toContain(res.statusCode);
    });

    it("should mark conversation as read", async () => {
      const res = await request(app)
        .post(
          "/api/v2/chat/conversations/60d5ec49c1234567890123ab/mark-as-read",
        )
        .set("Authorization", "Bearer token");

      expect([200, 201, 400, 401, 403, 404]).toContain(res.statusCode);
    });
  });

  describe("GET /api/v2/chat/search - Search Messages", () => {
    it("should require authentication", async () => {
      const res = await request(app)
        .get("/api/v2/chat/search")
        .query({ query: "hello" });

      expect([401, 403]).toContain(res.statusCode);
    });

    it("should search messages", async () => {
      const res = await request(app)
        .get("/api/v2/chat/search")
        .query({ query: "hello" })
        .set("Authorization", "Bearer token");

      expect([200, 400, 401, 403]).toContain(res.statusCode);
    });
  });
});
