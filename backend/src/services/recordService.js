import MedicalRecord from "../models/MedicalRecord.js";
import AppError from "../utils/AppError.js";
import { msg } from "../utils/i18n.js";
import crypto from "crypto";
import QRCode from "qrcode";
import { logger } from "../config/logger.js";

const QR_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours

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
    throw new AppError(msg("لا توجد بيانات للتحديث", "No data to update"), 400);
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
  const pin = crypto.randomInt(1000, 10000).toString(); // 4-digit PIN
  const expiresAt = new Date(Date.now() + QR_EXPIRY_MS);

  await MedicalRecord.findOneAndUpdate(
    { patientId },
    {
      $set: {
        "emergencyQR.token": token,
        "emergencyQR.pin": crypto
          .createHash("sha256")
          .update(pin)
          .digest("hex"),
        "emergencyQR.expiresAt": expiresAt,
        "emergencyQR.usedAt": null,
        "emergencyQR.accessLog": [],
      },
    },
  );

  const qrCode = await QRCode.toDataURL(`${token}:${pin}`, {
    width: 300,
    errorCorrectionLevel: "M",
  });

  // Return PIN separately (show to user, not in QR)
  return { qrCode, pin, expiresAt };
};

export const getByQR = async (token, pin, clientIp) => {
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

  // Verify PIN
  const hashedPin = crypto.createHash("sha256").update(pin).digest("hex");
  if (record.emergencyQR.pin !== hashedPin) {
    throw new AppError(msg("رمز PIN غير صحيح", "Invalid PIN"), 401);
  }

  // Check if already used (one-time use)
  if (record.emergencyQR.usedAt) {
    throw new AppError(
      msg("رمز QR تم استخدامه بالفعل", "QR code already used"),
      410,
    );
  }

  // Mark as used
  record.emergencyQR.usedAt = new Date();

  // Log access with IP
  record.emergencyQR.accessLog.push({
    accessedAt: new Date(),
    ip: clientIp || null,
  });

  await record.save();

  logger.info(
    {
      patientId: record.patientId?._id,
      token: token.substring(0, 8) + "...",
    },
    "Emergency QR accessed",
  );

  return record;
};
