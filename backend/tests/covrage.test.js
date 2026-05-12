import mongoose from "mongoose";

// Models
import User from "../src/models/User.js";
import Medication from "../src/models/Medication.js";
import Post from "../src/models/Post.js";
import Appointment from "../src/models/Appointment.js";
import MedicalRecord from "../src/models/MedicalRecord.js";

// Services
import * as appointmentService from "../src/services/appointmentService.js";
import * as authService from "../src/services/authService.js";
import * as chatService from "../src/services/chatService.js";
import * as ddiService from "../src/services/ddiService.js";
import * as fileService from "../src/services/fileService.js";
import * as medicationService from "../src/services/medicationService.js";
import * as notificationService from "../src/services/notificationService.js";
import * as postService from "../src/services/postService.js";
import * as recordService from "../src/services/recordService.js";
import * as tokenService from "../src/services/tokenService.js";
import * as userService from "../src/services/userService.js";

describe("Services Comprehensive Coverage", () => {
    let patient, doctor;

    beforeAll(async () => {
        // Create global test users for the suite
        patient = await User.create({
            fullName: "Svc Patient",
            email: `svcpat${Date.now()}@test.com`,
            password: "hashedpass123",
            phone: "01234567890",
            role: "patient",
            gender: "male",
            dateOfBirth: new Date("1990-01-01"),
        });

        doctor = await User.create({
            fullName: "Dr. Svc",
            email: `svcdoc${Date.now()}@test.com`,
            password: "hashedpass123",
            phone: "01234567890",
            role: "doctor",
            specialization: "General",
            medicalLicenseNumber: `LICSVC${Date.now()}`,
            gender: "male",
            dateOfBirth: new Date("1980-01-01"),
        });
    }, 30000);

    afterAll(async () => {
        // Cleanup database to keep it pristine
        if (patient) await User.deleteOne({ _id: patient._id }).catch(() => {});
        if (doctor) await User.deleteOne({ _id: doctor._id }).catch(() => {});
        await new Promise((r) => setTimeout(r, 50));
    });

    describe("appointmentService", () => {
        it("create + get + update + delete", async () => {
            const a = await appointmentService.createAppointment({
                patient: patient._id,
                doctor: doctor._id,
                date: new Date("2024-12-01"),
                time: "10:00",
                reason: "Checkup",
                status: "pending",
            });
            expect(a).toBeDefined();

            const patApps = await appointmentService.getAppointmentsByUser(
                patient._id,
                "patient",
            );
            const docApps = await appointmentService.getAppointmentsByUser(
                doctor._id,
                "doctor",
            );

            expect(Array.isArray(patApps)).toBe(true);
            expect(Array.isArray(docApps)).toBe(true);
            expect(
                await appointmentService.getAppointmentById(a._id),
            ).toBeDefined();

            await appointmentService.updateAppointment(a._id, {
                status: "confirmed",
            });
            await appointmentService.deleteAppointment(a._id);
            expect(await Appointment.findById(a._id)).toBeNull();
        }, 15000);
    });

    describe("authService", () => {
        it("signup + login + changePassword", async () => {
            const p = await authService.signupPatient({
                fullName: "Auth Pat",
                email: `asp${Date.now()}@t.com`,
                password: "Password123!",
                phone: "01234567890",
                gender: "male",
                dateOfBirth: "1990-01-01",
            });
            expect(p.user).toBeDefined();

            const login = await authService.login(p.user.email, "Password123!");
            expect(login.token).toBeDefined();

            await expect(
                authService.login(p.user.email, "wrong"),
            ).rejects.toThrow();

            expect(
                await authService.changePassword(
                    p.user._id,
                    "Password123!",
                    "NewPass123!",
                ),
            ).toBeDefined();

            await User.deleteOne({ _id: p.user._id }).catch(() => {});
        }, 15000);
    });

    describe("chatService", () => {
        it("conversation + message + get", async () => {
            const c = await chatService.createConversation([
                patient._id,
                doctor._id,
            ]);
            expect(c).toBeDefined();

            const m = await chatService.sendMessage({
                conversation: c._id,
                sender: patient._id,
                content: "Hi",
            });
            expect(m).toBeDefined();
            expect(Array.isArray(await chatService.getMessages(c._id))).toBe(
                true,
            );
            expect(
                Array.isArray(await chatService.getConversations(patient._id)),
            ).toBe(true);
        }, 15000);
    });

    describe("ddiService", () => {
        it("check interactions + errors", async () => {
            expect(
                await ddiService.checkInteractions(["Aspirin", "Warfarin"]),
            ).toBeDefined();
            await expect(ddiService.checkInteractions([])).rejects.toThrow();
        }, 15000);
    });

    describe("fileService", () => {
        it("exports required functions", () => {
            expect(typeof fileService.saveFile).toBe("function");
            expect(typeof fileService.deleteFile).toBe("function");
            expect(typeof fileService.moveFromTemp).toBe("function");
        });
    });

    describe("medicationService", () => {
        it("CRUD + dose logs", async () => {
            const m = await medicationService.createMedication({
                patient: patient._id,
                medicineName: "Med",
                dosage: "100mg",
                frequency: "daily",
                startDate: new Date(),
                endDate: new Date(),
            });
            expect(m).toBeDefined();
            expect(
                Array.isArray(
                    await medicationService.getMedications(patient._id),
                ),
            ).toBe(true);

            await medicationService.updateMedication(m._id, {
                dosage: "200mg",
            });
            expect(
                await medicationService.logDose(m._id, patient._id, new Date()),
            ).toBeDefined();
            expect(
                Array.isArray(await medicationService.getDoseLogs(m._id)),
            ).toBe(true);

            await medicationService.deleteMedication(m._id);
            expect(await Medication.findById(m._id)).toBeNull();
        }, 15000);
    });

    describe("notificationService", () => {
        it("lifecycle: create, read, delete", async () => {
            const n = await notificationService.createNotification({
                recipient: patient._id,
                type: "test",
                title: "T",
                message: "M",
            });
            expect(n).toBeDefined();
            expect(
                typeof (await notificationService.getUnreadCount(patient._id)),
            ).toBe("number");

            await notificationService.markAsRead(n._id);
            await notificationService.markAllAsRead(patient._id);
            await notificationService.deleteNotification(n._id);
        }, 15000);
    });

    describe("postService", () => {
        it("CRUD + social interactions", async () => {
            const p = await postService.createPost({
                author: doctor._id,
                title: "T",
                content: "Detailed content here.",
                category: "health",
            });
            expect(p).toBeDefined();

            await postService.likePost(p._id, patient._id);
            expect(
                await postService.addComment(p._id, patient._id, "C"),
            ).toBeDefined();
            expect(Array.isArray(await postService.getComments(p._id))).toBe(
                true,
            );

            await postService.deletePost(p._id, doctor._id);
            expect(await Post.findById(p._id)).toBeNull();
        }, 15000);
    });

    describe("recordService", () => {
        it("CRUD medical records", async () => {
            const r = await recordService.createRecord({
                patient: patient._id,
                doctor: doctor._id,
                type: "diagnosis",
                title: "T",
                description: "D",
                date: new Date(),
            });
            expect(r).toBeDefined();
            expect(
                Array.isArray(await recordService.getRecords(patient._id)),
            ).toBe(true);

            await recordService.updateRecord(r._id, { title: "Updated" });
            await recordService.deleteRecord(r._id);
            expect(await MedicalRecord.findById(r._id)).toBeNull();
        }, 15000);
    });

    describe("tokenService", () => {
        it("generate + verify", () => {
            const t = tokenService.generateToken({ userId: patient._id }, "1h");
            expect(typeof t).toBe("string");
            const decoded = tokenService.verifyToken(t);
            expect(decoded.userId).toBe(String(patient._id));
            expect(() => tokenService.verifyToken("invalid-token")).toThrow();
        });
    });

    describe("userService", () => {
        it("profile and follow management", async () => {
            expect(await userService.getUserById(patient._id)).toBeDefined();
            expect(Array.isArray(await userService.getDoctors({}))).toBe(true);

            await userService.followUser(patient._id, doctor._id);
            const followers = await userService.getFollowers(doctor._id);
            expect(Array.isArray(followers)).toBe(true);

            await userService.unfollowUser(patient._id, doctor._id);
        }, 15000);
    });
});
