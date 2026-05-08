const SUPPORTED_LANGUAGES = Object.freeze(["en", "ar"]);
const DEFAULT_LANGUAGE = "ar";

export const isSupportedLanguage = (lang) => SUPPORTED_LANGUAGES.includes(lang);

export const getLanguage = (reqOrRes) => {
  const req = reqOrRes?.req || reqOrRes;
  if (!req) return DEFAULT_LANGUAGE;

  const sources = [
    req.user?.preferredLanguage,
    req.lang,
    req.headers?.language,
    req.query?.lang,
  ];

  for (const lang of sources) {
    if (lang && isSupportedLanguage(lang)) return lang;
  }
  return DEFAULT_LANGUAGE;
};

export const setLanguage = (req, res, next) => {
  const lang = getLanguage(req);
  req.lang = lang;
  res.locals.lang = lang;
  next();
};

export const getLocalizedString = (messageObj, lang = DEFAULT_LANGUAGE) => {
  if (typeof messageObj === "string") return messageObj;
  if (messageObj && typeof messageObj === "object") {
    return messageObj[lang] || messageObj.ar || messageObj.en || "";
  }
  return String(messageObj ?? "");
};

export const msg = (ar, en) => ({ ar, en });

export const createErrorMessages = (messageObj) => {
  if (messageObj?.ar && messageObj?.en) return messageObj;
  const str = String(messageObj ?? "");
  return { ar: str, en: str };
};
