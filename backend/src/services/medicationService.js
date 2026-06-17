import Medication from "../models/Medication.js";
import DoseLog from "../models/DoseLog.js";
import AppError from "../utils/AppError.js";
import { msg } from "../utils/i18n.js";

const INTERVAL_MAP = Object.freeze({
  "once daily": 24,
  "twice daily": 12,
  "three times daily": 8,
  "four times daily": 6,
  "every 4 hours": 4,
  "every 6 hours": 6,
  "every 8 hours": 8,
  "every 12 hours": 12,
  weekly: 168,
  monthly: 720,
  "as needed": 0,
});

const COUNT_MAP = Object.freeze({
  "once daily": 1,
  "twice daily": 2,
  "three times daily": 3,
  "four times daily": 4,
  "every 4 hours": 6,
  "every 6 hours": 4,
  "every 8 hours": 3,
  "every 12 hours": 2,
  weekly: 1,
  monthly: 1,
  "as needed": 0,
});

const getTodayString = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
};

const calcIntakeTimes = (startTime, frequency) => {
  if (frequency === "as needed") return [];
  const interval = INTERVAL_MAP[frequency];
  const count = COUNT_MAP[frequency];
  if (!interval || !count) return null;

  const [h, m] = startTime.split(":").map(Number);
  const startMin = h * 60 + m;
  const step = interval * 60;

  const times = [];
  for (let i = 0; i < count; i++) {
    const total = startMin + i * step;
    const hour = Math.floor(total / 60) % 24;
    const minute = total % 60;
    times.push(
      `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`,
    );
  }
  return times;
};

const resolveIntakeTimes = (data) => {
  if (data.intakeTimes?.length) return data.intakeTimes;
  if (data.startTime && data.frequency) {
    const t = calcIntakeTimes(data.startTime, data.frequency);
    if (t) return t;
  }
  return data.intakeTimes || [];
};

export const create = async (data) => {
  const intakeTimes = resolveIntakeTimes(data);
  const medication = await Medication.create({ ...data, intakeTimes });

  const today = getTodayString();
  const doseLogs = medication.intakeTimes.map((time) => ({
    patientId: medication.patientId,
    medicationId: medication._id,
    date: today,
    time,
    status: "pending",
  }));

  await DoseLog.insertMany(doseLogs);
  return medication;
};

export const getById = async (medicationId, patientId) => {
  const medication = await Medication.findOne({ _id: medicationId, patientId });
  if (!medication) {
    throw new AppError(msg("الدواء غير موجود", "Medication not found"), 404);
  }
  return medication;
};

export const update = async (medicationId, patientId, updateData) => {
  const protectedFields = ["patientId", "prescribedBy"];
  const sanitized = Object.fromEntries(
    Object.entries(updateData).filter(([k]) => !protectedFields.includes(k)),
  );

  const medication = await Medication.findOneAndUpdate(
    { _id: medicationId, patientId },
    sanitized,
    { new: true, runValidators: true },
  );

  if (!medication) {
    throw new AppError(msg("الدواء غير موجود", "Medication not found"), 404);
  }
  return medication;
};

export const remove = async (medicationId, patientId) => {
  const medication = await Medication.findOneAndUpdate(
    { _id: medicationId, patientId },
    { isActive: false },
    { new: true },
  );

  if (!medication) {
    throw new AppError(msg("الدواء غير موجود", "Medication not found"), 404);
  }
  return medication;
};

export const getByPatient = async (patientId) => {
  const medications = await Medication.find({ patientId }).sort({
    createdAt: -1,
  });
  const today = getTodayString();

  return Promise.all(
    medications.map(async (med) => {
      const doseLogs = await DoseLog.find({
        medicationId: med._id,
        date: today,
      }).lean();
      return {
        ...med.toObject(),
        doseLogs,
        stats: {
          total: doseLogs.length,
          pending: doseLogs.filter((d) => d.status === "pending").length,
          taken: doseLogs.filter((d) => d.status === "taken").length,
          skipped: doseLogs.filter((d) => d.status === "skipped").length,
        },
        isExpired: med.endDate < new Date(),
      };
    }),
  );
};

export const markDose = async (medicationId, patientId, time, status) => {
  const today = getTodayString();

  const doseLog = await DoseLog.findOneAndUpdate(
    { medicationId, patientId, date: today, time, status: "pending" },
    { status, updatedAt: new Date() },
    { new: true },
  );

  if (!doseLog) {
    throw new AppError(
      msg(
        "هذه الجرعة تم تسجيلها بالفعل أو غير موجودة",
        "This dose was already marked or not found",
      ),
      409,
    );
  }
  return doseLog;
};

export const getPendingDoses = async (patientId) => {
  const today = getTodayString();

  const pendingDoses = await DoseLog.find({
    patientId,
    date: today,
    status: "pending",
  }).populate("medicationId", "medicineName dosage");

  if (pendingDoses.length === 0) {
    return null;
  }

  pendingDoses.sort((a, b) => {
    const [hA, mA] = a.time.split(":").map(Number);
    const [hB, mB] = b.time.split(":").map(Number);

    const minutesA = hA * 60 + mA;
    const minutesB = hB * 60 + mB;

    return minutesA - minutesB;
  });

  return pendingDoses[0];
};
