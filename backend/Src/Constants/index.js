/**
 * Global Constants for AXON Medical Backend
 * Single source of truth for all magic strings and configuration values
 */

export const ROLES = {
  PATIENT: "patient",
  DOCTOR: "doctor",
  ADMIN: "admin",
};

export const STATUS = {
  SUCCESS: "success",
  FAIL: "fail",
  ERROR: "error",
};

export const VISIBILITY = {
  PUBLIC: "public",
  FOLLOWERS: "followers",
  PRIVATE: "private",
};

export const GENDER = {
  MALE: "Male",
  FEMALE: "Female",
};

export const BLOOD_TYPES = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export const FILE_LIMITS = {
  CERTIFICATE: 5 * 1024 * 1024, // 5MB
  IMAGE: 3 * 1024 * 1024, // 3MB
  MAX_RADIOLOGY_IMAGES: 10,
  MAX_LAB_IMAGES: 10,
  MAX_POST_IMAGES: 10,
  MAX_TAGS: 10,
  MAX_MEDICAL_TESTS: 100,
};

export const FILE_CONFIG = {
  ALLOWED_EXTENSIONS: [".jpg", ".jpeg", ".png", ".gif", ".webp"],
  VALID_FOLDERS: [
    "PersonalPhoto",
    "Radiology",
    "LabTests",
    "Certificates",
    "Posts",
  ],
  UPLOAD_BASE_PATH: "Uploads",
};

export const PASSWORD_RESET = {
  EXPIRY_MINUTES: 15,
  TOKEN_LENGTH: 32,
};

export const JWT_CONFIG = {
  ACCESS_EXPIRY: "15m",
  REFRESH_EXPIRY: "7d",
  MIN_SECRET_LENGTH: 32,
};

export const RATE_LIMIT = {
  AUTH: {
    MAX_ATTEMPTS: 5,
    WINDOW_MINUTES: 15,
    MESSAGE: "Too many login attempts, please try again later",
  },
  API: {
    MAX_REQUESTS: 100,
    WINDOW_HOURS: 1,
    MESSAGE: "Too many requests from this IP, please try again in an hour",
  },
};

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
  MIN_LIMIT: 1,
};

export const SORT_FIELDS = {
  RECENT: "recent",
  TRENDING: "trending",
  POPULAR: "popular",
};

export const ERROR_MESSAGES = {
  INVALID_EMAIL: "Invalid email format",
  INVALID_FILE: "File type not allowed",
  PATH_TRAVERSAL: "Path traversal detected",
  INSUFFICIENT_PERMISSIONS: "Insufficient permissions",
  RESOURCE_NOT_FOUND: "Resource not found",
  DUPLICATE_RESOURCE: "Resource already exists",
  VALIDATION_ERROR: "Validation error",
  INTERNAL_ERROR: "Internal server error",
};

export const REGEX_PATTERNS = {
  EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  PHONE: /^\d{7,}$/,
  STRONG_PASSWORD:
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
};

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
};

export const FREQUENCY_OPTIONS = [
  "once daily",
  "twice daily",
  "three times daily",
];
