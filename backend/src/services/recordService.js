import Patient from "../models/Patient.js";
import AppError from "../utils/AppError.js";
import { msg } from "../utils/i18n.js";
import crypto from "crypto";
import QRCode from "qrcode";
import { logger } from "../config/logger.js";

const QR_EXPIRY_MS = 24 * 60 * 60 * 1000;

export const generateQR = async (patientId) => {
  const patient = await Patient.findOne({ userId: patientId }).lean();
  if (!patient) {
    throw new AppError(
      msg("السجل الطبي غير موجود", "Medical record not found"),
      404,
    );
  }

  const token = crypto.randomBytes(32).toString("hex");
  const pin = crypto.randomInt(1000, 10000).toString();
  const expiresAt = new Date(Date.now() + QR_EXPIRY_MS);

  const vitalsPayload = [
    patient.bloodType || "Unknown",
    (patient.conditions || []).join(","),
    (patient.allergies || []).join(","),
  ].join("|");

  const encodedVitals = Buffer.from(vitalsPayload, "utf-8")
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  const baseUrl = process.env.APP_URL || "http://localhost:3000";
  const qrUrl = `${baseUrl}/records/emergency/${token}?data=${encodedVitals}`;

  await Patient.findOneAndUpdate(
    { userId: patientId },
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

  const qrCode = await QRCode.toDataURL(qrUrl, {
    width: 300,
    errorCorrectionLevel: "M",
  });

  return { qrCode, pin, expiresAt };
};

export const getByQRDirect = async (tokenParam, clientIp) => {
  const record = await Patient.findOneAndUpdate(
    { "emergencyQR.token": tokenParam },
    {
      $set: { "emergencyQR.usedAt": new Date() },
      $push: {
        "emergencyQR.accessLog": {
          accessedAt: new Date(),
          ip: clientIp || null,
        },
      },
    },
    { new: true },
  ).populate("userId", "fullName phoneNumber gender");

  if (!record) {
    throw new AppError(
      msg("السجل الطبي غير موجود", "Medical record not found"),
      404,
    );
  }

  const cleanRecord = record.toObject();
  if (cleanRecord.emergencyQR) {
    delete cleanRecord.emergencyQR.pin;
    delete cleanRecord.emergencyQR.token;
  }

  return cleanRecord;
};
