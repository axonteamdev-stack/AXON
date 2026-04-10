import { getMessage } from "./Translations.js";
import CustomAPIError from "../Error/CustomErrorHandeler.js";

// --- Named Export: Async Catch Wrapper ---
export const catchAsync = (fn) => (req, res, next) => {
  fn(req, res, next).catch(next);
};

// --- Named Export: Success Response Handler ---
export const sendResponse = (res, statusCode, messageKey, data = null) => {
  const lang = res.req.lang || "ar";

  let message;
  if (typeof messageKey === "object" && messageKey.ar && messageKey.en) {
    message = messageKey[lang] || messageKey["ar"];
  } else if (typeof messageKey === "string") {
    message = getMessage(messageKey, lang);
  } else {
    message = messageKey;
  }

  res.status(statusCode).json({
    status: "success",
    message: message,
    ...(data && { data }),
  });
};

// --- Default Export: The Main AppError Class ---
class AppError extends CustomAPIError {
  constructor(messageKey, statusCode) {
    let messages;

    if (typeof messageKey === "object" && messageKey.ar && messageKey.en) {
      messages = messageKey;
    } else if (typeof messageKey === "string") {
      messages = {
        ar: getMessage(messageKey, "ar"),
        en: getMessage(messageKey, "en"),
      };
    } else {
      messages = {
        ar: messageKey,
        en: messageKey,
      };
    }

    // Call parent constructor (using English as the fallback for internal logs)
    super(messages.en || "Error", statusCode);

    // This property is what your app.js Global Error Handler reads
    this.messages = messages;
  }
}

export default AppError;
