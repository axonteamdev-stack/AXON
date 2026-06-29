import request from "supertest";
import app from "../app.js";
import Notification from "../src/models/Notification.js";
import * as NotificationService from "../src/services/notificationService.js";

describe("Notification API", () => {
    let authToken;
    let userId;
    let otherToken;
    let otherId;

    beforeEach(async () => {
        const email = `notif-${Date.now()}-${Math.random()}@test.com`;
        const signup = await request(app)
            .post("/auth/signup/patient")
            .send({
                fullName: "Test User",
                email,
                phoneNumber: "+1234567890",
                gender: "Male",
                password: "ValidPass123!",
            });

        authToken = signup.body.data?.tokens?.accessToken;
        userId = signup.body.data?.user?.id;

        const otherEmail = `other-${Date.now()}-${Math.random()}@test.com`;
        const otherSignup = await request(app)
            .post("/auth/signup/patient")
            .send({
                fullName: "Other User",
                email: otherEmail,
                phoneNumber: "+1987654321",
                gender: "Female",
                password: "ValidPass123!",
            });

        otherToken = otherSignup.body.data?.tokens?.accessToken;
        otherId = otherSignup.body.data?.user?.id;
    });

    describe("NotificationService.create", () => {
        it("should create a notification and persist to DB", async () => {
            const notif = await NotificationService.create(
                userId,
                "system",
                "Test Title",
                "Test Message",
                { key: "value" },
                "urgent",
            );

            expect(notif).toBeDefined();
            expect(notif.user.toString()).toBe(userId);
            expect(notif.type).toBe("system");
            expect(notif.title).toBe("Test Title");
            expect(notif.message).toBe("Test Message");
            expect(notif.priority).toBe("urgent");
            expect(notif.read).toBe(false);

            const fromDb = await Notification.findById(notif._id);
            expect(fromDb).not.toBeNull();
            expect(fromDb.data.key).toBe("value");
        });
    });

    describe("GET /notifications", () => {
        it("should require authentication (401)", async () => {
            const res = await request(app).get("/notifications");
            expect(res.statusCode).toBe(401);
        });

        it("should return empty list when no notifications exist", async () => {
            const res = await request(app)
                .get("/notifications")
                .set("Authorization", `Bearer ${authToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.data.data).toEqual([]);
            expect(res.body.data.pagination.total).toBe(0);
        });

        it("should return user's notifications with pagination", async () => {
            await NotificationService.create(userId, "system", "N1", "Msg 1");
            await NotificationService.create(userId, "system", "N2", "Msg 2");
            await NotificationService.create(userId, "system", "N3", "Msg 3");

            const res = await request(app)
                .get("/notifications")
                .query({ page: 1, limit: 2 })
                .set("Authorization", `Bearer ${authToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.data.data.length).toBe(2);
            expect(res.body.data.pagination.total).toBe(3);
            expect(res.body.data.pagination.pages).toBe(2);
        });

        it("should not return other user's notifications", async () => {
            await NotificationService.create(
                otherId,
                "system",
                "Not mine",
                "Should be invisible",
            );

            const res = await request(app)
                .get("/notifications")
                .set("Authorization", `Bearer ${authToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.data.data).toEqual([]);
        });
    });

    describe("GET /notifications/unread-count", () => {
        it("should require authentication (401)", async () => {
            const res = await request(app).get("/notifications/unread-count");
            expect(res.statusCode).toBe(401);
        });

        it("should return 0 when no unread notifications", async () => {
            const res = await request(app)
                .get("/notifications/unread-count")
                .set("Authorization", `Bearer ${authToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.data.count).toBe(0);
        });

        it("should return correct unread count", async () => {
            await NotificationService.create(userId, "system", "N1", "Msg");
            await NotificationService.create(userId, "system", "N2", "Msg");
            await NotificationService.create(userId, "system", "N3", "Msg");

            const res = await request(app)
                .get("/notifications/unread-count")
                .set("Authorization", `Bearer ${authToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.data.count).toBe(3);
        });
    });

    describe("PATCH /notifications/read-all", () => {
        it("should require authentication (401)", async () => {
            const res = await request(app).patch("/notifications/read-all");
            expect(res.statusCode).toBe(401);
        });

        it("should mark all notifications as read", async () => {
            await NotificationService.create(userId, "system", "N1", "Msg");
            await NotificationService.create(userId, "system", "N2", "Msg");

            const res = await request(app)
                .patch("/notifications/read-all")
                .set("Authorization", `Bearer ${authToken}`);

            expect(res.statusCode).toBe(200);

            const unread = await Notification.countDocuments({
                user: userId,
                read: false,
            });
            expect(unread).toBe(0);
        });
    });

    describe("PATCH /notifications/:id/read", () => {
        it("should require authentication (401)", async () => {
            const res = await request(app)
                .patch("/notifications/507f1f77bcf86cd799439011/read");
            expect(res.statusCode).toBe(401);
        });

        it("should return 404 for non-existent notification", async () => {
            const res = await request(app)
                .patch("/notifications/507f1f77bcf86cd799439011/read")
                .set("Authorization", `Bearer ${authToken}`);

            expect(res.statusCode).toBe(404);
        });

        it("should mark a single notification as read", async () => {
            const notif = await NotificationService.create(
                userId,
                "system",
                "Test",
                "Msg",
            );

            const res = await request(app)
                .patch(`/notifications/${notif._id}/read`)
                .set("Authorization", `Bearer ${authToken}`);

            expect(res.statusCode).toBe(200);

            const fromDb = await Notification.findById(notif._id);
            expect(fromDb.read).toBe(true);
        });

        it("should return 404 when marking another user's notification", async () => {
            const notif = await NotificationService.create(
                otherId,
                "system",
                "Not mine",
                "Should not be accessible",
            );

            const res = await request(app)
                .patch(`/notifications/${notif._id}/read`)
                .set("Authorization", `Bearer ${authToken}`);

            expect(res.statusCode).toBe(404);
        });
    });
});
