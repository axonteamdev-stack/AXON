import { getLanguage, getLocalizedString } from "./i18n.js";

const buildResponse = (status, message, data) => ({
  status,
  message,
  ...(data !== null && data !== undefined && { data }),
});

export const sendResponse = (res, statusCode = 200, message, data = null) => {
  const lang = getLanguage(res);
  const resolved = getLocalizedString(message, lang);
  const status = statusCode >= 200 && statusCode < 300 ? "success" : "fail";
  res.status(statusCode).json(buildResponse(status, resolved, data));
};
