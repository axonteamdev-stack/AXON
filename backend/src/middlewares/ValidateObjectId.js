import mongoose from "mongoose";
import AppError from "../utils/AppError.js";
import { msg } from "../utils/i18n.js";

export const validateObjectId =
    (paramName = "id") =>
    (req, res, next) => {
        const id = req.params[paramName];
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return next(
                new AppError(
                    msg("المعرف غير صالح", `Invalid ${paramName}`),
                    400,
                ),
            );
        }
        next();
    };
