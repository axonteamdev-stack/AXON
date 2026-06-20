import { catchAsync } from "../utils/catchAsync.js";
import { sendLocalizedResponse } from "../utils/response.js";
import AppError from "../utils/AppError.js";
import { msg } from "../utils/i18n.js";
import * as DDIService from "../services/ddiService.js";
import Appointment from "../models/Appointment.js";

// ─── PATIENT ───

export const checkMyInteractions = catchAsync(async (req, res) => {
  const { newMedicationName } = req.body;
  const result = await DDIService.checkDrugInteractions(
    req.user.id,
    newMedicationName,
  );
  sendLocalizedResponse(
    res,
    200,
    msg("تم فحص التفاعلات", "Interactions checked"),
    { result },
    req.lang,
  );
});

export const checkMyContraindications = catchAsync(async (req, res) => {
  const { medicineName } = req.body;
  const result = await DDIService.checkContraindications(
    req.user.id,
    medicineName,
  );
  sendLocalizedResponse(
    res,
    200,
    msg("تم فحص الموانع", "Contraindications checked"),
    { result },
    req.lang,
  );
});

// ─── DOCTOR ───

export const checkPatientInteractions = catchAsync(async (req, res) => {
  const { newMedicationName } = req.body;
  const { appointmentId } = req.params;

  const appointment = await Appointment.findOne({
    _id: appointmentId,
    doctor: req.user.id,
  });

  if (!appointment) {
    throw new AppError(
      msg("الموعد غير موجود أو غير مصرح", "Appointment not found or unauthorized"),
      404,
    );
  }

  const result = await DDIService.checkDrugInteractions(
    appointment.patient.toString(),
    newMedicationName,
  );

  sendLocalizedResponse(
    res,
    200,
    msg("تم فحص تفاعلات المريض", "Patient interactions checked"),
    { result },
    req.lang,
  );
});

export const checkPatientContraindications = catchAsync(async (req, res) => {
  const { medicineName } = req.body;
  const { appointmentId } = req.params;

  const appointment = await Appointment.findOne({
    _id: appointmentId,
    doctor: req.user.id,
  });

  if (!appointment) {
    throw new AppError(
      msg("الموعد غير موجود أو غير مصرح", "Appointment not found or unauthorized"),
      404,
    );
  }

  const result = await DDIService.checkContraindications(
    appointment.patient.toString(),
    medicineName,
  );

  sendLocalizedResponse(
    res,
    200,
    msg("تم فحص موانع المريض", "Patient contraindications checked"),
    { result },
    req.lang,
  );
});

// ─── SHARED ───

export const checkDirectInteractions = catchAsync(async (req, res) => {
  const { drugs } = req.body;
  const result = await DDIService.checkDirectDrugInteractions(drugs);
  sendLocalizedResponse(
    res,
    200,
    msg("تم فحص التفاعلات المباشر", "Direct interactions checked"),
    { result },
    req.lang,
  );
});
