import { catchAsync } from "../utils/catchAsync.js";
import { sendLocalizedResponse } from "../utils/response.js";
import AppError from "../utils/AppError.js";
import { msg } from "../utils/i18n.js";
import * as MedicationService from "../services/medicationService.js";

export const create = catchAsync(async (req, res) => {
  if (req.user.role !== "doctor") {
    throw new AppError(
      msg("فقط الأطباء يمكنهم إضافة أدوية", "Only doctors can prescribe"),
      403,
    );
  }

  const medication = await MedicationService.create({
    ...req.body,
    patientId: req.body.patientId,
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

export const getMyMedications = catchAsync(async (req, res) => {
  const medications = await MedicationService.getByPatient(req.user.id);
  sendLocalizedResponse(
    res,
    200,
    msg("تم جلب الأدوية", "Medications fetched"),
    { medications },
    req.lang,
  );
});

export const getById = catchAsync(async (req, res) => {
  const medication = await MedicationService.getById(
    req.params.id,
    req.user.id,
  );
  sendLocalizedResponse(
    res,
    200,
    msg("تم جلب الدواء", "Medication fetched"),
    { medication },
    req.lang,
  );
});

export const update = catchAsync(async (req, res) => {
  const medication = await MedicationService.update(
    req.params.id,
    req.user.id,
    req.body,
  );
  sendLocalizedResponse(
    res,
    200,
    msg("تم تحديث الدواء", "Medication updated"),
    { medication },
    req.lang,
  );
});

export const remove = catchAsync(async (req, res) => {
  await MedicationService.remove(req.params.id, req.user.id);
  sendLocalizedResponse(
    res,
    200,
    msg("تم حذف الدواء", "Medication deleted"),
    null,
    req.lang,
  );
});

export const markDose = catchAsync(async (req, res) => {
  const { time, status } = req.body;
  const doseLog = await MedicationService.markDose(
    req.params.id,
    req.user.id,
    time,
    status,
  );
  sendLocalizedResponse(
    res,
    200,
    msg("تم تحديث الجرعة", "Dose updated"),
    { doseLog },
    req.lang,
  );
});

export const getPendingDoses = catchAsync(async (req, res) => {
  const dose = await MedicationService.getPendingDoses(req.user.id);
  sendLocalizedResponse(
    res,
    200,
    msg("تم جلب الجرعة القادمة المعلقة", "Next pending dose fetched"),
    { dose },
    req.lang,
  );
});

export const createSelfMedication = catchAsync(async (req, res) => {
  const medication = await MedicationService.create({
    ...req.body,
    patientId: req.user.id,
    prescribedBy: req.user.id,
    isSelfPrescribed: true,
  });
  sendLocalizedResponse(
    res,
    201,
    msg("تم إضافة الدواء بنجاح", "Medication added"),
    { medication },
    req.lang,
  );
});

export const getPatientMedications = catchAsync(async (req, res) => {
  const medications = await MedicationService.getByPatient(
    req.params.patientId,
  );
  sendLocalizedResponse(
    res,
    200,
    msg("تم جلب أدوية المريض", "Patient medications fetched"),
    { medications },
    req.lang,
  );
});
