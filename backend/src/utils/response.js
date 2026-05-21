import { getLocalizedString } from "./i18n.js";

// DEAD CODE FLAG (export was unused)
const sendResponse = (res, statusCode, message, data = null) => {
  const response = {
    success: statusCode < 400,
    message,
  };

  if (data !== null) {
    response.data = data;
  }

  res.status(statusCode).json(response);
};

// Use this when message is a msg() object {ar, en}
export const sendLocalizedResponse = (
  res,
  statusCode,
  messageObj,
  data = null,
  lang = "ar",
) => {
  const resolvedMessage = getLocalizedString(messageObj, lang);
  sendResponse(res, statusCode, resolvedMessage, data);
};
