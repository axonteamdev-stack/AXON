import { catchAsync } from "../utils/catchAsync.js";
import { sendLocalizedResponse } from "../utils/response.js";
import { msg } from "../utils/i18n.js";
import * as MedicationService from "../services/medicationService.js";
import Appointment from "../models/Appointment.js";
import Patient from "../models/Patient.js";
import AppError from "../utils/AppError.js";
import crypto from "crypto";

export const prescribeFromAppointment = catchAsync(async (req, res) => {
  const appointment = await Appointment.findOne({
    _id: req.params.appointmentId,
    doctor: req.user.id,
    status: { $in: ["pending", "accepted"] },
  });

  if (!appointment) {
    throw new AppError(
      msg("الحجز غير موجود أو غير متاح", "Appointment not found or unavailable"),
      404,
    );
  }

  const medication = await MedicationService.create({
    ...req.body,
    patientId: appointment.patient.toString(),
    prescribedBy: req.user.id,
  });

  sendLocalizedResponse(
    res,
    201,
    msg("تم إضافة الدواء بنجاح", "Medication added"),
    { medication },
    req.lang,
  );
});

export const prescribeFromQR = catchAsync(async (req, res) => {
  const { token, pin } = req.body;

  if (!token || !pin) {
    throw new AppError(
      msg("يرجى إدخال رمز QR و PIN", "Please provide QR token and PIN"),
      400,
    );
  }

  const record = await Patient.findOne({
    "emergencyQR.token": token,
    "emergencyQR.expiresAt": { $gt: new Date() },
  });

  if (!record) {
    throw new AppError(
      msg("رمز QR غير صالح أو منتهي", "Invalid or expired QR code"),
      404,
    );
  }

  const hashedPin = crypto.createHash("sha256").update(pin).digest("hex");
  if (record.emergencyQR.pin !== hashedPin) {
    throw new AppError(msg("رمز PIN غير صحيح", "Invalid PIN"), 401);
  }

  const medication = await MedicationService.create({
    ...req.body,
    patientId: record.userId.toString(),
    prescribedBy: req.user.id,
  });

  sendLocalizedResponse(
    res,
    201,
    msg("تم إضافة الدواء بنجاح", "Medication added"),
    { medication },
    req.lang,
  );
});
