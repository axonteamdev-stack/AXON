import { logger } from "../config/logger.js";
import { getLanguage, getLocalizedString } from "../utils/i18n.js";

export const errorHandler = (err, req, res, _next) => {
  const statusCode = err.statusCode || 500;
  const status = err.status || "error";
  const lang = getLanguage(req);
  const message = getLocalizedString(err.messages || err.message, lang);

  // Log operational errors in production, all errors in dev
  if (process.env.NODE_ENV === "production") {
    if (!err.isOperational || statusCode >= 500) {
      logger.error({
        statusCode,
        message: err.message,
        url: req.originalUrl,
        method: req.method,
        requestId: req.requestId,
        stack: err.stack,
      }, "Production Error");
    }
  } else {
    logger.error({ err: err.message, stack: err.stack }, "Development Error");
  }

  res.status(statusCode).json({
    status,
    message,
    ...(process.env.NODE_ENV === "development" && {
      stack: err.stack,
      error: err,
    }),
  });
};
