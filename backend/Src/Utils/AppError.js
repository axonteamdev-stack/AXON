import CustomAPIError from "../Error/CustomAPIError.js";
import { createErrorMessages } from "./ResponseHelper.js";
import { getLanguage, getLocalizedString } from "./LanguageDetector.js";

// --- Named Export: Async Catch Wrapper ---
export const catchAsync = (fn) => (req, res, next) => {
  fn(req, res, next).catch(next);
};

// --- Named Export: Success Response Handler ---
export const sendResponse = (res, statusCode, messageObj, data = null) => {
  const lang = getLanguage(res);
  const message = getLocalizedString(messageObj, lang);

  const responseObj = {
    status: "success",
    message: message,
  };

  if (data) {
    responseObj.data = data;
  }

  res.status(statusCode).json(responseObj);
};

// --- Default Export: The Main AppError Class ---
class AppError extends CustomAPIError {
  constructor(messageObj, statusCode) {
    // Convert various input types to bilingual message object
    const messages = createErrorMessages(messageObj);

    // Call parent constructor (using English as the fallback for internal logs)
    super(messages.en || "Error", statusCode);

    // This property is what the global error handler reads
    this.messages = messages;
  }
}

export default AppError;
