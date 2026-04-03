import Medication from "../Models/MedicationModel.js";
import { catchAsync } from "../Utils/AppError.js";
import { badRequestError, notFound } from "../Error/index.js";

import { StatusCodes } from "http-status-codes";

/** * --- دوال مساعدة لحساب التوقيت ---
 */

// 1. تحويل نص الساعة (08:00 AM) إلى ساعات ودقائق رقمية
const parseTime = (timeStr) => {
  const [time, modifier] = timeStr.split(" ");
  let [hours, minutes] = time.split(":").map(Number);
  if (modifier === "PM" && hours < 12) hours += 12;
  if (modifier === "AM" && hours === 12) hours = 0;
  return { hours, minutes };
};

// 2. تحويل الساعات والدقائق الرقمية إلى نص (10:00 PM)
const formatTime = (h, m) => {
  const modifier = h >= 12 ? "PM" : "AM";
  let hours = h % 12 || 12;
  let minutes = m < 10 ? `0${m}` : m;
  return `${hours}:${minutes} ${modifier}`;
};

// 3. توليد مصفوفة المواعيد بناءً على التكرار
const generateIntakeTimes = (firstTime, frequency) => {
  const { hours, minutes } = parseTime(firstTime);
  const times = [firstTime];

  if (frequency === "twice daily") {
    const secondHour = (hours + 12) % 24;
    times.push(formatTime(secondHour, minutes));
  } else if (frequency === "three times daily") {
    const secondHour = (hours + 8) % 24;
    const thirdHour = (hours + 16) % 24;
    times.push(formatTime(secondHour, minutes));
    times.push(formatTime(thirdHour, minutes));
  }
  return times;
};

/** * --- الـ Controller Functions ---
 */

// 1. جلب الأدوية وتحديث الحالة تلقائياً
export const getMyMedications = catchAsync(async (req, res, next) => {
  const now = new Date();
  await Medication.updateMany(
    { patientId: req.user.id, endDate: { $lt: now }, isActive: true },
    { isActive: false },
  );

  const medications = await Medication.find({ patientId: req.user.id }).sort({
    createdAt: -1,
  });
  res.status(StatusCodes.OK).json({
    status: "success",
    results: medications.length,
    data: medications,
  });
});

// 2. إضافة دواء جديد مع حساب المواعيد تلقائياً
export const addMedication = catchAsync(async (req, res, next) => {
  const { medicineName, frequency, intakeTime, startDate, endDate } = req.body;
  const medicineNameClean = medicineName?.trim();
  const now = new Date();
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  // التحقق من التواريخ
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (start < startOfToday)
    return next(new badRequestError("تاريخ البداية لا يمكن أن يكون في الماضي"));
  if (end < now)
    return next(new badRequestError("تاريخ النهاية لا يمكن أن يكون في الماضي"));

  // منع التكرار للدواء النشط
  const existingMed = await Medication.findOne({
    patientId: req.user.id,
    medicineName: { $regex: new RegExp(`^${medicineNameClean}$`, "i") },
    $or: [{ endDate: { $gte: startOfToday } }, { isActive: true }],
  });
  if (existingMed)
    return next(new badRequestError("هذا الدواء مضاف بالفعل وما زال سارياً."));

  // حساب المواعيد تلقائياً بناءً على أول موعد
  const firstIntakeTime = Array.isArray(intakeTime)
    ? intakeTime[0]
    : intakeTime;
  const calculatedTimes = generateIntakeTimes(firstIntakeTime, frequency);

  const medication = await Medication.create({
    ...req.body,
    medicineName: medicineNameClean,
    intakeTime: calculatedTimes, // المصفوفة المحسوبة
    patientId: req.user.id,
    isActive: true,
  });

  res.status(StatusCodes.CREATED).json({ status: "success", data: medication });
});

// 3. تعديل دواء موجود مع إعادة حساب المواعيد
export const updateMedication = catchAsync(async (req, res, next) => {
  const now = new Date();
  let medication = await Medication.findOne({
    _id: req.params.id,
    patientId: req.user.id,
  });

  if (!medication) return next(new notFound("الدواء غير موجود"));

  // إذا تغير الموعد الأول أو التكرار، نعيد حساب المصفوفة
  if (req.body.intakeTime || req.body.frequency) {
    const freq = req.body.frequency || medication.frequency;
    const intakeTimeValue = Array.isArray(req.body.intakeTime)
      ? req.body.intakeTime[0]
      : req.body.intakeTime;
    const firstTime = intakeTimeValue || medication.intakeTime[0];
    req.body.intakeTime = generateIntakeTimes(firstTime, freq);
  }

  // تحديث المدة والحالة إذا تغيرت التواريخ
  if (req.body.startDate || req.body.endDate) {
    const start = new Date(req.body.startDate || medication.startDate);
    const end = new Date(req.body.endDate || medication.endDate);
    if (end < start)
      return next(new badRequestError("تاريخ النهاية غير منطقي"));
    req.body.isActive = end >= now;
  }

  const updatedMed = await Medication.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    },
  );

  res.status(StatusCodes.OK).json({ status: "success", data: updatedMed });
});

// 4. حذف دواء
export const deleteMedication = catchAsync(async (req, res, next) => {
  const med = await Medication.findOneAndDelete({
    _id: req.params.id,
    patientId: req.user.id,
  });
  if (!med) return next(new notFound("الدواء غير موجود"));

  res
    .status(StatusCodes.OK)
    .json({ status: "success", message: "تم حذف الدواء بنجاح" });
});
