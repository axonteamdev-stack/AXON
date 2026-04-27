/**
 * Language Detection Middleware
 * Detects the client's preferred language from request headers or defaults to Arabic.
 *
 * Request header: 'language' (en or ar)
 * Sets: req.lang for use in controllers/services
 */
import { setLanguage as detectLanguage } from "../Utils/LanguageDetector.js";

export const setLanguage = detectLanguage;
