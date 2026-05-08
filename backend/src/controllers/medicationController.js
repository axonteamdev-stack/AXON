import Medication from "../models/medicationModel.js";
import { catchAsync } from "../utils/catchAsync.js";
import { sendResponse } from "../utils/response.js";
import { validate } from "../middlewares/validate.js";
import { msg } from "../utils/i18n.js";
import { addMedicationSchema } from "../validators/medicationValidator.js";
import { paginationSchema } from "../validators/sharedValidator.js";
import { generateIntakeTimes, getTodayString } from "../utils/time.js";
import { buildTracker } from "../services/medicationService.js";
import { escapeRegex } from "../utils/sanitize.js";

const validateDateRange = (startDate, endDate) => {
  const now = new Date();
  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (start < startOfToday)
    throw new AppError(msg("تاريخ البدء في الماضي", "Start date cannot be in the past"), 400);
  if (end < now)
    throw new AppError(msg("تاريخ النهاية في الماضي", "End date cannot be in the past"), 400);
};

export const getMyMedications = catchAsync(async (req, res) => {
  const now = new Date();
  await Medication.updateMany(
    { patientId: req.user.id, endDate: { $lt: now }, isActive: true },
    { isActive: false }
  );

  const medications = await Medication.find({ patientId: req.user.id })
    .sort({ createdAt: -1 })
    .lean();
  const today = getTodayString();

  const synced = medications.map((med) => ({
    ...med,
    dailyTracker:
      med.lastResetDate !== today
        ? buildTracker(med.intakeTime)
        : med.dailyTracker,
    lastResetDate: med.lastResetDate !== today ? today : med.lastResetDate,
  }));

  sendResponse(res, 200, msg("تم جلب قائمة الأدوية بنجاح", "Medications list fetched successfully"), synced);
});

export const addMedication = catchAsync(async (req, res) => {
  const { medicineName, frequency, intakeTime, startDate, endDate } = req.body;
  const medicineNameClean = medicineName?.trim();

  validateDateRange(startDate, endDate);

  const existingMed = await Medication.findOne({
    patientId: req.user.id,
    medicineName: { $regex: new RegExp(`^${escapeRegex(medicineNameClean)}$`, "i") },
    $or: [{ endDate: { $gte: new Date() } }, { isActive: true }],
  }).lean();

  if (existingMed)
    throw new AppError(msg("هذا الدواء نشط بالفعل", "This medication is already active"), 400);

  const calculatedTimes = generateIntakeTimes(intakeTime, frequency);
  const medication = await Medication.create({
    ...req.body,
    medicineName: medicineNameClean,
    intakeTime: calculatedTimes,
    dailyTracker: buildTracker(calculatedTimes),
    lastResetDate: getTodayString(),
    patientId: req.user.id,
    isActive: true,
  });

  sendResponse(res, 201, msg("تم إضافة الدواء بنجاح", "Medication added successfully"), medication);
});

export const updateMedication = catchAsync(async (req, res) => {
  const medication = await Medication.findOne({
    _id: req.params.id,
    patientId: req.user.id,
  });
  if (!medication)
    throw new AppError(msg("الدواء غير موجود", "Medication not found"), 404);

  const updateData = { ...req.body };
  if (updateData.intakeTime || updateData.frequency) {
    const freq = updateData.frequency || medication.frequency;
    const firstTime = updateData.intakeTime || medication.intakeTime[0];
    updateData.intakeTime = generateIntakeTimes(firstTime, freq);
    updateData.dailyTracker = buildTracker(updateData.intakeTime);
    updateData.lastResetDate = getTodayString();
  }

  const updated = await Medication.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
    runValidators: true,
  });
  sendResponse(res, 200, msg("تم تحديث الدواء بنجاح", "Medication updated successfully"), updated);
});

export const markAsTaken = catchAsync(async (req, res) => {
  const medication = await Medication.findOne({
    _id: req.params.id,
    patientId: req.user.id,
  });
  if (!medication)
    throw new AppError(msg("الدواء غير موجود", "Medication not found"), 404);

  const nextDose = medication.dailyTracker.find((d) => d.status === "pending");
  if (!nextDose)
    throw new AppError(msg("لا توجد جرعات متبقية اليوم", "No doses left for today"), 400);

  nextDose.status = "taken";
  nextDose.updatedAt = new Date();
  await medication.save();

  sendResponse(res, 200, msg("تم تسجيل الجرعة كمتناولة", "Dose marked as taken"), medication);
});

export const skipDose = catchAsync(async (req, res) => {
  const medication = await Medication.findOne({
    _id: req.params.id,
    patientId: req.user.id,
  });
  if (!medication)
    throw new AppError(msg("الدواء غير موجود", "Medication not found"), 404);

  const nextDose = medication.dailyTracker.find((d) => d.status === "pending");
  if (!nextDose)
    throw new AppError(msg("لا توجد جرعات لتخطيها", "No doses to skip"), 400);

  nextDose.status = "skipped";
  nextDose.updatedAt = new Date();
  await medication.save();

  sendResponse(res, 200, msg("تم تخطي الجرعة بنجاح", "Dose skipped successfully"), medication);
});

export const getSingleMedication = catchAsync(async (req, res) => {
  const medication = await Medication.findOne({
    _id: req.params.id,
    patientId: req.user.id,
  }).lean();
  if (!medication)
    throw new AppError(msg("الدواء غير موجود", "Medication not found"), 404);

  const today = getTodayString();
  const synced =
    medication.lastResetDate !== today
      ? {
          ...medication,
          dailyTracker: buildTracker(medication.intakeTime),
          lastResetDate: today,
        }
      : medication;

  sendResponse(res, 200, msg("تم جلب الدواء بنجاح", "Medication fetched successfully"), synced);
});

export const deleteMedication = catchAsync(async (req, res) => {
  const med = await Medication.findOneAndDelete({
    _id: req.params.id,
    patientId: req.user.id,
  });
  if (!med)
    throw new AppError(msg("الدواء غير موجود", "Medication not found"), 404);

  sendResponse(res, 200, msg("تم حذف الدواء بنجاح", "Medication deleted successfully"));
});
