import jwt from "jsonwebtoken";

/** Shared defaults so login refresh and logout clear cookies consistently */
export const authCookieDefaults = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "Strict",
};

export const generateTokens = (res, userId) => {
  if (!process.env.JWT_SECRET || !process.env.REFRESH_SECRET) {
    throw new Error("Missing JWT_SECRET or REFRESH_SECRET in .env");
  }

  const accessToken = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "15m",
  });

  const refreshToken = jwt.sign({ id: userId }, process.env.REFRESH_SECRET, {
    expiresIn: process.env.REFRESH_EXPIRES_IN || "7d",
  });

  const refreshCookieOptions = {
    ...authCookieDefaults,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  };

  res.cookie("jwt", accessToken, {
    ...authCookieDefaults,
    maxAge: 15 * 60 * 1000, // 15 minutes
  });

  res.cookie("refreshToken", refreshToken, refreshCookieOptions);

  return { accessToken, refreshToken };
};
