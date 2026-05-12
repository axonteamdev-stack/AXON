import AppError from "../utils/AppError.js";
import { getLocalizedString } from "../utils/i18n.js";

const parseError = (error, lang = "ar") => {
    const issue = error.issues?.[0];
    if (!issue) return "Validation error";
    return typeof issue.message === "object"
        ? issue.message[lang] || issue.message.ar || issue.message.en
        : issue.message;
};

export const validateBody = (schema) => (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
        return next(new AppError(parseError(result.error, req.lang), 400));
    }
    req.body = result.data;
    next();
};

export const validateQuery = (schema) => (req, res, next) => {
    const result = schema.safeParse(req.query);
    if (!result.success) {
        return next(new AppError(parseError(result.error, req.lang), 400));
    }
    req.parsedQuery = result.data;
    next();
};
