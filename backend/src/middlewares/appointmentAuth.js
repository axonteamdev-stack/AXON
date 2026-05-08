import Appointment from "../models/appointmentModel.js";
import { catchAsync } from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import { msg } from "../utils/i18n.js";

export const restrictChat = catchAsync(async (req, res, next) => {
  const appointmentId = req.params.appointmentId || req.body.appointmentId || req.params.conversationId;

  const appointment = await Appointment.findById(appointmentId);
  if (!appointment) {
    throw new AppError(msg("الحجز غير موجود", "Appointment not found"), 404);
  }

  if (appointment.status !== "accepted") {
    throw new AppError(msg("لا يمكنك الشات إلا بعد قبول الطبيب للطلب", "Chat allowed only after doctor acceptance"), 403);
  }

  if (appointment.paymentStatus !== "paid") {
    throw new AppError(msg("يجب إتمام الدفع أولاً", "Payment must be completed first"), 403);
  }

  const isParticipant =
    appointment.patient.toString() === req.user.id ||
    appointment.doctor.toString() === req.user.id;

  if (!isParticipant) {
    throw new AppError(msg("غير مسموح لك بالدخول", "Unauthorized access"), 403);
  }

  req.appointment = appointment;
  next();
});

export const authorizeDoctor = catchAsync(async (req, res, next) => {
  const { appointment } = req;
  if (appointment.doctor.toString() !== req.user.id) {
    throw new AppError(msg("غير مسموح لك باتخاذ هذا القرار", "Unauthorized"), 403);
  }
  next();
});
