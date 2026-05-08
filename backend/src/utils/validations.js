import AppError from "../Errors/appError.js";
import { HTTP_STATUS } from "../Constants/http.js";
import { getLocalizedString } from "../I18n/index.js";

export const parseValidationError = (error, lang = "ar") => {
  const issue = error.issues[0];
  return typeof issue.message === "object"
    ? issue.message[lang] || issue.message.ar
    : issue.message;
};

// ─── Direct validation (for service/controller use) ────────────────
export const validate = (schema, data, lang = "ar") => {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new AppError(parseValidationError(result.error, lang), HTTP_STATUS.BAD_REQUEST);
  }
  return result.data;
};

// ─── Express middleware validation (for routes) ────────────────────
export const validateBody = (schema, lang = "ar") => {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return next(new AppError(parseValidationError(result.error, lang), HTTP_STATUS.BAD_REQUEST));
    }
    req.body = result.data; // Replace with parsed/typed data
    next();
  };
};

export const validateData = (schema, data, lang = "ar") => {
  const result = schema.safeParse(data);
  if (result.success) {
    return { isValid: true, data: result.data };
  }
  const issue = result.error.issues[0];
  const message = typeof issue.message === "object"
    ? issue.message[lang] || issue.message.ar
    : issue.message;
  return { isValid: false, error: message };
};