import { catchAsync } from "../utils/catchAsync.js";
import { sendLocalizedResponse } from "../utils/response.js";
import { msg } from "../utils/i18n.js";
import AppError from "../utils/AppError.js";
import { moveFromTemp, cleanupTemp } from "../middlewares/upload.js";
import * as recordService from "../services/recordService.js";
import fs from "fs";
import path from "path";

// Helper: rollback moved files
const rollbackMovedFiles = (testData) => {
  const filesToDelete = [testData.image].filter(Boolean);
  for (const filePath of filesToDelete) {
    try {
      const fullPath = path.join(process.cwd(), filePath.replace(/^\//, ""));
      if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
    } catch {
      /* ignore */
    }
  }
};

export const getMyRecord = catchAsync(async (req, res) => {
  const record = await recordService.getByPatient(req.user.id);
  sendLocalizedResponse(
    res,
    200,
    msg("تم جلب السجل الطبي", "Medical record fetched"),
    { record },
    req.lang,
  );
});

export const updateRecord = catchAsync(async (req, res) => {
  const record = await recordService.update(req.user.id, req.body);
  sendLocalizedResponse(
    res,
    200,
    msg("تم تحديث السجل الطبي", "Medical record updated"),
    { record },
    req.lang,
  );
});

export const addTest = catchAsync(async (req, res) => {
  const { type } = req.params;
  const testData = {
    description: req.body.description,
    date: new Date(),
  };

  const radiologyFile = req.files?.radiologyImage?.[0];
  const labFile = req.files?.labImage?.[0];

  try {
    if (type === "radiology" && radiologyFile) {
      const { url } = moveFromTemp(radiologyFile.filename, "radiologyImage");
      testData.image = url;
    } else if (type === "lab" && labFile) {
      const { url } = moveFromTemp(labFile.filename, "labImage");
      testData.image = url;
    }

    const record = await recordService.addTest(req.user.id, type, testData);
    sendLocalizedResponse(
      res,
      200,
      msg("تم إضافة التحليل", "Test added"),
      { record },
      req.lang,
    );
  } catch (err) {
    rollbackMovedFiles(testData);
    cleanupTemp(req.files);
    throw err;
  }
});

export const generateQR = catchAsync(async (req, res) => {
  const { qrCode, pin, expiresAt } = await recordService.generateQR(
    req.user.id,
  );
  sendLocalizedResponse(
    res,
    200,
    msg("تم إنشاء رمز QR", "QR code generated"),
    { qrCode, pin, expiresAt },
    req.lang,
  );
});

export const getByQR = catchAsync(async (req, res) => {
  const { token, pin } = req.body;

  if (!token || !pin) {
    throw new AppError(
      msg("يرجى إدخال رمز QR و PIN", "Please provide QR token and PIN"),
      400,
    );
  }

  const record = await recordService.getByQR(token, pin, req.ip);
  sendLocalizedResponse(
    res,
    200,
    msg("تم جلب السجل الطبي", "Medical record fetched"),
    { record },
    req.lang,
  );
});
