import moment from "moment-timezone";
import Medication from "../models/medicationModel.js";
import User from "../models/userModel.js";
import AppError from "../utils/appError.js";
import { msg } from "../utils/i18n.js";
import { generateIntakeTimes, getTodayString } from "../utils/time.js";

const DEFAULT_TIMEZONE = "Africa/Cairo";
const DOSE_WINDOW_HOURS = 1;

const getUserTimezone = (user) => user?.timezone || DEFAULT_TIMEZONE;

const parseIntakeTime = (timeStr, timezone) => {
  const [time, modifier] = timeStr.split(" ");
  let [hours, minutes] = time.split(":").map(Number);
  if (modifier === "PM" && hours < 12) hours += 12;
  if (modifier === "AM" && hours === 12) hours = 0;
  return moment.tz(`${hours}:${minutes}`, "HH:mm", timezone);
};

export const buildTracker = (intakeTimes) =>
  intakeTimes.map((time) => ({
    time,
    status: "pending",
    updatedAt: null,
  }));

export const resetDailyTrackers = async () => {
  const today = getTodayString();
  const medications = await Medication.find({
    isActive: true,
    endDate: { $gt: new Date() },
  });

  let modifiedCount = 0;
  for (const med of medications) {
    if (med.lastResetDate !== today) {
      await Medication.findByIdAndUpdate(med._id, {
        dailyTracker: buildTracker(med.intakeTime),
        lastResetDate: today,
      });
      modifiedCount++;
    }
  }

  return { modifiedCount };
};

const calculateStats = (tracker) => ({
  total: tracker.length,
  pending: tracker.filter((d) => d.status === "pending").length,
  taken: tracker.filter((d) => d.status === "taken").length,
  skipped: tracker.filter((d) => d.status === "skipped").length,
});

export const getUserCurrentTime = (user) => moment().tz(getUserTimezone(user));

export const getPendingMedicationsForUser = async (userId) => {
  const user = await User.findById(userId).select("timezone");
  if (!user)
    throw new AppError(msg("المستخدم غير موجود", "User not found"), 404);

  const userTime = getUserCurrentTime(user);
  const timezone = getUserTimezone(user);

  const medications = await Medication.find({
    patientId: userId,
    isActive: true,
    endDate: { $gt: new Date() },
  });

  return medications
    .map((med) => {
      const pendingDoses = med.dailyTracker.filter((dose) => {
        if (dose.status !== "pending") return false;
        const doseTime = parseIntakeTime(dose.time, timezone);
        const hoursDiff = userTime.diff(doseTime, "hours", true);
        return hoursDiff >= -DOSE_WINDOW_HOURS && hoursDiff <= 0;
      });
      if (!pendingDoses.length) return null;
      return {
        ...med.toObject(),
        pendingDosesCount: pendingDoses.length,
        nextDoseTime: pendingDoses[0]?.time,
      };
    })
    .filter(Boolean);
};

export const getMedicationsWithStatus = async (userId) => {
  const user = await User.findById(userId).select("timezone");
  const today = getTodayString();

  const medications = await Medication.find({ patientId: userId }).sort({ createdAt: -1 });

  return Promise.all(
    medications.map(async (med) => {
      if (med.lastResetDate !== today) {
        await Medication.findByIdAndUpdate(med._id, {
          dailyTracker: buildTracker(med.intakeTime),
          lastResetDate: today,
        });
        med.dailyTracker = buildTracker(med.intakeTime);
        med.lastResetDate = today;
      }
      return {
        ...med.toObject(),
        stats: calculateStats(med.dailyTracker),
        isExpired: med.endDate < new Date(),
      };
    })
  );
};

export const markDoseAsTaken = async (medicationId, patientId, doseTime) => {
  const medication = await Medication.findOneAndUpdate(
    {
      _id: medicationId,
      patientId,
      dailyTracker: {
        $elemMatch: { status: "pending", time: doseTime },
      },
    },
    {
      $set: {
        "dailyTracker.$.status": "taken",
        "dailyTracker.$.updatedAt": new Date(),
      },
    },
    { new: true }
  );

  if (!medication) {
    throw new AppError(
      msg("هذه الجرعة تم تسجيلها بالفعل أو غير موجودة", "This dose was already marked or not found"),
      409
    );
  }

  return Medication.findByIdAndUpdate(
    medicationId,
    {
      $push: {
        auditTrail: {
          action: "dose_taken",
          actor: patientId,
          timestamp: new Date(),
          details: { doseTime },
        },
      },
    },
    { new: true }
  );
};

export const skipDose = async (medicationId, patientId, doseTime, reason = "") => {
  const medication = await Medication.findOneAndUpdate(
    {
      _id: medicationId,
      patientId,
      dailyTracker: {
        $elemMatch: { status: "pending", time: doseTime },
      },
    },
    {
      $set: {
        "dailyTracker.$.status": "skipped",
        "dailyTracker.$.updatedAt": new Date(),
      },
    },
    { new: true }
  );

  if (!medication) {
    throw new AppError(msg("الجرعة غير موجودة", "Dose not found"), 404);
  }

  return Medication.findByIdAndUpdate(
    medicationId,
    {
      $push: {
        auditTrail: {
          action: "dose_skipped",
          actor: patientId,
          timestamp: new Date(),
          details: { doseTime, reason },
        },
      },
    },
    { new: true }
  );
};

export const updateMedication = async (medicationId, patientId, updateData) => {
  const protectedFields = ["patientId", "prescribedBy", "auditTrail"];
  const sanitizedData = Object.fromEntries(
    Object.entries(updateData).filter(([key]) => !protectedFields.includes(key))
  );

  const medication = await Medication.findOneAndUpdate(
    { _id: medicationId, patientId },
    sanitizedData,
    { new: true, runValidators: true }
  );

  if (!medication) {
    throw new AppError(msg("غير موجود", "Not found"), 404);
  }

  return Medication.findByIdAndUpdate(
    medicationId,
    {
      $push: {
        auditTrail: {
          action: "updated",
          actor: patientId,
          timestamp: new Date(),
          details: Object.keys(sanitizedData),
        },
      },
    },
    { new: true }
  );
};

export const deleteMedication = async (medicationId, patientId) => {
  const medication = await Medication.findOneAndUpdate(
    { _id: medicationId, patientId },
    { isActive: false },
    { new: true }
  );

  if (!medication) {
    throw new AppError(msg("غير موجود", "Not found"), 404);
  }

  return Medication.findByIdAndUpdate(
    medicationId,
    {
      $push: {
        auditTrail: {
          action: "deleted",
          actor: patientId,
          timestamp: new Date(),
          details: {},
        },
      },
    },
    { new: true }
  );
};
