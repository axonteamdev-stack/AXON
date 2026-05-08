const REQUIRED_ENV = [
  "NODE_ENV",
  "PORT",
  "MONGO_URI",
  "JWT_SECRET",
  "REFRESH_SECRET",
  "JWT_EXPIRES_IN",
  "REFRESH_EXPIRES_IN",
  "EMAIL_HOST",
  "EMAIL_USER",
  "EMAIL_PASS",
  "APP_URL",
  "LOG_LEVEL",
  "ALLOWED_ORIGINS",
];

export const validateEnvironment = () => {
  const missing = REQUIRED_ENV.filter((key) => !process.env[key]);
  if (missing.length) {
    throw new Error(`Missing environment variables: ${missing.join(", ")}`);
  }

  const jwtMinLength = Number(process.env.JWT_MIN_LENGTH) || 32;
  for (const secret of ["JWT_SECRET", "REFRESH_SECRET"]) {
    if (process.env[secret].length < jwtMinLength) {
      throw new Error(`${secret} must be at least ${jwtMinLength} characters`);
    }
  }
};

export const getEnv = (key, fallback) => process.env[key] || fallback;
