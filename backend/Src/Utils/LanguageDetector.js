/**
 * LanguageDetector.js
 *
 * Utility for detecting and managing application language.
 * Supports multiple detection sources with priority-based fallback.
 *
 * Detection priority:
 * 1. User preferences (from authenticated user)
 * 2. Request headers ('language' header)
 * 3. Query parameters ('lang' parameter)
 * 4. Default ('ar' for Arabic)
 */

/**
 * Validates if a language code is supported.
 *
 * @param {string} lang - Language code to validate
 * @returns {boolean} True if supported
 */
const isSupportedLanguage = (lang) => {
  return ["en", "ar"].includes(lang);
};

/**
 * Detects the current language from multiple sources.
 * Uses priority: user preference > headers > query > default
 *
 * @param {Express.Request|Express.Response} reqOrRes - Request or Response object
 * @returns {string} Language code ('en' or 'ar')
 */
export const getLanguage = (reqOrRes) => {
  // Handle both Request and Response objects
  const req = reqOrRes.req || reqOrRes;

  if (!req) {
    return "ar"; // Fallback to Arabic
  }

  // Priority 1: User language preference (from authenticated user)
  if (req.user?.preferredLanguage) {
    const lang = req.user.preferredLanguage;
    if (isSupportedLanguage(lang)) return lang;
  }

  // Priority 2: req.lang set by middleware
  if (req.lang && isSupportedLanguage(req.lang)) {
    return req.lang;
  }

  // Priority 3: Request header 'language'
  const headerLang = req.headers?.language;
  if (headerLang && isSupportedLanguage(headerLang)) {
    return headerLang;
  }

  // Priority 4: Query parameter 'lang'
  const queryLang = req.query?.lang;
  if (queryLang && isSupportedLanguage(queryLang)) {
    return queryLang;
  }

  // Default fallback
  return "ar";
};

/**
 * Middleware to detect and set language on request object.
 * Called early in the middleware chain to set req.lang.
 *
 * @param {Express.Request} req - Express request
 * @param {Express.Response} res - Express response
 * @param {Function} next - Next middleware
 */
export const setLanguage = (req, res, next) => {
  req.lang = getLanguage(req);
  res.locals.lang = req.lang; // Also set in response locals for templates/consistency
  next();
};

/**
 * Utility to get localized string from a message object.
 * Falls back to Arabic if the requested language is unavailable.
 *
 * @param {string|object} messageObj - Message to localize
 * @param {string} lang - Desired language ('en' or 'ar')
 * @returns {string} Localized message string
 */
export const getLocalizedString = (messageObj, lang = "ar") => {
  if (typeof messageObj === "string") {
    return messageObj;
  }

  if (typeof messageObj === "object" && messageObj !== null) {
    const result =
      messageObj[lang] || messageObj["ar"] || messageObj["en"] || "";
    if (result) return result;
  }

  return String(messageObj || "");
};

export default {
  getLanguage,
  setLanguage,
  getLocalizedString,
  isSupportedLanguage,
};
