export const setLanguage = (req, res, next) => {
  // Extracting the first 2 characters to handle 'en-US' or 'ar-EG'
  let lang = req.headers["accept-language"]?.substring(0, 2).toLowerCase();
  const supportedLanguages = ["en", "ar"];

  // Default to 'ar' (Arabic) as primary language if not provided or supported
  // This ensures consistency with error handlers and API design
  req.lang = supportedLanguages.includes(lang) ? lang : "ar";

  next();
};
