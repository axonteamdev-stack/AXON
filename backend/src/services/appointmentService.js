import mongoose from "mongoose";
import Appointment from "../models/appointmentModel.js";
import AppError from "../utils/appError.js";
import { msg } from "../utils/i18n.js";
import { getIO } from "../config/socket.js";

export const create = async (patientId, { doctorId, amount, scheduledAt }) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const appointment = await Appointment.create(
      [{
        patient: patientId,
        doctor: doctorId,
        amount,
        scheduledAt: new Date(scheduledAt),
        paymentStatus: "held",
      }],
      { session }
    );

    await session.commitTransaction();

    try {
      const io = getIO();
      io.to(doctorId).emit("newAppointmentRequest", {
        message: "لديك طلب كشف جديد في انتظار موافقتك",
        appointmentId: appointment[0]._id,
      });
    } catch {
      console.warn("Socket not available");
    }

    return appointment[0];
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
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
  const appointment = await Appointment.findOne({ _id: id, doctor: doctorId });
  if (!appointment)
    throw new AppError(msg("الحجز غير موجود", "Appointment not found"), 404);

  if (appointment.status !== "pending") {
    throw new AppError(msg("لا يمكن تعديل هذا الحجز", "Cannot modify this appointment"), 400);
  }

  const updates = { status };
  if (status === "accepted") updates.paymentStatus = "paid";
  if (status === "rejected") {
    updates.paymentStatus = "refunded";
    updates.cancellationReason = "Rejected by doctor";
    updates.cancelledBy = doctorId;
  }

  return Appointment.findByIdAndUpdate(id, updates, { new: true });
};
