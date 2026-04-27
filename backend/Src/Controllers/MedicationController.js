import Medication from "../Models/MedicationModel.js";
import { catchAsync } from "../Utils/AppError.js";
import { sendResponse } from "../Utils/AppError.js";
import { msg } from "../Utils/ResponseHelper.js";
import AppError from "../Utils/AppError.js";
import { escapeRegex } from "../Utils/regexEscape.js";

/** * --- دوال مساعدة لحساب التوقيت (مهمة لإنشاء الـ Tracker) ---
 */
const parseTime = (timeStr) => {
  const [time, modifier] = timeStr.split(" ");
  let [hours, minutes] = time.split(":").map(Number);
  if (modifier === "PM" && hours < 12) hours += 12;
  if (modifier === "AM" && hours === 12) hours = 0;
  return { hours, minutes };
};

const formatTime = (h, m) => {
  const modifier = h >= 12 ? "PM" : "AM";
  let hours = h % 12 || 12;
  let minutes = m < 10 ? `0${m}` : m;
  return `${hours}:${minutes} ${modifier}`;
};

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

/** * --- دالة مساعدة لتصفير حالة الجرعات يومياً ---
 */
const syncDailyTracker = (medication) => {
  const today = new Date().toISOString().split("T")[0];
  if (medication.lastResetDate !== today) {
    medication.dailyTracker = medication.intakeTime.map((time) => ({
      time,
      status: "pending",
      updatedAt: new Date(),
    }));
    medication.lastResetDate = today;
  }
  return medication;
};













/** * --- الـ Controller Functions ---
 */

// 1. جلب الأدوية وتحديث الحالة تلقائياً
export const getMyMedications = catchAsync(async (req, res, next) => {
  const now = new Date();
  // تحديث الأدوية التي انتهت صلاحيتها
  await Medication.updateMany(
    { patientId: req.user.id, endDate: { $lt: now }, isActive: true },
    { isActive: false },
  );

  let medications = await Medication.find({ patientId: req.user.id }).sort({
    createdAt: -1,
  });

  // مزامنة الـ Tracker لكل دواء قبل إرساله (لضمان ظهور حالة اليوم الحالي)
  medications = medications.map((med) => syncDailyTracker(med));

  sendResponse(
    res,
    200,
    msg("تم جلب قائمة الأدوية بنجاح", "Medications list fetched successfully"),
    medications,
  );
});

// 2. إضافة دواء جديد
export const addMedication = catchAsync(async (req, res, next) => {
  const { medicineName, frequency, intakeTime, startDate, endDate } = req.body;
  const medicineNameClean = medicineName?.trim();
  const now = new Date();
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (start < startOfToday) {
    return next(
      new AppError(
        msg("تاريخ البدء في الماضي", "Start date cannot be in the past"),
        400,
      ),
    );
  }
  if (end < now) {
    return next(
      new AppError(
        msg("تاريخ النهاية في الماضي", "End date cannot be in the past"),
        400,
      ),
    );
  }

  const existingMed = await Medication.findOne({
    patientId: req.user.id,
    medicineName: {
      $regex: new RegExp(`^${escapeRegex(medicineNameClean)}$`, "i"),
    },
    $or: [{ endDate: { $gte: startOfToday } }, { isActive: true }],
  });

  if (existingMed) {
    return next(
      new AppError(
        msg("هذا الدواء نشط بالفعل", "This medication is already active"),
        400,
      ),
    );
  }

  const calculatedTimes = generateIntakeTimes(intakeTime, frequency);

  // إنشاء الدواء مع الـ Tracker الابتدائي
  const medication = await Medication.create({
    ...req.body,
    medicineName: medicineNameClean,
    intakeTime: calculatedTimes,
    dailyTracker: calculatedTimes.map((t) => ({ time: t, status: "pending" })),
    lastResetDate: new Date().toISOString().split("T")[0],
    patientId: req.user.id,
    isActive: true,
  });

  sendResponse(
    res,
    201,
    msg("تم إضافة الدواء بنجاح", "Medication added successfully"),
    medication,
  );
});

// 3. تعديل دواء موجود
export const updateMedication = catchAsync(async (req, res, next) => {
  const now = new Date();
  let medication = await Medication.findOne({
    _id: req.params.id,
    patientId: req.user.id,
  });

  if (!medication) {
    return next(
      new AppError(msg("الدواء غير موجود", "Medication not found"), 404),
    );
  }

  if (req.body.intakeTime || req.body.frequency) {
    const freq = req.body.frequency || medication.frequency;
    const firstTime = req.body.intakeTime || medication.intakeTime[0];
    req.body.intakeTime = generateIntakeTimes(firstTime, freq);
    // تحديث الـ Tracker في حال تغير المواعيد
    req.body.dailyTracker = req.body.intakeTime.map((t) => ({
      time: t,
      status: "pending",
    }));
  }

  const updatedMed = await Medication.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    },
  );

  sendResponse(
    res,
    200,
    msg("تم تحديث الدواء بنجاح", "Medication updated successfully"),
    updatedMed,
  );
});




// 4. تسجيل الجرعة كـ "تم الأخذ" (Taken)
export const markAsTaken = catchAsync(async (req, res, next) => {
  let medication = await Medication.findOne({
    _id: req.params.id,
    patientId: req.user.id,
  });
  if (!medication) {
    return next(
      new AppError(msg("الدواء غير موجود", "Medication not found"), 404),
    );
  }

  syncDailyTracker(medication);

  const nextDose = medication.dailyTracker.find((d) => d.status === "pending");
  if (!nextDose) {
    return next(
      new AppError(
        msg("لا توجد جرعات متبقية اليوم", "No doses left for today"),
        400,
      ),
    );
  }

  nextDose.status = "taken";
  nextDose.updatedAt = new Date();
  await medication.save();

  sendResponse(
    res,
    200,
    msg("تم تسجيل الجرعة كمتناولة", "Dose marked as taken"),
    medication,
  );
});

// 5. تسجيل الجرعة كـ "تخطي" (Skip) - نسخة مطورة
export const skipDose = catchAsync(async (req, res, next) => {
  let medication = await Medication.findOne({
    _id: req.params.id,
    patientId: req.user.id,
  });
  if (!medication) {
    return next(
      new AppError(msg("الدواء غير موجود", "Medication not found"), 404),
    );
  }

  syncDailyTracker(medication);

  const nextDose = medication.dailyTracker.find((d) => d.status === "pending");
  if (!nextDose) {
    return next(
      new AppError(msg("لا توجد جرعات لتخطيها", "No doses to skip"), 400),
    );
  }

  nextDose.status = "skipped";
  nextDose.updatedAt = new Date();
  await medication.save();

  sendResponse(
    res,
    200,
    msg("تم تخطي الجرعة بنجاح", "Dose skipped successfully"),
    medication,
  );
});

// Get single medication by ID
export const getSingleMedication = catchAsync(async (req, res, next) => {
  let medication = await Medication.findOne({
    _id: req.params.id,
    patientId: req.user.id,
  });

  if (!medication) {
    return next(
      new AppError(msg("الدواء غير موجود", "Medication not found"), 404),
    );
  }

  syncDailyTracker(medication);

  sendResponse(
    res,
    200,
    msg("تم جلب الدواء بنجاح", "Medication fetched successfully"),
    medication,
  );
});

// Delete medication
export const deleteMedication = catchAsync(async (req, res, next) => {
  const med = await Medication.findOneAndDelete({
    _id: req.params.id,
    patientId: req.user.id,
  });

  if (!med) {
    return next(
      new AppError(msg("الدواء غير موجود", "Medication not found"), 404),
    );
  }

  sendResponse(
    res,
    200,
    msg("تم حذف الدواء بنجاح", "Medication deleted successfully"),
  );
});
