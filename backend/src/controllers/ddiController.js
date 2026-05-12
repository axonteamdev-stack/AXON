import { catchAsync } from "../utils/catchAsync.js";
import { sendResponse } from "../utils/response.js";
import { msg } from "../utils/i18n.js";
import * as DDIService from "../services/ddiService.js";

export const checkInteractions = catchAsync(async (req, res) => {
    const { newMedicationName } = req.body;
    const result = await DDIService.checkDrugInteractions(
        req.user.id,
        newMedicationName,
    );
    sendResponse(res, 200, msg("تم فحص التفاعلات", "Interactions checked"), {
        result,
    });
});

export const checkContraindications = catchAsync(async (req, res) => {
    const { medicineName } = req.body;
    const result = await DDIService.checkContraindications(
        req.user.id,
        medicineName,
    );
    sendResponse(res, 200, msg("تم فحص الموانع", "Contraindications checked"), {
        result,
    });
});
