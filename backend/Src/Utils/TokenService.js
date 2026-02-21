import jwt from "jsonwebtoken";

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

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  };

  res.cookie("jwt", accessToken, {
    ...cookieOptions,
    maxAge: 15 * 60 * 1000, // 15 minutes
  });

  res.cookie("refreshToken", refreshToken, cookieOptions);

  return { accessToken, refreshToken };
};
