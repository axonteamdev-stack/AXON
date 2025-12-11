import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const generateTokenAndSetCookie = (res, usrrId, role) => {
  const token = jwt.sign({ id: usrrId, role: role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  return token;
};

export default generateTokenAndSetCookie;
