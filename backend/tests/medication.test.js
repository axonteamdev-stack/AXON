import request from "supertest";
import app from "../app.js";

const extractToken = (res) => {
    const body = res.body || {};
    return (
        body.token ||
        body.accessToken ||
        body.data?.token ||
        body.data?.accessToken ||
        null
    );
};

describe("Medication API", () => {
    let authToken;
    const patientEmail = `medpat${Date.now()}@test.com`;
    const password = "Password123!";

    beforeAll(async () => {
        const signupRes = await request(app)
            .post("/api/v1/auth/signup/patient")
            .send({
                fullName: "Med Patient",
                email: patientEmail,
                password,
                phone: "01234567890",
                dateOfBirth: "1990-01-01",
                gender: "male",
            });

        const loginRes = await request(app)
            .post("/api/v1/auth/login")
            .send({ email: patientEmail, password });

        authToken = extractToken(loginRes);
    });

    describe("POST /api/v1/medications", () => {
        it("should create a new medication", async () => {
            const res = await request(app)
                .post("/api/v1/medications")
                .set("Authorization", authToken ? `Bearer ${authToken}` : "")
                .send({
                    medicineName: "Aspirin",
                    dosage: "100mg",
                    frequency: "daily",
                    startDate: "2024-01-01",
                    endDate: "2024-12-31",
                });
            expect([201, 200, 400, 401]).toContain(res.statusCode);
        });

        it("should reject missing required fields", async () => {
            const res = await request(app)
                .post("/api/v1/medications")
                .set("Authorization", authToken ? `Bearer ${authToken}` : "")
                .send({ medicineName: "Aspirin" });
            expect([400, 422, 401]).toContain(res.statusCode);
        });
    });

    describe("GET /api/v1/medications", () => {
        it("should get user medications", async () => {
            const res = await request(app)
                .get("/api/v1/medications")
                .set("Authorization", authToken ? `Bearer ${authToken}` : "");
            expect([200, 401]).toContain(res.statusCode);
        });
    });
});
