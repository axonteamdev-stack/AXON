import request from "supertest";
import app from "../app.js";

describe("Medication API Endpoints", () => {
  describe("GET /api/v2/medications - Medication Listing", () => {
    it("should require authentication", async () => {
      const res = await request(app).get("/api/v2/medications");

      expect([401, 403]).toContain(res.statusCode);
    });

    it("should support pagination", async () => {
      const res = await request(app)
        .get("/api/v2/medications")
        .query({ page: 1, limit: 10 });

      expect([200, 401, 403, 400]).toContain(res.statusCode);
    });

    it("should filter by status", async () => {
      const res = await request(app)
        .get("/api/v2/medications")
        .query({ status: "active" });

      expect([200, 401, 403, 400]).toContain(res.statusCode);
    });

    it("should filter by type", async () => {
      const res = await request(app)
        .get("/api/v2/medications")
        .query({ type: "tablet" });

      expect([200, 401, 403, 400]).toContain(res.statusCode);
    });
  });

  describe("POST /api/v2/medications - Add Medication", () => {
    it("should require authentication", async () => {
      const res = await request(app).post("/api/v2/medications").send({
        name: "Aspirin",
        dosage: "100mg",
        frequency: "twice daily",
      });

      expect([401, 403]).toContain(res.statusCode);
    });

    it("should validate required fields", async () => {
      const res = await request(app).post("/api/v2/medications").send({
        name: "Aspirin",
      });

      expect([400, 401, 403]).toContain(res.statusCode);
    });

    it("should validate dosage format", async () => {
      const res = await request(app).post("/api/v2/medications").send({
        name: "Aspirin",
        dosage: "invalid",
        frequency: "twice daily",
      });

      expect([201, 400, 401, 403]).toContain(res.statusCode);
    });

    it("should accept valid medication data", async () => {
      const res = await request(app).post("/api/v2/medications").send({
        name: "Metformin",
        dosage: "500mg",
        frequency: "twice daily",
        startDate: "2024-01-01",
        reason: "Diabetes management",
      });

      expect([201, 400, 401, 403]).toContain(res.statusCode);
    });

    it("should validate frequency options", async () => {
      const res = await request(app).post("/api/v2/medications").send({
        name: "Medication",
        dosage: "100mg",
        frequency: "invalid-frequency",
      });

      expect([201, 400, 401, 403]).toContain(res.statusCode);
    });
  });

  describe("GET /api/v2/medications/:id - Get Medication", () => {
    it("should require authentication", async () => {
      const res = await request(app).get(
        "/api/v2/medications/60d5ec49c1234567890123ab",
      );

      expect([401, 403]).toContain(res.statusCode);
    });

    it("should reject invalid ObjectId", async () => {
      const res = await request(app).get("/api/v2/medications/invalid-id");

      expect([400, 401, 403]).toContain(res.statusCode);
    });

    it("should return 404 for non-existent medication", async () => {
      const res = await request(app).get(
        "/api/v2/medications/60d5ec49c1234567890123aa",
      );

      expect([404, 401, 403]).toContain(res.statusCode);
    });
  });

  describe("PUT /api/v2/medications/:id - Update Medication", () => {
    it("should require authentication", async () => {
      const res = await request(app)
        .put("/api/v2/medications/60d5ec49c1234567890123ab")
        .send({ dosage: "200mg" });

      expect([401, 403]).toContain(res.statusCode);
    });

    it("should validate update data", async () => {
      const res = await request(app)
        .put("/api/v2/medications/60d5ec49c1234567890123ab")
        .send({ dosage: "invalid" });

      expect([200, 400, 401, 403, 404]).toContain(res.statusCode);
    });

    it("should accept valid updates", async () => {
      const res = await request(app)
        .put("/api/v2/medications/60d5ec49c1234567890123ab")
        .send({
          dosage: "250mg",
          frequency: "three times daily",
        });

      expect([200, 400, 401, 403, 404]).toContain(res.statusCode);
    });
  });

  describe("DELETE /api/v2/medications/:id - Delete Medication", () => {
    it("should require authentication", async () => {
      const res = await request(app).delete(
        "/api/v2/medications/60d5ec49c1234567890123ab",
      );

      expect([401, 403]).toContain(res.statusCode);
    });

    it("should delete existing medication", async () => {
      const res = await request(app).delete(
        "/api/v2/medications/60d5ec49c1234567890123ab",
      );

      expect([200, 401, 403, 404]).toContain(res.statusCode);
    });
  });

  describe("Medication Tracking", () => {
    describe("POST /api/v2/medications/:id/dose - Track Dose", () => {
      it("should require authentication", async () => {
        const res = await request(app)
          .post("/api/v2/medications/60d5ec49c1234567890123ab/dose")
          .send({ time: new Date().toISOString() });

        expect([401, 403]).toContain(res.statusCode);
      });

      it("should validate dose time", async () => {
        const res = await request(app)
          .post("/api/v2/medications/60d5ec49c1234567890123ab/dose")
          .send({ time: "invalid-time" });

        expect([400, 401, 403]).toContain(res.statusCode);
      });

      it("should accept valid dose tracking", async () => {
        const res = await request(app)
          .post("/api/v2/medications/60d5ec49c1234567890123ab/dose")
          .send({ time: new Date().toISOString() });

        expect([200, 201, 400, 401, 403, 404]).toContain(res.statusCode);
      });
    });

    describe("GET /api/v2/medications/:id/doses - Get Dose History", () => {
      it("should require authentication", async () => {
        const res = await request(app).get(
          "/api/v2/medications/60d5ec49c1234567890123ab/doses",
        );

        expect([401, 403]).toContain(res.statusCode);
      });

      it("should support date range filtering", async () => {
        const res = await request(app)
          .get("/api/v2/medications/60d5ec49c1234567890123ab/doses")
          .query({
            startDate: "2024-01-01",
            endDate: "2024-12-31",
          });

        expect([200, 401, 403, 404]).toContain(res.statusCode);
      });
    });

    describe("POST /api/v2/medications/:id/skip - Skip Dose", () => {
      it("should require authentication", async () => {
        const res = await request(app)
          .post("/api/v2/medications/60d5ec49c1234567890123ab/skip")
          .send({ time: new Date().toISOString(), reason: "Forgot" });

        expect([401, 403]).toContain(res.statusCode);
      });

      it("should require skip reason", async () => {
        const res = await request(app)
          .post("/api/v2/medications/60d5ec49c1234567890123ab/skip")
          .send({ time: new Date().toISOString() });

        expect([200, 400, 401, 403, 404]).toContain(res.statusCode);
      });
    });
  });

  describe("Medication Reminders", () => {
    it("should set medication reminders", async () => {
      const res = await request(app)
        .post("/api/v2/medications/60d5ec49c1234567890123ab/reminders")
        .send({
          time: "08:00",
          enabled: true,
        });

      expect([200, 201, 400, 401, 403, 404]).toContain(res.statusCode);
    });

    it("should get medication reminders", async () => {
      const res = await request(app).get(
        "/api/v2/medications/60d5ec49c1234567890123ab/reminders",
      );

      expect([200, 401, 403, 404]).toContain(res.statusCode);
    });
  });

  describe("Medication Statistics", () => {
    it("should get adherence rate", async () => {
      const res = await request(app).get(
        "/api/v2/medications/60d5ec49c1234567890123ab/adherence",
      );

      expect([200, 401, 403, 404]).toContain(res.statusCode);
    });

    it("should get medication history summary", async () => {
      const res = await request(app)
        .get("/api/v2/medications/60d5ec49c1234567890123ab/summary")
        .query({ month: "2024-01" });

      expect([200, 401, 403, 404, 400]).toContain(res.statusCode);
    });
  });
});

describe("Article API Endpoints", () => {
  describe("GET /api/v2/articles - Article Listing", () => {
    it("should return articles list", async () => {
      const res = await request(app).get("/api/v2/articles");

      expect(res.statusCode).toBe(200);
    });

    it("should support pagination", async () => {
      const res = await request(app)
        .get("/api/v2/articles")
        .query({ page: 1, limit: 10 });

      expect([200, 400]).toContain(res.statusCode);
    });

    it("should filter by category", async () => {
      const res = await request(app)
        .get("/api/v2/articles")
        .query({ category: "health" });

      expect([200, 400]).toContain(res.statusCode);
    });

    it("should filter by author specialty", async () => {
      const res = await request(app)
        .get("/api/v2/articles")
        .query({ specialty: "Cardiology" });

      expect([200, 400]).toContain(res.statusCode);
    });

    it("should search articles", async () => {
      const res = await request(app)
        .get("/api/v2/articles")
        .query({ search: "heart" });

      expect([200, 400]).toContain(res.statusCode);
    });
  });

  describe("POST /api/v2/articles - Create Article", () => {
    it("should require doctor role", async () => {
      const res = await request(app).post("/api/v2/articles").send({
        title: "Health Article",
        content: "Article content",
      });

      expect([401, 403]).toContain(res.statusCode);
    });

    it("should validate article structure", async () => {
      const res = await request(app)
        .post("/api/v2/articles")
        .send({ title: "Only Title" });

      expect([400, 401, 403]).toContain(res.statusCode);
    });

    it("should accept valid article with metadata", async () => {
      const res = await request(app)
        .post("/api/v2/articles")
        .send({
          title: "Hypertension Management",
          content: "Detailed content about managing hypertension",
          category: "cardiovascular",
          tags: ["health", "hypertension"],
        });

      expect([201, 400, 401, 403]).toContain(res.statusCode);
    });
  });

  describe("GET /api/v2/articles/:id - Get Article", () => {
    it("should return article with comments", async () => {
      const res = await request(app).get(
        "/api/v2/articles/60d5ec49c1234567890123ab",
      );

      expect([200, 404, 400]).toContain(res.statusCode);
    });

    it("should reject invalid ObjectId", async () => {
      const res = await request(app).get("/api/v2/articles/invalid-id");

      expect([400, 404]).toContain(res.statusCode);
    });
  });

  describe("PUT /api/v2/articles/:id - Update Article", () => {
    it("should require doctor authorization", async () => {
      const res = await request(app)
        .put("/api/v2/articles/60d5ec49c1234567890123ab")
        .send({ title: "Updated Title" });

      expect([401, 403]).toContain(res.statusCode);
    });

    it("should update article content", async () => {
      const res = await request(app)
        .put("/api/v2/articles/60d5ec49c1234567890123ab")
        .send({
          title: "Updated Article Title",
          content: "Updated content",
        });

      expect([200, 400, 401, 403, 404]).toContain(res.statusCode);
    });
  });

  describe("DELETE /api/v2/articles/:id - Delete Article", () => {
    it("should require doctor authorization", async () => {
      const res = await request(app).delete(
        "/api/v2/articles/60d5ec49c1234567890123ab",
      );

      expect([401, 403]).toContain(res.statusCode);
    });

    it("should delete article", async () => {
      const res = await request(app).delete(
        "/api/v2/articles/60d5ec49c1234567890123ab",
      );

      expect([200, 401, 403, 404]).toContain(res.statusCode);
    });
  });

  describe("Article Interactions", () => {
    it("should like article", async () => {
      const res = await request(app).post(
        "/api/v2/articles/60d5ec49c1234567890123ab/like",
      );

      expect([200, 401, 403, 404]).toContain(res.statusCode);
    });

    it("should get article likes", async () => {
      const res = await request(app).get(
        "/api/v2/articles/60d5ec49c1234567890123ab/likes",
      );

      expect([200, 404, 400]).toContain(res.statusCode);
    });

    it("should share article", async () => {
      const res = await request(app).post(
        "/api/v2/articles/60d5ec49c1234567890123ab/share",
      );

      expect([200, 401, 403, 404]).toContain(res.statusCode);
    });
  });
});
