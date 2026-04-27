/**
 * ResponseHelper.js
 *
 * Centralized utility for handling inline, localized API responses.
 * Supports dual-language (EN/AR) messages defined directly in controllers/services.
 *
 * Example usage:
 * const message = { en: "Success", ar: "نجح" };
 * sendResponse(res, 200, message, { userId: 123 });
 */

import { getLanguage } from "./LanguageDetector.js";

/**
 * Resolves a message object to a string based on detected language.
 *
 * @param {string|object} messageObj - Message to resolve. Can be:
 *   - String: returned as-is
 *   - Object with { en, ar }: resolved based on language
 *   - Other: converted to string
 * @param {string} lang - Language preference ('en' or 'ar'). Default is 'ar'
 * @returns {string} Resolved message
 */
const resolveMessage = (messageObj, lang = "ar") => {
  if (typeof messageObj === "string") {
    return messageObj;
  }

  if (typeof messageObj === "object" && messageObj !== null) {
    if (messageObj.en && messageObj.ar) {
      return messageObj[lang] || messageObj["ar"];
    }
  }

  return String(messageObj);
};

/**
 * Sends a standardized success response.
 * Automatically detects language from request.
 *
 * @param {Express.Response} res - Express response object
 * @param {number} statusCode - HTTP status code (default: 200)
 * @param {string|object} message - Message object or string
 * @param {*} data - Optional response data
 */
export const sendResponse = (res, statusCode = 200, message, data = null) => {
  const lang = getLanguage(res);
  const resolvedMessage = resolveMessage(message, lang);
  const isSuccess = statusCode >= 200 && statusCode < 300;

  const responseObj = {
    status: isSuccess ? "success" : "fail",
    message: resolvedMessage,
  };

  if (data !== null) {
    responseObj.data = data;
  }

  res.status(statusCode).json(responseObj);
};

/**
 * Sends an error response.
 * Automatically detects language from request.
 *
 * @param {Express.Response} res - Express response object
 * @param {number} statusCode - HTTP status code (default: 400)
 * @param {string|object} message - Message object or string
 * @param {*} data - Optional error details
 */
export const sendErrorResponse = (
  res,
  statusCode = 400,
  message,
  data = null,
) => {
  const lang = getLanguage(res);
  const resolvedMessage = resolveMessage(message, lang);
  const isClientError = statusCode >= 400 && statusCode < 500;

  const responseObj = {
    status: isClientError ? "fail" : "error",
    message: resolvedMessage,
  };

  if (data !== null) {
    responseObj.data = data;
  }

  res.status(statusCode).json(responseObj);
};

/**
 * Helper function to create bilingual message objects inline.
 * Reduces boilerplate when defining messages in controllers.
 *
 * @param {string} ar - Arabic message
 * @param {string} en - English message
 * @returns {object} Message object { ar, en }
 *
 * Example:
 * const msg = msg("تم بنجاح", "Success");
 */
export const msg = (ar, en) => ({ ar, en });

/**
 * Creates a custom error response compatible with global error handler.
 * This is used within AppError class.
 *
 * @param {string|object} messageObj - Message to error
 * @returns {object} Messages object with ar and en properties
 */
export const createErrorMessages = (messageObj) => {
  if (typeof messageObj === "object" && messageObj.ar && messageObj.en) {
    return messageObj;
  }

  if (typeof messageObj === "string") {
    return { ar: messageObj, en: messageObj };
  }

  return { ar: String(messageObj), en: String(messageObj) };
};

export default {
  sendResponse,
  sendErrorResponse,
  msg,
  resolveMessage,
  createErrorMessages,
};
