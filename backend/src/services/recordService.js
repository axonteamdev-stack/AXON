import MedicalRecord from "../models/MedicalRecord.js";
import AppError from "../utils/AppError.js";
import { msg } from "../utils/i18n.js";
import crypto from "crypto";
import QRCode from "qrcode";

export const getOrCreate = async (patientId) => {
    let record = await MedicalRecord.findOne({ patientId });
    if (!record) {
        record = await MedicalRecord.create({ patientId });
    }
    return record;
};

export const getByPatient = async (patientId) => {
    const record = await MedicalRecord.findOne({ patientId }).lean();
    if (!record) {
        throw new AppError(
            msg("السجل الطبي غير موجود", "Medical record not found"),
            404,
        );
    }
    return record;
};

export const update = async (patientId, updateData) => {
    const allowedFields = [
        "bloodType",
        "height",
        "weight",
        "conditions",
        "allergies",
    ];
    const update = {};

    allowedFields.forEach((field) => {
        if (updateData[field] !== undefined) update[field] = updateData[field];
    });

    if (Object.keys(update).length === 0) {
        throw new AppError(
            msg("لا توجد بيانات للتحديث", "No data to update"),
            400,
        );
    }

    const record = await MedicalRecord.findOneAndUpdate(
        { patientId },
        { $set: update },
        { new: true, upsert: true },
    );

    return record;
};

export const addTest = async (patientId, type, testData) => {
    const field = type === "radiology" ? "radiologyTests" : "labTests";
    const record = await MedicalRecord.findOneAndUpdate(
        { patientId },
        { $push: { [field]: testData } },
        { new: true, upsert: true },
    );

    return record;
};

export const generateQR = async (patientId) => {
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await MedicalRecord.findOneAndUpdate(
        { patientId },
        {
            $set: {
                "emergencyQR.token": token,
                "emergencyQR.expiresAt": expiresAt,
            },
        },
    );

    const qrCode = await QRCode.toDataURL(token, {
        width: 300,
        errorCorrectionLevel: "M",
    });

    return { qrCode, expiresAt };
};

export const getByQR = async (token) => {
    const record = await MedicalRecord.findOne({
        "emergencyQR.token": token,
        "emergencyQR.expiresAt": { $gt: new Date() },
    }).populate("patientId", "fullName phoneNumber gender");

    if (!record) {
        throw new AppError(
            msg("رمز QR غير صالح أو منتهي", "Invalid or expired QR code"),
            404,
        );
    }

    return record;
};
