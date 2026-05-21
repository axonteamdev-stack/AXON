import Medication from "../models/Medication.js";
import DoseLog from "../models/DoseLog.js";
import AppError from "../utils/AppError.js";
import { msg } from "../utils/i18n.js";

const getTodayString = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
};

const buildTracker = (intakeTimes) =>
    intakeTimes.map((time) => ({
        time,
        status: "pending",
        updatedAt: null,
    }));

export const create = async (data) => {
    const medication = await Medication.create(data);

    // Create today's dose logs
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

export const getByPatient = async (patientId) => {
    const medications = await Medication.find({ patientId }).sort({
        createdAt: -1,
    });

    const today = getTodayString();
    const medicationsWithStatus = await Promise.all(
        medications.map(async (med) => {
            const doseLogs = await DoseLog.find({
                medicationId: med._id,
                date: today,
            }).lean();

            const stats = {
                total: doseLogs.length,
                pending: doseLogs.filter((d) => d.status === "pending").length,
                taken: doseLogs.filter((d) => d.status === "taken").length,
                skipped: doseLogs.filter((d) => d.status === "skipped").length,
            };

            return {
                ...med.toObject(),
                doseLogs,
                stats,
                isExpired: med.endDate < new Date(),
            };
        }),
    );

    return medicationsWithStatus;
};

export const getById = async (medicationId, patientId) => {
    const medication = await Medication.findOne({
        _id: medicationId,
        patientId,
    });
    if (!medication) {
        throw new AppError(
            msg("الدواء غير موجود", "Medication not found"),
            404,
        );
    }
    return medication;
};

export const update = async (medicationId, patientId, updateData) => {
    const protectedFields = ["patientId", "prescribedBy"];
    const sanitizedData = Object.fromEntries(
        Object.entries(updateData).filter(
            ([key]) => !protectedFields.includes(key),
        ),
    );

    const medication = await Medication.findOneAndUpdate(
        { _id: medicationId, patientId },
        sanitizedData,
        { new: true, runValidators: true },
    );

    if (!medication) {
        throw new AppError(
            msg("الدواء غير موجود", "Medication not found"),
            404,
        );
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
        throw new AppError(
            msg("الدواء غير موجود", "Medication not found"),
            404,
        );
    }

    return medication;
};

export const markDose = async (medicationId, patientId, time, status) => {
    const today = getTodayString();

    const doseLog = await DoseLog.findOneAndUpdate(
        {
            medicationId,
            patientId,
            date: today,
            time,
            status: "pending",
        },
        {
            status,
            updatedAt: new Date(),
        },
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
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    const pendingDoses = await DoseLog.find({
        patientId,
        date: today,
        status: "pending",
    }).populate("medicationId", "medicineName dosage");

    return pendingDoses.filter((dose) => {
        const [hour, minute] = dose.time.split(":").map(Number);
        return (
            hour < currentHour ||
            (hour === currentHour && minute <= currentMinute)
        );
    });
};

// DEAD CODE FLAG
/*
export const resetDailyDoses = async () => {
    const today = getTodayString();
    const medications = await Medication.find({
        isActive: true,
        endDate: { $gt: new Date() },
    });

    let createdCount = 0;
    for (const med of medications) {
        const existing = await DoseLog.findOne({
            medicationId: med._id,
            date: today,
        });

        if (!existing) {
            const doseLogs = med.intakeTimes.map((time) => ({
                patientId: med.patientId,
                medicationId: med._id,
                date: today,
                time,
                status: "pending",
            }));
            await DoseLog.insertMany(doseLogs);
            createdCount += doseLogs.length;
        }
    }

    return { createdCount };
};
*/
