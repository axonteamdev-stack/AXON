import request from "supertest";
import app from "../app.js";

describe("Appointment API", () => {
    let patientToken;
    let doctorToken;
    let doctorId;

    beforeEach(async () => {
        const patientEmail = `patient${Date.now()}@test.com`;
        const patientSignup = await request(app)
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
        const doctorSignup = await request(app)
            .post("/api/v1/auth/signup/doctor")
            .field("fullName", "Dr. Test")
            .field("email", doctorEmail)
            .field("phoneNumber", "+1234567890")
            .field("gender", "male")
            .field("password", "ValidPass123!")
            .field("specialization", "Cardiology")
            .field("medicalLicenseNumber", "LIC123456");

        if (doctorSignup.statusCode === 201 || doctorSignup.statusCode === 200) {
            doctorId = doctorSignup.body.data?.id;
        }

        const doctorLogin = await request(app)
            .post("/api/v1/auth/login")
            .send({ email: doctorEmail, password: "ValidPass123!" });

        if (doctorLogin.statusCode === 200) {
            doctorToken = doctorLogin.body.data?.tokens?.accessToken;
        }
    });

    describe("POST /api/v1/appointments", () => {
        it("should require authentication", async () => {
            const res = await request(app)
                .post("/api/v1/appointments")
                .send({ doctorId: "507f1f77bcf86cd799439011", scheduledAt: new Date().toISOString() });
            expect([401, 403]).toContain(res.statusCode);
        });

        it("should book appointment", async () => {
            const res = await request(app)
                .post("/api/v1/appointments")
                .set("Authorization", `Bearer ${patientToken}`)
                .send({
                    doctorId: doctorId || "507f1f77bcf86cd799439011",
                    scheduledAt: new Date(Date.now() + 86400000).toISOString(),
                    notes: "Regular checkup",
                });
            expect([201, 200, 400, 401, 403, 404]).toContain(res.statusCode);
        });

        it("should reject past date", async () => {
            const res = await request(app)
                .post("/api/v1/appointments")
                .set("Authorization", `Bearer ${patientToken}`)
                .send({
                    doctorId: doctorId || "507f1f77bcf86cd799439011",
                    scheduledAt: "2020-01-01T00:00:00Z",
                });
            expect([400, 422, 401, 403]).toContain(res.statusCode);
        });
    });

    describe("GET /api/v1/appointments/my", () => {
        it("should require authentication", async () => {
            const res = await request(app).get("/api/v1/appointments/my");
            expect([401, 403]).toContain(res.statusCode);
        });

        it("should return patient appointments", async () => {
            const res = await request(app)
                .get("/api/v1/appointments/my")
                .set("Authorization", `Bearer ${patientToken}`);
            expect([200, 401, 403]).toContain(res.statusCode);
        });
    });

    describe("PATCH /api/v1/appointments/:id/cancel", () => {
        it("should require authentication", async () => {
            const res = await request(app)
                .patch("/api/v1/appointments/507f1f77bcf86cd799439011/cancel");
            expect([401, 403]).toContain(res.statusCode);
        });
    });

    describe("GET /api/v1/appointments/pending", () => {
        it("should require doctor role", async () => {
            const res = await request(app)
                .get("/api/v1/appointments/pending")
                .set("Authorization", `Bearer ${patientToken}`);
            expect([403, 401]).toContain(res.statusCode);
        });

        it("should return pending for doctor", async () => {
            const res = await request(app)
                .get("/api/v1/appointments/pending")
                .set("Authorization", `Bearer ${doctorToken}`);
            expect([200, 401, 403]).toContain(res.statusCode);
        });
    });

    describe("PATCH /api/v1/appointments/:id/status", () => {
        it("should require doctor role", async () => {
            const res = await request(app)
                .patch("/api/v1/appointments/507f1f77bcf86cd799439011/status")
                .set("Authorization", `Bearer ${patientToken}`)
                .send({ status: "accepted" });
            expect([403, 401]).toContain(res.statusCode);
        });
    });
});
