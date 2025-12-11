import jwt from "jsonwebtoken";
import Patient from "../models/PatientModel.js";
import Doctor from "../models/DoctorModel.js";
import dotenv from "dotenv";

dotenv.config();

// Placeholder for future use to protect routes
const protect = (allowedRoles) => async (req, res, next) => {
  let token;

  // 1. Check for token in cookies
  if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { id, role } = decoded;

    // 3. Check if user exists
    let user;
    if (role === "patient") {
      user = await Patient.findById(id).select("-password");
    } else if (role === "doctor") {
      user = await Doctor.findById(id).select("-password");
    }

    if (!user) {
      return res
        .status(401)
        .json({ message: "Not authorized, user not found" });
    }

    // 4. Check role authorization
    if (!allowedRoles.includes(role)) {
      return res.status(403).json({
        message:
          "Forbidden: You do not have the required role to access this resource.",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};

const authMiddleware = {
  protect,
  protectPatient: protect(["patient"]),
  protectDoctor: protect(["doctor"]),
  protectAny: protect(["patient", "doctor"]),
};

export default authMiddleware;
