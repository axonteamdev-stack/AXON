/**
 * MedicationService - Medication business logic with timezone support
 * ✅ CRITICAL FIX: Handle timezone conversions for medication reminders
 */

import moment from "moment-timezone";
import Medication from "../Models/MedicationModel.js";
import User from "../Models/UserModel.js";
import AppError from "../Utils/AppError.js";
import { msg } from "../Utils/ResponseHelper.js";

export class MedicationService {
  /**
   * ✅ CRITICAL: Get current time in user's timezone
   * Prevents medication reminder issues for users in different timezones
   */
  static getUserCurrentTime(user) {
    const userTimezone = user.timezone || "Africa/Cairo"; // Default fallback
    return moment().tz(userTimezone);
  }

  /**
   * Convert 12-hour format time to user's timezone offset
   * Example: "10:00 AM" in user's local timezone
   */
  static parseIntakeTimeForUser(timeStr12hr, userTimezone = "Africa/Cairo") {
    const [time, modifier] = timeStr12hr.split(" ");
    let [hours, minutes] = time.split(":").map(Number);

    if (modifier === "PM" && hours < 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;

    const now = moment().tz(userTimezone);
    const intakeTime = now.clone().hour(hours).minute(minutes).second(0);
    return intakeTime;
  }

  /**
   * ✅ CRITICAL: Get pending medications for user in their local time
   * Filters doses based on user's LOCAL timezone, not UTC
   */
  static async getPendingMedicationsForUser(userId) {
    const user = await User.findById(userId).select("timezone");
    if (!user) {
      throw new AppError(msg("المستخدم غير موجود", "User not found"), 404);
    }

    const userTime = this.getUserCurrentTime(user);

    const medications = await Medication.find({
      patientId: userId,
      isActive: true,
      endDate: { $gt: new Date() },
    });

    // ✅ Filter pending doses based on user's LOCAL time
    const pendingMedications = medications
      .map((med) => {
        const pendingDoses = med.dailyTracker.filter((dose) => {
          if (dose.status !== "pending") return false;

          const doseTime = this.parseIntakeTimeForUser(
            dose.time,
            user.timezone || "Africa/Cairo",
          );

          // Show as pending if within last 1 hour (give 1hr window for user to take)
          const hoursDiff = userTime.diff(doseTime, "hours", true);
          return hoursDiff >= -1 && hoursDiff <= 0;
        });

        if (pendingDoses.length === 0) return null;

        return {
          ...med.toObject(),
          pendingDosesCount: pendingDoses.length,
          nextDoseTime: pendingDoses[0]?.time,
        };
      })
      .filter((med) => med !== null);

    return pendingMedications;
  }

  /**
   * Get all medications with timezone-aware status
   */
  static async getMedicationsWithStatus(userId) {
    const user = await User.findById(userId).select("timezone");
    const userTime = this.getUserCurrentTime(user);

    const medications = await Medication.find({
      patientId: userId,
    }).sort({ createdAt: -1 });

    return medications.map((med) => {
      // Sync daily tracker to current date
      const today = new Date().toISOString().split("T")[0];
      if (med.lastResetDate !== today) {
        med.dailyTracker = med.intakeTime.map((time) => ({
          time,
          status: "pending",
          updatedAt: null,
        }));
        med.lastResetDate = today;
      }

      const pendingCount = med.dailyTracker.filter(
        (d) => d.status === "pending",
      ).length;
      const takenCount = med.dailyTracker.filter(
        (d) => d.status === "taken",
      ).length;

      return {
        ...med.toObject(),
        stats: {
          total: med.dailyTracker.length,
          pending: pendingCount,
          taken: takenCount,
          skipped: med.dailyTracker.filter((d) => d.status === "skipped")
            .length,
        },
        isExpired: med.endDate < new Date(),
      };
    });
  }

  /**
   * Mark dose as taken (atomic operation to prevent race conditions)
   */
  static async markDoseAsTaken(medicationId, patientId, doseTime) {
    // ✅ ATOMIC: Use MongoDB atomic operation
    const medication = await Medication.findOneAndUpdate(
      {
        _id: medicationId,
        patientId,
        dailyTracker: {
          $elemMatch: {
            status: "pending",
            time: doseTime,
          },
        },
      },
      {
        $set: {
          "dailyTracker.$.status": "taken",
          "dailyTracker.$.updatedAt": new Date(),
        },
      },
      { new: true },
    );

    if (!medication) {
      throw new AppError(
        msg(
          "هذه الجرعة تم تسجيلها بالفعل أو غير موجودة",
          "This dose was already marked or not found",
        ),
        409,
      );
    }

    // ✅ Log to audit trail
    medication.auditTrail.push({
      action: "dose_taken",
      actor: patientId,
      timestamp: new Date(),
      details: { doseTime },
    });

    await medication.save();
    return medication;
  }

  /**
   * Mark dose as skipped
   */
  static async skipDose(medicationId, patientId, doseTime, reason = "") {
    const medication = await Medication.findOneAndUpdate(
      {
        _id: medicationId,
        patientId,
        dailyTracker: {
          $elemMatch: {
            status: "pending",
            time: doseTime,
          },
        },
      },
      {
        $set: {
          "dailyTracker.$.status": "skipped",
          "dailyTracker.$.updatedAt": new Date(),
        },
      },
      { new: true },
    );

    if (!medication) {
      throw new AppError(msg("الجرعة غير موجودة", "Dose not found"), 404);
    }

    // ✅ Log skip reason
    medication.auditTrail.push({
      action: "dose_skipped",
      actor: patientId,
      timestamp: new Date(),
      details: { doseTime, reason },
    });

    await medication.save();
    return medication;
  }

  /**
   * Update medication
   */
  static async updateMedication(medicationId, patientId, updateData) {
    // Prevent updating critical fields directly
    delete updateData.patientId;
    delete updateData.prescribedBy;
    delete updateData.auditTrail;

    const medication = await Medication.findOneAndUpdate(
      { _id: medicationId, patientId },
      updateData,
      { new: true, runValidators: true },
    );

    if (!medication) {
      throw new AppError(msg("غير موجود", "Not found"), 404);
    }

    // Log update
    medication.auditTrail.push({
      action: "updated",
      actor: patientId,
      timestamp: new Date(),
      details: Object.keys(updateData),
    });

    await medication.save();
    return medication;
  }

  /**
   * Delete medication (soft delete via isActive flag)
   */
  static async deleteMedication(medicationId, patientId) {
    const medication = await Medication.findOneAndUpdate(
      { _id: medicationId, patientId },
      { isActive: false },
      { new: true },
    );

    if (!medication) {
      throw new AppError(msg("غير موجود", "Not found"), 404);
    }

    medication.auditTrail.push({
      action: "deleted",
      actor: patientId,
      timestamp: new Date(),
      details: {},
    });

    await medication.save();
    return medication;
  }
}

export default MedicationService;
