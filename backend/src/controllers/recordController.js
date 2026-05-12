import { catchAsync } from "../utils/catchAsync.js";
import { sendResponse } from "../utils/response.js";
import { msg } from "../utils/i18n.js";
import { moveFromTemp, cleanupTemp } from "../middlewares/upload.js";
import * as recordService from "../services/recordService.js";

export const getMyRecord = catchAsync(async (req, res) => {
    const record = await recordService.getByPatient(req.user.id);
    sendResponse(
        res,
        200,
        msg("تم جلب السجل الطبي", "Medical record fetched"),
        { record },
    );
});

export const updateRecord = catchAsync(async (req, res) => {
    const record = await recordService.update(req.user.id, req.body);
    sendResponse(
        res,
        200,
        msg("تم تحديث السجل الطبي", "Medical record updated"),
        { record },
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
            const { url } = moveFromTemp(
                radiologyFile.filename,
                "radiologyImage",
            );
            testData.image = url;
        } else if (type === "lab" && labFile) {
            const { url } = moveFromTemp(labFile.filename, "labImage");
            testData.image = url;
        }

        const record = await recordService.addTest(req.user.id, type, testData);
        sendResponse(res, 200, msg("تم إضافة التحليل", "Test added"), {
            record,
        });
    } catch (err) {
        cleanupTemp(req.files);
        throw err;
    }
});

export const generateQR = catchAsync(async (req, res) => {
    const qr = await recordService.generateQR(req.user.id);
    sendResponse(res, 200, msg("تم إنشاء رمز QR", "QR code generated"), { qr });
});

export const getByQR = catchAsync(async (req, res) => {
    const record = await recordService.getByQR(req.params.token);
    sendResponse(
        res,
        200,
        msg("تم جلب السجل الطبي", "Medical record fetched"),
        { record },
    );
});
