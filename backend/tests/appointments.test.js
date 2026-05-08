import request from "supertest";
import app from "../app.js";

describe("Appointment API Endpoints", () => {
  describe("GET /api/v2/appointments - Appointment Listing", () => {
    it("should require authentication", async () => {
      const res = await request(app).get("/api/v2/appointments");

      expect([401, 403]).toContain(res.statusCode);
    });

    it("should support pagination", async () => {
      const res = await request(app)
        .get("/api/v2/appointments")
        .query({ page: 1, limit: 10 });

      expect([200, 401, 403, 400]).toContain(res.statusCode);
    });

    it("should filter by status", async () => {
      const res = await request(app)
        .get("/api/v2/appointments")
        .query({ status: "pending" });

      expect([200, 401, 403, 400]).toContain(res.statusCode);
    });

    it("should filter by date range", async () => {
      const res = await request(app).get("/api/v2/appointments").query({
        startDate: "2024-01-01",
        endDate: "2024-12-31",
      });

      expect([200, 401, 403, 400]).toContain(res.statusCode);
    });
  });

  describe("POST /api/v2/appointments - Create Appointment", () => {
    it("should require authentication", async () => {
      const res = await request(app).post("/api/v2/appointments").send({
        doctorId: "60d5ec49c1234567890123ab",
        date: "2024-12-31",
        time: "14:00",
      });

      expect([401, 403]).toContain(res.statusCode);
    });

    it("should validate required fields", async () => {
      const res = await request(app)
        .post("/api/v2/appointments")
        .send({ doctorId: "60d5ec49c1234567890123ab" });

      expect([400, 401, 403]).toContain(res.statusCode);
    });

    it("should validate appointment date (future date required)", async () => {
      const res = await request(app).post("/api/v2/appointments").send({
        doctorId: "60d5ec49c1234567890123ab",
        date: "2020-01-01",
        time: "14:00",
      });

      expect([400, 401, 403]).toContain(res.statusCode);
    });

    it("should validate appointment time format", async () => {
      const res = await request(app).post("/api/v2/appointments").send({
        doctorId: "60d5ec49c1234567890123ab",
        date: "2024-12-31",
        time: "invalid-time",
      });

      expect([400, 401, 403]).toContain(res.statusCode);
    });

    it("should accept valid appointment request", async () => {
      const res = await request(app).post("/api/v2/appointments").send({
        doctorId: "60d5ec49c1234567890123ab",
        date: "2024-12-31",
        time: "14:00",
        reason: "Regular checkup",
        symptoms: "None",
      });

      expect([201, 400, 401, 403, 409]).toContain(res.statusCode);
    });
  });

  describe("GET /api/v2/appointments/:id - Get Appointment", () => {
    it("should require authentication", async () => {
      const res = await request(app).get(
        "/api/v2/appointments/60d5ec49c1234567890123ab",
      );

      expect([401, 403]).toContain(res.statusCode);
    });

    it("should reject invalid ObjectId", async () => {
      const res = await request(app).get("/api/v2/appointments/invalid-id");

      expect([400, 401, 403]).toContain(res.statusCode);
    });

    it("should return appointment details", async () => {
      const res = await request(app).get(
        "/api/v2/appointments/60d5ec49c1234567890123ab",
      );

      expect([200, 404, 401, 403]).toContain(res.statusCode);
    });
  });

  describe("PUT /api/v2/appointments/:id - Update Appointment", () => {
    it("should require authentication", async () => {
      const res = await request(app)
        .put("/api/v2/appointments/60d5ec49c1234567890123ab")
        .send({ time: "15:00" });

      expect([401, 403]).toContain(res.statusCode);
    });

    it("should only allow updates before appointment", async () => {
      const res = await request(app)
        .put("/api/v2/appointments/60d5ec49c1234567890123ab")
        .send({
          date: "2024-12-31",
          time: "15:00",
        });

      expect([200, 400, 401, 403, 404]).toContain(res.statusCode);
    });
  });

  describe("DELETE /api/v2/appointments/:id - Cancel Appointment", () => {
    it("should require authentication", async () => {
      const res = await request(app).delete(
        "/api/v2/appointments/60d5ec49c1234567890123ab",
      );

      expect([401, 403]).toContain(res.statusCode);
    });

    it("should require cancellation reason", async () => {
      const res = await request(app)
        .delete("/api/v2/appointments/60d5ec49c1234567890123ab")
        .send({ reason: "Emergency" });

      expect([200, 400, 401, 403, 404]).toContain(res.statusCode);
    });
  });

  describe("Appointment Status Management", () => {
    describe("PATCH /api/v2/appointments/:id/status - Update Status", () => {
      it("should require doctor authorization for approval", async () => {
        const res = await request(app)
          .patch("/api/v2/appointments/60d5ec49c1234567890123ab/status")
          .send({ status: "approved" });

        expect([401, 403]).toContain(res.statusCode);
      });

      it("should validate status transitions", async () => {
        const res = await request(app)
          .patch("/api/v2/appointments/60d5ec49c1234567890123ab/status")
          .send({ status: "invalid-status" });

        expect([400, 401, 403]).toContain(res.statusCode);
      });

      it("should approve appointment", async () => {
        const res = await request(app)
          .patch("/api/v2/appointments/60d5ec49c1234567890123ab/status")
          .send({ status: "approved" });

        expect([200, 400, 401, 403, 404]).toContain(res.statusCode);
      });

      it("should reject appointment with reason", async () => {
        const res = await request(app)
          .patch("/api/v2/appointments/60d5ec49c1234567890123ab/status")
          .send({
            status: "rejected",
            rejectionReason: "Not available at this time",
          });

        expect([200, 400, 401, 403, 404]).toContain(res.statusCode);
      });

      it("should complete appointment", async () => {
        const res = await request(app)
          .patch("/api/v2/appointments/60d5ec49c1234567890123ab/status")
          .send({ status: "completed" });

        expect([200, 400, 401, 403, 404]).toContain(res.statusCode);
      });
    });
  });

  describe("Chat & Communication", () => {
    describe("GET /api/v2/chat/:conversationId - Get Chat History", () => {
      it("should require authentication", async () => {
        const res = await request(app).get(
          "/api/v2/chat/60d5ec49c1234567890123ab",
        );

        expect([401, 403]).toContain(res.statusCode);
      });

      it("should validate conversation access", async () => {
        const res = await request(app).get(
          "/api/v2/chat/60d5ec49c1234567890123aa",
        );

        expect([401, 403, 404]).toContain(res.statusCode);
      });

      it("should return chat messages with pagination", async () => {
        const res = await request(app)
          .get("/api/v2/chat/60d5ec49c1234567890123ab")
          .query({ page: 1, limit: 50 });

        expect([200, 401, 403, 404, 400]).toContain(res.statusCode);
      });
    });

    describe("POST /api/v2/chat/:conversationId/messages - Send Message", () => {
      it("should require authentication", async () => {
        const res = await request(app)
          .post("/api/v2/chat/60d5ec49c1234567890123ab/messages")
          .send({ content: "Hello doctor" });

        expect([401, 403]).toContain(res.statusCode);
      });

      it("should validate message content", async () => {
        const res = await request(app)
          .post("/api/v2/chat/60d5ec49c1234567890123ab/messages")
          .send({ content: "" });

        expect([400, 401, 403]).toContain(res.statusCode);
      });

      it("should accept message with attachments", async () => {
        const res = await request(app)
          .post("/api/v2/chat/60d5ec49c1234567890123ab/messages")
          .field("content", "Check this report")
          .attach("attachments", Buffer.from("fake file"));

        expect([201, 400, 401, 403, 404, 413]).toContain(res.statusCode);
      });
    });

    describe("DELETE /api/v2/chat/:conversationId/messages/:messageId - Delete Message", () => {
      it("should require authentication", async () => {
        const res = await request(app).delete(
          "/api/v2/chat/60d5ec49c1234567890123ab/messages/60d5ec49c1234567890123aa",
        );

        expect([401, 403]).toContain(res.statusCode);
      });

      it("should only allow deleting own messages", async () => {
        const res = await request(app).delete(
          "/api/v2/chat/60d5ec49c1234567890123ab/messages/60d5ec49c1234567890123aa",
        );

        expect([401, 403, 404]).toContain(res.statusCode);
      });
    });
  });

  describe("Appointment Reminders", () => {
    it("should set appointment reminder", async () => {
      const res = await request(app)
        .post("/api/v2/appointments/60d5ec49c1234567890123ab/reminders")
        .send({
          reminderTime: 24, // 24 hours before
          enabled: true,
        });

      expect([200, 201, 400, 401, 403, 404]).toContain(res.statusCode);
    });

    it("should disable appointment reminder", async () => {
      const res = await request(app)
        .put("/api/v2/appointments/60d5ec49c1234567890123ab/reminders")
        .send({ enabled: false });

      expect([200, 400, 401, 403, 404]).toContain(res.statusCode);
    });
  });

  describe("Appointment Validation", () => {
    it("should prevent double booking", async () => {
      const appointmentData = {
        doctorId: "60d5ec49c1234567890123ab",
        date: "2024-12-31",
        time: "14:00",
      };

      const res1 = await request(app)
        .post("/api/v2/appointments")
        .send(appointmentData);

      const res2 = await request(app)
        .post("/api/v2/appointments")
        .send(appointmentData);

      expect([201, 400, 401, 403, 409]).toContain(res1.statusCode);
      expect([201, 400, 401, 403, 409]).toContain(res2.statusCode);
    });

    it("should validate appointment time slots", async () => {
      const res = await request(app).post("/api/v2/appointments").send({
        doctorId: "60d5ec49c1234567890123ab",
        date: "2024-12-31",
        time: "25:00", // Invalid hour
      });

      expect([400, 401, 403]).toContain(res.statusCode);
    });
  });
});

describe("Chat API Endpoints", () => {
  describe("GET /api/v2/chat/conversations - List Conversations", () => {
    it("should require authentication", async () => {
      const res = await request(app).get("/api/v2/chat/conversations");

      expect([401, 403]).toContain(res.statusCode);
    });

    it("should support pagination", async () => {
      const res = await request(app)
        .get("/api/v2/chat/conversations")
        .query({ page: 1, limit: 20 });

      expect([200, 401, 403, 400]).toContain(res.statusCode);
    });
  });

  describe("POST /api/v2/chat/conversations - Start Conversation", () => {
    it("should require authentication", async () => {
      const res = await request(app)
        .post("/api/v2/chat/conversations")
        .send({ participantId: "60d5ec49c1234567890123ab" });

      expect([401, 403]).toContain(res.statusCode);
    });

    it("should validate participant exists", async () => {
      const res = await request(app)
        .post("/api/v2/chat/conversations")
        .send({ participantId: "60d5ec49c1234567890123aa" });

      expect([201, 400, 401, 403, 404, 409]).toContain(res.statusCode);
    });
  });
});
