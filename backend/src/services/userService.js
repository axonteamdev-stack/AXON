import User from "../models/User.js";
import AppError from "../utils/AppError.js";

// ── Doctors ────────────────────────────────
export const getAllDoctors = async (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;

  const [doctors, total] = await Promise.all([
    User.find({ role: "doctor", isVerified: true })
      .select("fullName personalPhoto doctorProfile rating")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    User.countDocuments({ role: "doctor", isVerified: true }),
  ]);

  return {
    doctors,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

export const getDoctorDetails = async (doctorId) => {
  const doctor = await User.findOne({
    _id: doctorId,
    role: "doctor",
    isVerified: true,
  })
    .select("-password -passwordResetToken -passwordResetExpires")
    .lean();

  if (!doctor) throw new AppError("Doctor not found", 404);

  return doctor;
};

export const searchDoctors = async (
  keyword,
  specialization,
  page = 1,
  limit = 10,
) => {
  const skip = (page - 1) * limit;
  const query = { role: "doctor", isVerified: true };

  if (specialization) {
    query["doctorProfile.specialization"] = new RegExp(specialization, "i");
  }

  if (keyword) {
    query.$or = [
      { fullName: new RegExp(keyword, "i") },
      { "doctorProfile.specialization": new RegExp(keyword, "i") },
    ];
  }

  const [doctors, total] = await Promise.all([
    User.find(query)
      .select("fullName personalPhoto doctorProfile rating")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    User.countDocuments(query),
  ]);

  return {
    doctors,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

// ── Profile ────────────────────────────────
export const getUserProfile = async (userId) => {
  const user = await User.findById(userId)
    .select("-password -passwordResetToken -passwordResetExpires")
    .lean();

  if (!user) throw new AppError("User not found", 404);

  return user;
};

export const updateProfile = async (userId, data) => {
  const user = await User.findByIdAndUpdate(
    userId,
    { $set: data },
    { new: true, runValidators: true },
  ).select("-password -passwordResetToken -passwordResetExpires");

  if (!user) throw new AppError("User not found", 404);

  return user;
};

// ❌ Follow services REMOVED — no follow system for any users
