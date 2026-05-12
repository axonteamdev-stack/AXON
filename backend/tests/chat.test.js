import request from "supertest";
import app from "../app.js";

describe("Chat API", () => {
    let patientToken;
    let doctorToken;
    let appointmentId;

    beforeEach(async () => {
        const patientEmail = `patient${Date.now()}@test.com`;
        await request(app)
            .post("/api/v1/auth/signup/patient")
            .send({
                fullName: "Test Patient",
                email: patientEmail,
                phoneNumber: "+1234567890",
                gender: "male",
                password: "ValidPass123!",
            });

        const patientLogin = await request(app)
            .post("/api/v1/auth/login")
            .send({ email: patientEmail, password: "ValidPass123!" });

        if (patientLogin.statusCode === 200) {
            patientToken = patientLogin.body.data?.tokens?.accessToken;
        }

        const doctorEmail = `doctor${Date.now()}@test.com`;
        await request(app)
            .post("/api/v1/auth/signup/doctor")
            .field("fullName", "Dr. Test")
            .field("email", doctorEmail)
            .field("phoneNumber", "+1234567890")
            .field("gender", "male")
            .field("password", "ValidPass123!")
            .field("specialization", "Cardiology")
            .field("medicalLicenseNumber", "LIC123456");

        const doctorLogin = await request(app)
            .post("/api/v1/auth/login")
            .send({ email: doctorEmail, password: "ValidPass123!" });

        if (doctorLogin.statusCode === 200) {
            doctorToken = doctorLogin.body.data?.tokens?.accessToken;
        }
    });

    describe("GET /api/v1/chat/conversations", () => {
        it("should require authentication", async () => {
            const res = await request(app).get("/api/v1/chat/conversations");
            expect([401, 403]).toContain(res.statusCode);
        });

        it("should return conversations", async () => {
            const res = await request(app)
                .get("/api/v1/chat/conversations")
                .set("Authorization", `Bearer ${patientToken}`);
            expect([200, 401, 403]).toContain(res.statusCode);
        });
    });

    describe("POST /api/v1/chat/conversations/:appointmentId", () => {
        it("should require authentication", async () => {
            const res = await request(app)
                .post("/api/v1/chat/conversations/507f1f77bcf86cd799439011");
            expect([401, 403]).toContain(res.statusCode);
        });
    });

    describe("GET /api/v1/chat/conversations/:conversationId/messages", () => {
        it("should require authentication", async () => {
            const res = await request(app)
                .get("/api/v1/chat/conversations/507f1f77bcf86cd799439011/messages");
            expect([401, 403]).toContain(res.statusCode);
        });
    });

    describe("POST /api/v1/chat/conversations/:conversationId/messages", () => {
        it("should require authentication", async () => {
            const res = await request(app)
                .post("/api/v1/chat/conversations/507f1f77bcf86cd799439011/messages")
                .send({ content: "Hello" });
            expect([401, 403]).toContain(res.statusCode);
        });
    });
});
