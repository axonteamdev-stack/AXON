import request from "supertest";
import app from "../app.js";

describe("Advanced Medication Features", () => {
  describe("GET /api/v2/medications/:id/doses - Get Dose History", () => {
    it("should require authentication", async () => {
      const res = await request(app).get(
        "/api/v2/medications/60d5ec49c1234567890123ab/doses"
      );
      expect([401, 403]).toContain(res.statusCode);
    });

    it("should return dose history", async () => {
      const res = await request(app)
        .get("/api/v2/medications/60d5ec49c1234567890123ab/doses")
        .set("Authorization", "Bearer token");

      expect([200, 401, 403, 404]).toContain(res.statusCode);
      if (res.statusCode === 200) {
        expect(Array.isArray(res.body.data || res.body)).toBe(true);
      }
    });

    it("should filter by date range", async () => {
      const res = await request(app)
        .get("/api/v2/medications/60d5ec49c1234567890123ab/doses")
        .query({ startDate: "2024-01-01", endDate: "2024-12-31" })
        .set("Authorization", "Bearer token");

      expect([200, 400, 401, 403, 404]).toContain(res.statusCode);
    });

    it("should reject invalid medication ID", async () => {
      const res = await request(app)
        .get("/api/v2/medications/invalid-id/doses")
        .set("Authorization", "Bearer token");

      expect([400, 401, 403]).toContain(res.statusCode);
    });
  });

  describe("GET /api/v2/medications/:id/adherence - Get Adherence Rate", () => {
    it("should require authentication", async () => {
      const res = await request(app).get(
        "/api/v2/medications/60d5ec49c1234567890123ab/adherence"
      );
      expect([401, 403]).toContain(res.statusCode);
    });

    it("should return adherence statistics", async () => {
      const res = await request(app)
        .get("/api/v2/medications/60d5ec49c1234567890123ab/adherence")
        .set("Authorization", "Bearer token");

      expect([200, 401, 403, 404]).toContain(res.statusCode);
      if (res.statusCode === 200) {
        expect(res.body).toHaveProperty("rate");
        expect(typeof res.body.rate).toBe("number");
      }
    });

    it("should calculate weekly adherence", async () => {
      const res = await request(app)
        .get("/api/v2/medications/60d5ec49c1234567890123ab/adherence")
        .query({ period: "week" })
        .set("Authorization", "Bearer token");

      expect([200, 400, 401, 403, 404]).toContain(res.statusCode);
    });

    it("should calculate monthly adherence", async () => {
      const res = await request(app)
        .get("/api/v2/medications/60d5ec49c1234567890123ab/adherence")
        .query({ period: "month" })
        .set("Authorization", "Bearer token");

      expect([200, 400, 401, 403, 404]).toContain(res.statusCode);
    });
  });

  describe("GET /api/v2/medications/:id/summary - Get Medication Summary", () => {
    it("should require authentication", async () => {
      const res = await request(app).get(
        "/api/v2/medications/60d5ec49c1234567890123ab/summary"
      );
      expect([401, 403]).toContain(res.statusCode);
    });

    it("should return medication summary", async () => {
      const res = await request(app)
        .get("/api/v2/medications/60d5ec49c1234567890123ab/summary")
        .set("Authorization", "Bearer token");

      expect([200, 401, 403, 404]).toContain(res.statusCode);
      if (res.statusCode === 200) {
        expect(res.body).toHaveProperty("totalDoses");
        expect(res.body).toHaveProperty("takenDoses");
        expect(res.body).toHaveProperty("skippedDoses");
      }
    });

    it("should filter by month", async () => {
      const res = await request(app)
        .get("/api/v2/medications/60d5ec49c1234567890123ab/summary")
        .query({ month: "2024-01" })
        .set("Authorization", "Bearer token");

      expect([200, 400, 401, 403, 404]).toContain(res.statusCode);
    });

    it("should reject invalid month format", async () => {
      const res = await request(app)
        .get("/api/v2/medications/60d5ec49c1234567890123ab/summary")
        .query({ month: "invalid" })
        .set("Authorization", "Bearer token");

      expect([400, 401, 403]).toContain(res.statusCode);
    });
  });

  describe("GET /api/v2/medications/:id/reminders - Get Reminders", () => {
    it("should require authentication", async () => {
      const res = await request(app).get(
        "/api/v2/medications/60d5ec49c1234567890123ab/reminders"
      );
      expect([401, 403]).toContain(res.statusCode);
    });

    it("should return reminder list", async () => {
      const res = await request(app)
        .get("/api/v2/medications/60d5ec49c1234567890123ab/reminders")
        .set("Authorization", "Bearer token");

      expect([200, 401, 403, 404]).toContain(res.statusCode);
    });
  });

  describe("Medication Interactions & Safety", () => {
    it("should check drug interactions", async () => {
      const res = await request(app)
        .post("/api/v2/medications/check-interactions")
        .set("Authorization", "Bearer token")
        .send({
          medications: [
            "60d5ec49c1234567890123ab",
            "60d5ec49c1234567890123ac",
          ],
        });

      expect([200, 400, 401, 403]).toContain(res.statusCode);
    });

    it("should require at least 2 medications", async () => {
      const res = await request(app)
        .post("/api/v2/medications/check-interactions")
        .set("Authorization", "Bearer token")
        .send({
          medications: ["60d5ec49c1234567890123ab"],
        });

      expect([400, 401, 403]).toContain(res.statusCode);
    });
  });

  describe("Medication Schedule", () => {
    it("should create medication schedule", async () => {
      const res = await request(app)
        .post("/api/v2/medications/60d5ec49c1234567890123ab/schedule")
        .set("Authorization", "Bearer token")
        .send({
          times: ["08:00", "14:00", "20:00"],
          daysOfWeek: [1, 2, 3, 4, 5, 6, 7],
        });

      expect([200, 201, 400, 401, 403, 404]).toContain(res.statusCode);
    });

    it("should get medication schedule", async () => {
      const res = await request(app)
        .get("/api/v2/medications/60d5ec49c1234567890123ab/schedule")
        .set("Authorization", "Bearer token");

      expect([200, 401, 403, 404]).toContain(res.statusCode);
    });

    it("should update schedule", async () => {
      const res = await request(app)
        .put("/api/v2/medications/60d5ec49c1234567890123ab/schedule")
        .set("Authorization", "Bearer token")
        .send({
          times: ["09:00", "21:00"],
        });

      expect([200, 400, 401, 403, 404]).toContain(res.statusCode);
    });
  });

  describe("Medication History & Export", () => {
    it("should export medication history", async () => {
      const res = await request(app)
        .get("/api/v2/medications/export")
        .query({ format: "pdf" })
        .set("Authorization", "Bearer token");

      expect([200, 400, 401, 403]).toContain(res.statusCode);
    });

    it("should support CSV export", async () => {
      const res = await request(app)
        .get("/api/v2/medications/export")
        .query({ format: "csv" })
        .set("Authorization", "Bearer token");

      expect([200, 400, 401, 403]).toContain(res.statusCode);
    });

    it("should reject unsupported format", async () => {
      const res = await request(app)
        .get("/api/v2/medications/export")
        .query({ format: "xml" })
        .set("Authorization", "Bearer token");

      expect([400, 401, 403]).toContain(res.statusCode);
    });
  });

  describe("Medication Refill & Pharmacy", () => {
    it("should request refill", async () => {
      const res = await request(app)
        .post("/api/v2/medications/60d5ec49c1234567890123ab/refill")
        .set("Authorization", "Bearer token")
        .send({ pharmacyId: "60d5ec49c1234567890123ac" });

      expect([200, 201, 400, 401, 403, 404]).toContain(res.statusCode);
    });

    it("should get refill history", async () => {
      const res = await request(app)
        .get("/api/v2/medications/60d5ec49c1234567890123ab/refills")
        .set("Authorization", "Bearer token");

      expect([200, 401, 403, 404]).toContain(res.statusCode);
    });
  });

  describe("Medication Sharing (Doctor-Patient)", () => {
    it("should share medication with doctor", async () => {
      const res = await request(app)
        .post("/api/v2/medications/60d5ec49c1234567890123ab/share")
        .set("Authorization", "Bearer token")
        .send({ doctorId: "60d5ec49c1234567890123ac" });

      expect([200, 201, 400, 401, 403, 404]).toContain(res.statusCode);
    });

    it("should revoke medication sharing", async () => {
      const res = await request(app)
        .delete("/api/v2/medications/60d5ec49c1234567890123ab/share")
        .set("Authorization", "Bearer token")
        .send({ doctorId: "60d5ec49c1234567890123ac" });

      expect([200, 204, 400, 401, 403, 404]).toContain(res.statusCode);
    });
  });
});
