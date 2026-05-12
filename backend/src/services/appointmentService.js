import Appointment from "../models/Appointment.js";
import Conversation from "../models/Conversation.js";
import AppError from "../utils/AppError.js";
import { msg } from "../utils/i18n.js";
import { getIO } from "../config/socket.js";

export const create = async (patientId, { doctorId, scheduledAt, notes }) => {
    const appointment = await Appointment.create({
        patient: patientId,
        doctor: doctorId,
        scheduledAt: new Date(scheduledAt),
        notes,
    });

    // Create conversation for chat
    await Conversation.create({
        appointmentId: appointment._id,
        participants: [patientId, doctorId],
    });

    // Notify doctor via socket
    try {
        const io = getIO();
        io.to(doctorId.toString()).emit("newAppointment", {
            appointmentId: appointment._id,
            message: "لديك طلب كشف جديد",
        });
    } catch {
        console.warn("Socket not available");
    }

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

    // Notify patient
    try {
        const io = getIO();
        io.to(appointment.patient.toString()).emit("appointmentUpdated", {
            appointmentId: appointment._id,
            status,
        });
    } catch {
        console.warn("Socket not available");
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

    return appointment;
};
