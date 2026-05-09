import AppError from "../utils/appError.js";
import { getLocalizedString } from "../utils/i18n.js";

const parseError = (error, lang = "ar") => {
  const issue = error.issues?.[0];
  if (!issue) return "Validation error";
  return typeof issue.message === "object"
    ? issue.message[lang] || issue.message.ar || issue.message.en
    : issue.message;
};

// For direct use in services/controllers
export const validate = (schema, data, lang = "ar") => {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new AppError(parseError(result.error, lang), 400);
  }
  return result.data;
};

// Express middleware for route validation
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
  req.parsedQuery = result.data;  // ✅ FIXED: was req.query = result.data
  next();
};
