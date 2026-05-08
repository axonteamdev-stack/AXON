export const SERVER_CONFIG = Object.freeze({
  PORT: Number(process.env.PORT) || 5000,
  SHUTDOWN_TIMEOUT_MS: 10_000,
  SERVER_TIMEOUT_MS: 30_000,
  KEEP_ALIVE_MS: 65_000,
});

export const APP_URL = process.env.APP_URL || `http://localhost:${SERVER_CONFIG.PORT}`;