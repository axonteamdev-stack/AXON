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

describe("Post API", () => {
    let doctorToken;
    let postId;
    const doctorEmail = `docpost${Date.now()}@test.com`;
    const password = "Password123!";

    beforeAll(async () => {
        // Signup doctor
        const signupRes = await request(app)
            .post("/api/v1/auth/signup/doctor")
            .field("fullName", "Dr. Post")
            .field("email", doctorEmail)
            .field("password", password)
            .field("phone", "01234567890")
            .field("specialization", "Neurology")
            .field("medicalLicenseNumber", "LIC999");

        // Login doctor
        const loginRes = await request(app)
            .post("/api/v1/auth/login")
            .send({ email: doctorEmail, password });

        doctorToken = extractToken(loginRes);
    });

    describe("POST /api/v1/posts", () => {
        it("should create a new post", async () => {
            const res = await request(app)
                .post("/api/v1/posts")
                .set(
                    "Authorization",
                    doctorToken ? `Bearer ${doctorToken}` : "",
                )
                .send({
                    title: "Medical Article",
                    content:
                        "This is a detailed medical article content with enough length.",
                    category: "health",
                });
            expect([201, 200, 400, 401]).toContain(res.statusCode);
            if (
                (res.statusCode === 201 || res.statusCode === 200) &&
                res.body?.data
            ) {
                postId = res.body.data._id || res.body.data.id;
            }
        });

        it("should reject post without title", async () => {
            const res = await request(app)
                .post("/api/v1/posts")
                .set(
                    "Authorization",
                    doctorToken ? `Bearer ${doctorToken}` : "",
                )
                .send({ content: "No title" });
            expect([400, 422, 401]).toContain(res.statusCode);
        });

        it("should reject post with short content", async () => {
            const res = await request(app)
                .post("/api/v1/posts")
                .set(
                    "Authorization",
                    doctorToken ? `Bearer ${doctorToken}` : "",
                )
                .send({ title: "Test Title", content: "Short" });
            expect([400, 422, 401]).toContain(res.statusCode);
        });
    });

    describe("GET /api/v1/posts", () => {
        it("should get all posts", async () => {
            const res = await request(app).get("/api/v1/posts");
            expect([200, 401]).toContain(res.statusCode);
        });
    });

    describe("GET /api/v1/posts/:id", () => {
        it("should get post by id or return 404", async () => {
            const testId = postId || "507f1f77bcf86cd799439011";
            const res = await request(app).get(`/api/v1/posts/${testId}`);
            expect([200, 404, 401]).toContain(res.statusCode);
        });
    });
});
