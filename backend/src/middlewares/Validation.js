// validation.js - Unified validation helper
import AppError from "../Errors/appError.js";
import { msg } from "../I18n/index.js";
import { HTTP_STATUS } from "../Constants/index.js";

export const validateSchema = (schema, data) => {
  const result = schema.safeParse(data);
  if (!result.success) {
    const message = extractErrorMessage(result.error);
    throw new AppError(message, HTTP_STATUS.BAD_REQUEST);
  }
  return result.data;
};

const extractErrorMessage = (error) => {
  const issue = error.issues?.[0];
  if (!issue) return msg("خطأ في التحقق", "Validation error");

  if (typeof issue.message === "object") {
    return (
      issue.message.ar ||
      issue.message.en ||
      msg("خطأ في التحقق", "Validation error")
    );
  }
  return issue.message;
};
