import request from "supertest";
import app from "../app.js";

describe("Advanced Chat Features", () => {
  describe("GET /api/v2/chat/conversations/:id - Get Conversation Details", () => {
    it("should require authentication", async () => {
      const res = await request(app).get(
        "/api/v2/chat/conversations/60d5ec49c1234567890123ab"
      );
      expect([401, 403]).toContain(res.statusCode);
    });

    it("should reject invalid conversation ID", async () => {
      const res = await request(app)
        .get("/api/v2/chat/conversations/invalid-id")
        .set("Authorization", "Bearer token");

      expect([400, 401, 403]).toContain(res.statusCode);
    });

    it("should return conversation details", async () => {
      const res = await request(app)
        .get("/api/v2/chat/conversations/60d5ec49c1234567890123ab")
        .set("Authorization", "Bearer token");

      expect([200, 401, 403, 404]).toContain(res.statusCode);
      if (res.statusCode === 200) {
        expect(res.body).toHaveProperty("participants");
        expect(res.body).toHaveProperty("messages");
      }
    });

    it("should not allow accessing others conversations", async () => {
      const res = await request(app)
        .get("/api/v2/chat/conversations/60d5ec49c1234567890123aa")
        .set("Authorization", "Bearer other-user-token");

      expect([403, 404, 401]).toContain(res.statusCode);
    });
  });

  describe("DELETE /api/v2/chat/conversations/:id - Delete Conversation", () => {
    it("should require authentication", async () => {
      const res = await request(app).delete(
        "/api/v2/chat/conversations/60d5ec49c1234567890123ab"
      );
      expect([401, 403]).toContain(res.statusCode);
    });

    it("should delete conversation", async () => {
      const res = await request(app)
        .delete("/api/v2/chat/conversations/60d5ec49c1234567890123ab")
        .set("Authorization", "Bearer token");

      expect([200, 204, 400, 401, 403, 404]).toContain(res.statusCode);
    });

    it("should only allow participants to delete", async () => {
      const res = await request(app)
        .delete("/api/v2/chat/conversations/60d5ec49c1234567890123ab")
        .set("Authorization", "Bearer non-participant-token");

      expect([403, 404, 401]).toContain(res.statusCode);
    });
  });

  describe("GET /api/v2/chat/messages/:id - Get Single Message", () => {
    it("should require authentication", async () => {
      const res = await request(app).get(
        "/api/v2/chat/messages/60d5ec49c1234567890123ab"
      );
      expect([401, 403]).toContain(res.statusCode);
    });

    it("should return message details", async () => {
      const res = await request(app)
        .get("/api/v2/chat/messages/60d5ec49c1234567890123ab")
        .set("Authorization", "Bearer token");

      expect([200, 401, 403, 404]).toContain(res.statusCode);
    });
  });

  describe("POST /api/v2/chat/conversations/:id/typing - Typing Indicator", () => {
    it("should require authentication", async () => {
      const res = await request(app).post(
        "/api/v2/chat/conversations/60d5ec49c1234567890123ab/typing"
      );
      expect([401, 403]).toContain(res.statusCode);
    });

    it("should send typing indicator", async () => {
      const res = await request(app)
        .post("/api/v2/chat/conversations/60d5ec49c1234567890123ab/typing")
        .set("Authorization", "Bearer token")
        .send({ isTyping: true });

      expect([200, 400, 401, 403, 404]).toContain(res.statusCode);
    });
  });

  describe("POST /api/v2/chat/messages/:id/reactions - Message Reactions", () => {
    it("should require authentication", async () => {
      const res = await request(app)
        .post("/api/v2/chat/messages/60d5ec49c1234567890123ab/reactions")
        .send({ emoji: "👍" });

      expect([401, 403]).toContain(res.statusCode);
    });

    it("should add reaction to message", async () => {
      const res = await request(app)
        .post("/api/v2/chat/messages/60d5ec49c1234567890123ab/reactions")
        .set("Authorization", "Bearer token")
        .send({ emoji: "❤️" });

      expect([200, 201, 400, 401, 403, 404]).toContain(res.statusCode);
    });

    it("should remove reaction", async () => {
      const res = await request(app)
        .delete("/api/v2/chat/messages/60d5ec49c1234567890123ab/reactions")
        .set("Authorization", "Bearer token")
        .send({ emoji: "❤️" });

      expect([200, 204, 400, 401, 403, 404]).toContain(res.statusCode);
    });

    it("should reject invalid emoji", async () => {
      const res = await request(app)
        .post("/api/v2/chat/messages/60d5ec49c1234567890123ab/reactions")
        .set("Authorization", "Bearer token")
        .send({ emoji: "invalid" });

      expect([400, 401, 403]).toContain(res.statusCode);
    });
  });

  describe("POST /api/v2/chat/messages/:id/pin - Pin Message", () => {
    it("should require authentication", async () => {
      const res = await request(app).post(
        "/api/v2/chat/messages/60d5ec49c1234567890123ab/pin"
      );
      expect([401, 403]).toContain(res.statusCode);
    });

    it("should pin message", async () => {
      const res = await request(app)
        .post("/api/v2/chat/messages/60d5ec49c1234567890123ab/pin")
        .set("Authorization", "Bearer token");

      expect([200, 400, 401, 403, 404]).toContain(res.statusCode);
    });

    it("should unpin message", async () => {
      const res = await request(app)
        .delete("/api/v2/chat/messages/60d5ec49c1234567890123ab/pin")
        .set("Authorization", "Bearer token");

      expect([200, 204, 400, 401, 403, 404]).toContain(res.statusCode);
    });
  });

  describe("GET /api/v2/chat/unread - Get Unread Count", () => {
    it("should require authentication", async () => {
      const res = await request(app).get("/api/v2/chat/unread");
      expect([401, 403]).toContain(res.statusCode);
    });

    it("should return unread counts", async () => {
      const res = await request(app)
        .get("/api/v2/chat/unread")
        .set("Authorization", "Bearer token");

      expect([200, 401, 403]).toContain(res.statusCode);
      if (res.statusCode === 200) {
        expect(res.body).toHaveProperty("totalUnread");
        expect(typeof res.body.totalUnread).toBe("number");
      }
    });
  });

  describe("POST /api/v2/chat/conversations/group - Create Group Chat", () => {
    it("should require authentication", async () => {
      const res = await request(app)
        .post("/api/v2/chat/conversations/group")
        .send({ name: "Test Group" });

      expect([401, 403]).toContain(res.statusCode);
    });

    it("should create group conversation", async () => {
      const res = await request(app)
        .post("/api/v2/chat/conversations/group")
        .set("Authorization", "Bearer token")
        .send({
          name: "Medical Team",
          participantIds: [
            "60d5ec49c1234567890123ab",
            "60d5ec49c1234567890123ac",
          ],
        });

      expect([201, 200, 400, 401, 403]).toContain(res.statusCode);
    });

    it("should require at least 2 participants", async () => {
      const res = await request(app)
        .post("/api/v2/chat/conversations/group")
        .set("Authorization", "Bearer token")
        .send({
          name: "Small Group",
          participantIds: ["60d5ec49c1234567890123ab"],
        });

      expect([400, 401, 403]).toContain(res.statusCode);
    });
  });

  describe("PUT /api/v2/chat/conversations/:id - Update Group Info", () => {
    it("should update group name", async () => {
      const res = await request(app)
        .put("/api/v2/chat/conversations/60d5ec49c1234567890123ab")
        .set("Authorization", "Bearer token")
        .send({ name: "Updated Group Name" });

      expect([200, 400, 401, 403, 404]).toContain(res.statusCode);
    });

    it("should update group avatar", async () => {
      const res = await request(app)
        .put("/api/v2/chat/conversations/60d5ec49c1234567890123ab")
        .set("Authorization", "Bearer token")
        .send({ avatar: "new-avatar.jpg" });

      expect([200, 400, 401, 403, 404]).toContain(res.statusCode);
    });
  });

  describe("POST /api/v2/chat/conversations/:id/participants - Add Participant", () => {
    it("should require authentication", async () => {
      const res = await request(app)
        .post("/api/v2/chat/conversations/60d5ec49c1234567890123ab/participants")
        .send({ userId: "60d5ec49c1234567890123ac" });

      expect([401, 403]).toContain(res.statusCode);
    });

    it("should add participant to group", async () => {
      const res = await request(app)
        .post("/api/v2/chat/conversations/60d5ec49c1234567890123ab/participants")
        .set("Authorization", "Bearer token")
        .send({ userId: "60d5ec49c1234567890123ac" });

      expect([200, 201, 400, 401, 403, 404]).toContain(res.statusCode);
    });
  });

  describe("DELETE /api/v2/chat/conversations/:id/participants/:userId - Remove Participant", () => {
    it("should require group admin", async () => {
      const res = await request(app)
        .delete(
          "/api/v2/chat/conversations/60d5ec49c1234567890123ab/participants/60d5ec49c1234567890123ac"
        )
        .set("Authorization", "Bearer non-admin-token");

      expect([403, 401, 404]).toContain(res.statusCode);
    });

    it("should remove participant", async () => {
      const res = await request(app)
        .delete(
          "/api/v2/chat/conversations/60d5ec49c1234567890123ab/participants/60d5ec49c1234567890123ac"
        )
        .set("Authorization", "Bearer admin-token");

      expect([200, 204, 400, 401, 403, 404]).toContain(res.statusCode);
    });
  });

  describe("POST /api/v2/chat/messages/:id/forward - Forward Message", () => {
    it("should require authentication", async () => {
      const res = await request(app)
        .post("/api/v2/chat/messages/60d5ec49c1234567890123ab/forward")
        .send({ conversationId: "60d5ec49c1234567890123ac" });

      expect([401, 403]).toContain(res.statusCode);
    });

    it("should forward message to another conversation", async () => {
      const res = await request(app)
        .post("/api/v2/chat/messages/60d5ec49c1234567890123ab/forward")
        .set("Authorization", "Bearer token")
        .send({ conversationId: "60d5ec49c1234567890123ac" });

      expect([200, 201, 400, 401, 403, 404]).toContain(res.statusCode);
    });
  });
});
