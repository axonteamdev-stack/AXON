import { getLanguage } from "../utils/i18n.js";

export const setLanguage = (req, res, next) => {
  const lang = getLanguage(req);
  req.lang = lang;
  res.locals.lang = lang;
  next();
};
