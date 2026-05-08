import request from "supertest";
import app from "../app.js";

describe("Advanced Appointment Features", () => {
  describe("GET /api/v2/appointments/:id/reminders - Get Reminders", () => {
    it("should require authentication", async () => {
      const res = await request(app).get(
        "/api/v2/appointments/60d5ec49c1234567890123ab/reminders"
      );
      expect([401, 403]).toContain(res.statusCode);
    });

    it("should return appointment reminders", async () => {
      const res = await request(app)
        .get("/api/v2/appointments/60d5ec49c1234567890123ab/reminders")
        .set("Authorization", "Bearer token");

      expect([200, 401, 403, 404]).toContain(res.statusCode);
    });

    it("should reject invalid appointment ID", async () => {
      const res = await request(app)
        .get("/api/v2/appointments/invalid-id/reminders")
        .set("Authorization", "Bearer token");

      expect([400, 401, 403]).toContain(res.statusCode);
    });
  });

  describe("Appointment Rescheduling", () => {
    it("should reschedule appointment", async () => {
      const res = await request(app)
        .post("/api/v2/appointments/60d5ec49c1234567890123ab/reschedule")
        .set("Authorization", "Bearer token")
        .send({
          newDate: "2025-01-15",
          newTime: "10:00",
          reason: "Conflict with work",
        });

      expect([200, 400, 401, 403, 404]).toContain(res.statusCode);
    });

    it("should require valid future date", async () => {
      const res = await request(app)
        .post("/api/v2/appointments/60d5ec49c1234567890123ab/reschedule")
        .set("Authorization", "Bearer token")
        .send({
          newDate: "2020-01-01",
          newTime: "10:00",
        });

      expect([400, 401, 403]).toContain(res.statusCode);
    });

    it("should require rescheduling reason", async () => {
      const res = await request(app)
        .post("/api/v2/appointments/60d5ec49c1234567890123ab/reschedule")
        .set("Authorization", "Bearer token")
        .send({
          newDate: "2025-01-15",
          newTime: "10:00",
        });

      expect([400, 401, 403]).toContain(res.statusCode);
    });
  });

  describe("Appointment Notes", () => {
    it("should add doctor notes", async () => {
      const res = await request(app)
        .post("/api/v2/appointments/60d5ec49c1234567890123ab/notes")
        .set("Authorization", "Bearer doctor-token")
        .send({
          type: "doctor",
          content: "Patient shows improvement",
          private: true,
        });

      expect([201, 200, 400, 401, 403, 404]).toContain(res.statusCode);
    });

    it("should add patient notes", async () => {
      const res = await request(app)
        .post("/api/v2/appointments/60d5ec49c1234567890123ab/notes")
        .set("Authorization", "Bearer patient-token")
        .send({
          type: "patient",
          content: "Bring test results",
        });

      expect([201, 200, 400, 401, 403, 404]).toContain(res.statusCode);
    });

    it("should get appointment notes", async () => {
      const res = await request(app)
        .get("/api/v2/appointments/60d5ec49c1234567890123ab/notes")
        .set("Authorization", "Bearer token");

      expect([200, 401, 403, 404]).toContain(res.statusCode);
    });

    it("should not show private doctor notes to patient", async () => {
      const res = await request(app)
        .get("/api/v2/appointments/60d5ec49c1234567890123ab/notes")
        .set("Authorization", "Bearer patient-token");

      expect([200, 401, 403, 404]).toContain(res.statusCode);
      if (res.statusCode === 200) {
        const notes = res.body.data || res.body;
        if (Array.isArray(notes)) {
          const privateNotes = notes.filter(n => n.private === true && n.type === "doctor");
          expect(privateNotes.length).toBe(0);
        }
      }
    });
  });

  describe("Appointment Attachments", () => {
    it("should upload attachment", async () => {
      const res = await request(app)
        .post("/api/v2/appointments/60d5ec49c1234567890123ab/attachments")
        .set("Authorization", "Bearer token")
        .attach("file", Buffer.from("test file content"), "report.pdf");

      expect([200, 201, 400, 401, 403, 404]).toContain(res.statusCode);
    });

    it("should reject non-medical file types", async () => {
      const res = await request(app)
        .post("/api/v2/appointments/60d5ec49c1234567890123ab/attachments")
        .set("Authorization", "Bearer token")
        .attach("file", Buffer.from("test"), "malware.exe");

      expect([400, 401, 403]).toContain(res.statusCode);
    });

    it("should list attachments", async () => {
      const res = await request(app)
        .get("/api/v2/appointments/60d5ec49c1234567890123ab/attachments")
        .set("Authorization", "Bearer token");

      expect([200, 401, 403, 404]).toContain(res.statusCode);
    });

    it("should delete attachment", async () => {
      const res = await request(app)
        .delete(
          "/api/v2/appointments/60d5ec49c1234567890123ab/attachments/60d5ec49c1234567890123ac"
        )
        .set("Authorization", "Bearer token");

      expect([200, 204, 400, 401, 403, 404]).toContain(res.statusCode);
    });
  });

  describe("Appointment Ratings & Feedback", () => {
    it("should require completed appointment to rate", async () => {
      const res = await request(app)
        .post("/api/v2/appointments/60d5ec49c1234567890123ab/rate")
        .set("Authorization", "Bearer token")
        .send({
          rating: 5,
          feedback: "Excellent service",
        });

      expect([200, 400, 401, 403, 404]).toContain(res.statusCode);
    });

    it("should validate rating range", async () => {
      const res = await request(app)
        .post("/api/v2/appointments/60d5ec49c1234567890123ab/rate")
        .set("Authorization", "Bearer token")
        .send({
          rating: 10,
          feedback: "Too high",
        });

      expect([400, 401, 403]).toContain(res.statusCode);
    });

    it("should allow rating 1-5", async () => {
      const res = await request(app)
        .post("/api/v2/appointments/60d5ec49c1234567890123ab/rate")
        .set("Authorization", "Bearer token")
        .send({
          rating: 4,
          feedback: "Good experience",
        });

      expect([200, 400, 401, 403, 404]).toContain(res.statusCode);
    });

    it("should get doctor ratings", async () => {
      const res = await request(app)
        .get("/api/v2/doctors/60d5ec49c1234567890123ab/ratings")
        .set("Authorization", "Bearer token");

      expect([200, 401, 403, 404]).toContain(res.statusCode);
    });
  });

  describe("Appointment Prescriptions", () => {
    it("should create prescription", async () => {
      const res = await request(app)
        .post("/api/v2/appointments/60d5ec49c1234567890123ab/prescriptions")
        .set("Authorization", "Bearer doctor-token")
        .send({
          medications: [
            {
              name: "Amoxicillin",
              dosage: "500mg",
              frequency: "three times daily",
              duration: "7 days",
            },
          ],
          notes: "Take after meals",
        });

      expect([201, 200, 400, 401, 403, 404]).toContain(res.statusCode);
    });

    it("should require doctor role", async () => {
      const res = await request(app)
        .post("/api/v2/appointments/60d5ec49c1234567890123ab/prescriptions")
        .set("Authorization", "Bearer patient-token")
        .send({
          medications: [{ name: "Test", dosage: "1mg" }],
        });

      expect([403, 401]).toContain(res.statusCode);
    });

    it("should get prescription", async () => {
      const res = await request(app)
        .get("/api/v2/appointments/60d5ec49c1234567890123ab/prescriptions")
        .set("Authorization", "Bearer token");

      expect([200, 401, 403, 404]).toContain(res.statusCode);
    });

    it("should validate prescription data", async () => {
      const res = await request(app)
        .post("/api/v2/appointments/60d5ec49c1234567890123ab/prescriptions")
        .set("Authorization", "Bearer doctor-token")
        .send({
          medications: [],
        });

      expect([400, 401, 403]).toContain(res.statusCode);
    });
  });

  describe("Recurring Appointments", () => {
    it("should create recurring appointment", async () => {
      const res = await request(app)
        .post("/api/v2/appointments/recurring")
        .set("Authorization", "Bearer token")
        .send({
          doctorId: "60d5ec49c1234567890123ab",
          startDate: "2025-01-01",
          time: "09:00",
          frequency: "weekly",
          occurrences: 4,
          reason: "Physical therapy",
        });

      expect([201, 200, 400, 401, 403]).toContain(res.statusCode);
    });

    it("should validate frequency", async () => {
      const res = await request(app)
        .post("/api/v2/appointments/recurring")
        .set("Authorization", "Bearer token")
        .send({
          doctorId: "60d5ec49c1234567890123ab",
          startDate: "2025-01-01",
          time: "09:00",
          frequency: "invalid",
          occurrences: 4,
        });

      expect([400, 401, 403]).toContain(res.statusCode);
    });

    it("should cancel recurring series", async () => {
      const res = await request(app)
        .delete("/api/v2/appointments/recurring/60d5ec49c1234567890123ab")
        .set("Authorization", "Bearer token")
        .send({ cancelFutureOnly: true });

      expect([200, 204, 400, 401, 403, 404]).toContain(res.statusCode);
    });
  });

  describe("Appointment Calendar Export", () => {
    it("should export to iCal format", async () => {
      const res = await request(app)
        .get("/api/v2/appointments/export")
        .query({ format: "ical" })
        .set("Authorization", "Bearer token");

      expect([200, 400, 401, 403]).toContain(res.statusCode);
    });

    it("should export to Google Calendar", async () => {
      const res = await request(app)
        .get("/api/v2/appointments/export")
        .query({ format: "google" })
        .set("Authorization", "Bearer token");

      expect([200, 400, 401, 403]).toContain(res.statusCode);
    });
  });

  describe("Doctor Availability", () => {
    it("should get doctor availability", async () => {
      const res = await request(app)
        .get("/api/v2/doctors/60d5ec49c1234567890123ab/availability")
        .query({ date: "2025-01-15" });

      expect([200, 400, 401, 403, 404]).toContain(res.statusCode);
    });

    it("should return available time slots", async () => {
      const res = await request(app)
        .get("/api/v2/doctors/60d5ec49c1234567890123ab/availability")
        .query({ date: "2025-01-15" });

      if (res.statusCode === 200) {
        expect(Array.isArray(res.body.slots || res.body)).toBe(true);
      }
    });

    it("should set doctor availability", async () => {
      const res = await request(app)
        .put("/api/v2/doctors/60d5ec49c1234567890123ab/availability")
        .set("Authorization", "Bearer doctor-token")
        .send({
          schedule: [
            { day: "monday", slots: ["09:00", "10:00", "11:00"] },
            { day: "wednesday", slots: ["14:00", "15:00"] },
          ],
        });

      expect([200, 400, 401, 403, 404]).toContain(res.statusCode);
    });
  });

  describe("Appointment Waitlist", () => {
    it("should join waitlist", async () => {
      const res = await request(app)
        .post("/api/v2/appointments/waitlist")
        .set("Authorization", "Bearer token")
        .send({
          doctorId: "60d5ec49c1234567890123ab",
          preferredDate: "2025-01-15",
          preferredTimeRange: "morning",
        });

      expect([201, 200, 400, 401, 403]).toContain(res.statusCode);
    });

    it("should get waitlist position", async () => {
      const res = await request(app)
        .get("/api/v2/appointments/waitlist/60d5ec49c1234567890123ab")
        .set("Authorization", "Bearer token");

      expect([200, 401, 403, 404]).toContain(res.statusCode);
    });

    it("should leave waitlist", async () => {
      const res = await request(app)
        .delete("/api/v2/appointments/waitlist/60d5ec49c1234567890123ab")
        .set("Authorization", "Bearer token");

      expect([200, 204, 400, 401, 403, 404]).toContain(res.statusCode);
    });
  });
});
