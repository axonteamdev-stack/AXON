export const COOKIE_NAMES = Object.freeze({
  ACCESS: "accessToken",
  REFRESH: "refreshToken",
});

export const cookieDefaults = Object.freeze({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "Strict",
});
