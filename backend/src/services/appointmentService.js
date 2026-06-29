import Appointment from "../models/Appointment.js";
import Conversation from "../models/Conversation.js";
import AppError from "../utils/AppError.js";
import { msg } from "../utils/i18n.js";
import { getIO } from "../config/socket.js";
import * as NotificationService from "./notificationService.js";

export const create = async (patientId, { doctorId, scheduledAt, notes }) => {
    const appointment = await Appointment.create({
        patient: patientId,
        doctor: doctorId,
        scheduledAt: new Date(scheduledAt),
        notes,
    });

    try {
        const io = getIO();
        io.to(doctorId.toString()).emit("newAppointment", {
            appointmentId: appointment._id,
            message: "لديك طلب كشف جديد",
        });
    } catch {
        // Socket not available
    }

    await NotificationService.create(
        doctorId,
        "appointment",
        msg("موعد جديد", "New Appointment"),
        msg(
            "لديك طلب كشف جديد من أحد المرضى",
            "You have a new appointment request",
        ),
        { appointmentId: appointment._id, patientId },
        "urgent",
    );

    return appointment;
};

export const getPendingForDoctor = (doctorId) =>
    Appointment.find({ doctor: doctorId, status: "pending" })
        .populate("patient", "fullName personalPhoto")
        .sort("-createdAt");

export const getHistoryForDoctor = (doctorId) =>
    Appointment.find({
        doctor: doctorId,
        status: { $ne: "pending" },
    })
        .populate("patient", "fullName personalPhoto")
        .sort("-updatedAt");

export const getForPatient = (patientId) =>
    Appointment.find({ patient: patientId })
        .populate("doctor", "fullName personalPhoto")
        .sort("-createdAt");

export const updateStatus = async (id, doctorId, status) => {
    const appointment = await Appointment.findOne({
        _id: id,
        doctor: doctorId,
    });
    if (!appointment) {
        throw new AppError(
            msg("الحجز غير موجود", "Appointment not found"),
            404,
        );
    }

    if (appointment.status !== "pending") {
        throw new AppError(
            msg("لا يمكن تعديل هذا الحجز", "Cannot modify this appointment"),
            400,
        );
    }

    appointment.status = status;
    await appointment.save();

    if (status === "accepted") {
        const existingConversation = await Conversation.findOne({
            appointmentId: appointment._id,
        });
        if (!existingConversation) {
            await Conversation.create({
                appointmentId: appointment._id,
                participants: [appointment.patient, appointment.doctor],
            });
        }
    }

    try {
        const io = getIO();
        io.to(appointment.patient.toString()).emit("appointmentUpdated", {
            appointmentId: appointment._id,
            status,
        });
    } catch {
        // Socket not available
    }

    if (status === "accepted") {
        await NotificationService.create(
            appointment.patient,
            "appointment",
            msg("تم قبول الموعد", "Appointment Accepted"),
            msg(
                "تم قبول طلب الكشف الخاص بك من قبل الطبيب",
                "Your appointment request has been accepted by the doctor",
            ),
            { appointmentId: appointment._id, doctorId: appointment.doctor },
            "urgent",
        );
    } else if (status === "rejected") {
        await NotificationService.create(
            appointment.patient,
            "appointment",
            msg("تم رفض الموعد", "Appointment Rejected"),
            msg(
                "عذراً، تم رفض طلب الكشف الخاص بك",
                "Sorry, your appointment request has been rejected",
            ),
            { appointmentId: appointment._id, doctorId: appointment.doctor },
            "normal",
        );
    }

    return appointment;
};

export const cancel = async (id, patientId) => {
    const appointment = await Appointment.findOne({
        _id: id,
        patient: patientId,
    });
    if (!appointment) {
        throw new AppError(
            msg("الحجز غير موجود", "Appointment not found"),
            404,
        );
    }

    if (appointment.status === "completed") {
        throw new AppError(
            msg(
                "لا يمكن إلغاء حجز منتهي",
                "Cannot cancel completed appointment",
            ),
            400,
        );
    }

    appointment.status = "cancelled";
    await appointment.save();

    await NotificationService.create(
        appointment.doctor,
        "appointment",
        msg("تم إلغاء الموعد", "Appointment Cancelled"),
        msg(
            "قام المريض بإلغاء طلب الكشف الخاص به",
            "The patient has cancelled their appointment request",
        ),
        { appointmentId: appointment._id, patientId },
        "normal",
    );

    return appointment;
};
