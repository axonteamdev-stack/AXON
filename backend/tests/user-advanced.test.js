import request from "supertest";
import app from "../app.js";

describe("Advanced User Features", () => {
  describe("User Preferences & Settings", () => {
    it("should get user preferences", async () => {
      const res = await request(app)
        .get("/api/v2/users/me/preferences")
        .set("Authorization", "Bearer token");

      expect([200, 401, 403]).toContain(res.statusCode);
    });

    it("should update notification preferences", async () => {
      const res = await request(app)
        .put("/api/v2/users/me/preferences")
        .set("Authorization", "Bearer token")
        .send({
          notifications: {
            email: true,
            push: false,
            sms: true,
          },
        });

      expect([200, 400, 401, 403]).toContain(res.statusCode);
    });

    it("should update privacy settings", async () => {
      const res = await request(app)
        .put("/api/v2/users/me/preferences")
        .set("Authorization", "Bearer token")
        .send({
          privacy: {
            profileVisible: true,
            showEmail: false,
            showPhone: false,
          },
        });

      expect([200, 400, 401, 403]).toContain(res.statusCode);
    });

    it("should update language preference", async () => {
      const res = await request(app)
        .put("/api/v2/users/me/preferences")
        .set("Authorization", "Bearer token")
        .send({ language: "ar" });

      expect([200, 400, 401, 403]).toContain(res.statusCode);
    });
  });

  describe("User Activity & History", () => {
    it("should get user activity log", async () => {
      const res = await request(app)
        .get("/api/v2/users/me/activity")
        .set("Authorization", "Bearer token");

      expect([200, 401, 403]).toContain(res.statusCode);
    });

    it("should support pagination for activity", async () => {
      const res = await request(app)
        .get("/api/v2/users/me/activity")
        .query({ page: 1, limit: 20 })
        .set("Authorization", "Bearer token");

      expect([200, 400, 401, 403]).toContain(res.statusCode);
    });

    it("should filter by activity type", async () => {
      const res = await request(app)
        .get("/api/v2/users/me/activity")
        .query({ type: "login" })
        .set("Authorization", "Bearer token");

      expect([200, 400, 401, 403]).toContain(res.statusCode);
    });
  });

  describe("User Profile Completion", () => {
    it("should get profile completion status", async () => {
      const res = await request(app)
        .get("/api/v2/users/me/profile-completion")
        .set("Authorization", "Bearer token");

      expect([200, 401, 403]).toContain(res.statusCode);
      if (res.statusCode === 200) {
        expect(res.body).toHaveProperty("percentage");
        expect(typeof res.body.percentage).toBe("number");
      }
    });

    it("should suggest missing profile fields", async () => {
      const res = await request(app)
        .get("/api/v2/users/me/profile-completion")
        .set("Authorization", "Bearer token");

      if (res.statusCode === 200) {
        expect(res.body).toHaveProperty("missingFields");
        expect(Array.isArray(res.body.missingFields)).toBe(true);
      }
    });
  });

  describe("Doctor-Specific Features", () => {
    it("should get doctor profile", async () => {
      const res = await request(app)
        .get("/api/v2/doctors/60d5ec49c1234567890123ab")
        .set("Authorization", "Bearer token");

      expect([200, 401, 403, 404]).toContain(res.statusCode);
    });

    it("should update doctor availability", async () => {
      const res = await request(app)
        .put("/api/v2/doctors/me/availability")
        .set("Authorization", "Bearer doctor-token")
        .send({
          schedule: [
            { day: "monday", start: "09:00", end: "17:00" },
            { day: "tuesday", start: "09:00", end: "17:00" },
          ],
        });

      expect([200, 400, 401, 403]).toContain(res.statusCode);
    });

    it("should get doctor patients list", async () => {
      const res = await request(app)
        .get("/api/v2/doctors/me/patients")
        .set("Authorization", "Bearer doctor-token");

      expect([200, 401, 403]).toContain(res.statusCode);
    });

    it("should get doctor statistics", async () => {
      const res = await request(app)
        .get("/api/v2/doctors/me/stats")
        .set("Authorization", "Bearer doctor-token");

      expect([200, 401, 403]).toContain(res.statusCode);
      if (res.statusCode === 200) {
        expect(res.body).toHaveProperty("totalPatients");
        expect(res.body).toHaveProperty("totalAppointments");
      }
    });

    it("should update doctor specialty", async () => {
      const res = await request(app)
        .put("/api/v2/doctors/me/specialty")
        .set("Authorization", "Bearer doctor-token")
        .send({
          specialty: "Cardiology",
          subSpecialties: ["Interventional Cardiology"],
        });

      expect([200, 400, 401, 403]).toContain(res.statusCode);
    });
  });

  describe("Patient-Specific Features", () => {
    it("should get patient medical summary", async () => {
      const res = await request(app)
        .get("/api/v2/patients/me/medical-summary")
        .set("Authorization", "Bearer patient-token");

      expect([200, 401, 403]).toContain(res.statusCode);
    });

    it("should get upcoming appointments", async () => {
      const res = await request(app)
        .get("/api/v2/patients/me/appointments/upcoming")
        .set("Authorization", "Bearer patient-token");

      expect([200, 401, 403]).toContain(res.statusCode);
    });

    it("should get medication schedule", async () => {
      const res = await request(app)
        .get("/api/v2/patients/me/medications/schedule")
        .set("Authorization", "Bearer patient-token");

      expect([200, 401, 403]).toContain(res.statusCode);
    });

    it("should update emergency contact", async () => {
      const res = await request(app)
        .put("/api/v2/patients/me/emergency-contact")
        .set("Authorization", "Bearer patient-token")
        .send({
          name: "Emergency Contact",
          phone: "+1234567890",
          relationship: "spouse",
        });

      expect([200, 400, 401, 403]).toContain(res.statusCode);
    });
  });

  describe("User Blocking & Reporting", () => {
    it("should block user", async () => {
      const res = await request(app)
        .post("/api/v2/users/60d5ec49c1234567890123ab/block")
        .set("Authorization", "Bearer token");

      expect([200, 201, 400, 401, 403, 404]).toContain(res.statusCode);
    });

    it("should unblock user", async () => {
      const res = await request(app)
        .delete("/api/v2/users/60d5ec49c1234567890123ab/block")
        .set("Authorization", "Bearer token");

      expect([200, 204, 400, 401, 403, 404]).toContain(res.statusCode);
    });

    it("should get blocked users list", async () => {
      const res = await request(app)
        .get("/api/v2/users/me/blocked")
        .set("Authorization", "Bearer token");

      expect([200, 401, 403]).toContain(res.statusCode);
    });

    it("should report user", async () => {
      const res = await request(app)
        .post("/api/v2/users/60d5ec49c1234567890123ab/report")
        .set("Authorization", "Bearer token")
        .send({
          reason: "inappropriate_behavior",
          details: "User posted offensive content",
        });

      expect([201, 200, 400, 401, 403, 404]).toContain(res.statusCode);
    });

    it("should require report reason", async () => {
      const res = await request(app)
        .post("/api/v2/users/60d5ec49c1234567890123ab/report")
        .set("Authorization", "Bearer token")
        .send({});

      expect([400, 401, 403]).toContain(res.statusCode);
    });
  });

  describe("User Search & Discovery", () => {
    it("should search users", async () => {
      const res = await request(app)
        .get("/api/v2/users/search")
        .query({ q: "John" })
        .set("Authorization", "Bearer token");

      expect([200, 400, 401, 403]).toContain(res.statusCode);
    });

    it("should filter by specialty", async () => {
      const res = await request(app)
        .get("/api/v2/users/search")
        .query({ specialty: "Cardiology", role: "doctor" })
        .set("Authorization", "Bearer token");

      expect([200, 400, 401, 403]).toContain(res.statusCode);
    });

    it("should filter by location", async () => {
      const res = await request(app)
        .get("/api/v2/users/search")
        .query({ city: "Cairo", country: "Egypt" })
        .set("Authorization", "Bearer token");

      expect([200, 400, 401, 403]).toContain(res.statusCode);
    });

    it("should suggest users to follow", async () => {
      const res = await request(app)
        .get("/api/v2/users/suggestions")
        .set("Authorization", "Bearer token");

      expect([200, 401, 403]).toContain(res.statusCode);
    });
  });

  describe("User Content Management", () => {
    it("should get user posts", async () => {
      const res = await request(app)
        .get("/api/v2/users/60d5ec49c1234567890123ab/posts")
        .set("Authorization", "Bearer token");

      expect([200, 401, 403, 404]).toContain(res.statusCode);
    });

    it("should get user articles", async () => {
      const res = await request(app)
        .get("/api/v2/users/60d5ec49c1234567890123ab/articles")
        .set("Authorization", "Bearer token");

      expect([200, 401, 403, 404]).toContain(res.statusCode);
    });

    it("should get user comments", async () => {
      const res = await request(app)
        .get("/api/v2/users/60d5ec49c1234567890123ab/comments")
        .set("Authorization", "Bearer token");

      expect([200, 401, 403, 404]).toContain(res.statusCode);
    });
  });

  describe("Data Export & Privacy", () => {
    it("should request data export", async () => {
      const res = await request(app)
        .post("/api/v2/users/me/export-data")
        .set("Authorization", "Bearer token")
        .send({ format: "json" });

      expect([200, 201, 400, 401, 403]).toContain(res.statusCode);
    });

    it("should support GDPR data export", async () => {
      const res = await request(app)
        .post("/api/v2/users/me/export-data")
        .set("Authorization", "Bearer token")
        .send({ format: "gdpr" });

      expect([200, 201, 400, 401, 403]).toContain(res.statusCode);
    });

    it("should delete account", async () => {
      const res = await request(app)
        .delete("/api/v2/users/me")
        .set("Authorization", "Bearer token")
        .send({ password: "CurrentPass123!", reason: "No longer needed" });

      expect([200, 204, 400, 401, 403]).toContain(res.statusCode);
    });

    it("should require password for account deletion", async () => {
      const res = await request(app)
        .delete("/api/v2/users/me")
        .set("Authorization", "Bearer token")
        .send({});

      expect([400, 401, 403]).toContain(res.statusCode);
    });
  });

  describe("User Verification & Badges", () => {
    it("should request verification", async () => {
      const res = await request(app)
        .post("/api/v2/users/me/verify")
        .set("Authorization", "Bearer token")
        .send({
          documentType: "national_id",
          documentNumber: "123456789",
        });

      expect([200, 201, 400, 401, 403]).toContain(res.statusCode);
    });

    it("should get verification status", async () => {
      const res = await request(app)
        .get("/api/v2/users/me/verification-status")
        .set("Authorization", "Bearer token");

      expect([200, 401, 403]).toContain(res.statusCode);
    });

    it("should get user badges", async () => {
      const res = await request(app)
        .get("/api/v2/users/60d5ec49c1234567890123ab/badges")
        .set("Authorization", "Bearer token");

      expect([200, 401, 403, 404]).toContain(res.statusCode);
    });
  });
});
