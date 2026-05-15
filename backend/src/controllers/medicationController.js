import { catchAsync } from "../utils/catchAsync.js";
import { sendLocalizedResponse } from "../utils/response.js";
import AppError from "../utils/AppError.js";
import { msg } from "../utils/i18n.js";
import * as MedicationService from "../services/medicationService.js";

export const create = catchAsync(async (req, res) => {
  const medication = await MedicationService.create({
    ...req.body,
    patientId: req.user.id,
    prescribedBy: req.body.prescribedBy || req.user.id,
  });
  sendLocalizedResponse(
    res,
    201,
    msg("تم إضافة الدواء بنجاح", "Medication added"),
    {
      medication,
    },
    req.lang,
  );
});

export const getMyMedications = catchAsync(async (req, res) => {
  const medications = await MedicationService.getByPatient(req.user.id);
  sendLocalizedResponse(
    res,
    200,
    msg("تم جلب الأدوية", "Medications fetched"),
    {
      medications,
    },
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
    {
      medication,
    },
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
    {
      medication,
    },
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
  const doses = await MedicationService.getPendingDoses(req.user.id);
  sendLocalizedResponse(
    res,
    200,
    msg("تم جلب الجرعات المعلقة", "Pending doses fetched"),
    { doses },
    req.lang,
  );
});
