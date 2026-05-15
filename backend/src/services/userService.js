import User from "../models/User.js";
import MedicalRecord from "../models/MedicalRecord.js";
import Medication from "../models/Medication.js";
import Appointment from "../models/Appointment.js";
import Post from "../models/Post.js";
import Like from "../models/Like.js";
import Comment from "../models/Comment.js";
import AppError from "../utils/AppError.js";
import { transformUserResponse } from "../utils/transformers.js";

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
    doctors: doctors.map(transformUserResponse),
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

  return transformUserResponse(doctor);
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
    doctors: doctors.map(transformUserResponse),
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

  return transformUserResponse(user);
};

// ── Full Profile with all related data ─────
export const getFullUserProfile = async (userId) => {
  const user = await User.findById(userId)
    .select("-password -passwordResetToken -passwordResetExpires")
    .lean();

  if (!user) throw new AppError("User not found", 404);

  const isPatient = user.role === "patient";
  const isDoctor = user.role === "doctor";

  // Common data for all users
  const [postsCount, likesCount, commentsCount] = await Promise.all([
    Post.countDocuments({ author: userId, isDeleted: { $ne: true } }),
    Like.countDocuments({ user: userId }),
    Comment.countDocuments({ author: userId, isDeleted: { $ne: true } }),
  ]);

  const result = {
    ...transformUserResponse(user),
    stats: {
      postsCount,
      likesCount,
      commentsCount,
    },
  };

  // Patient-specific data
  if (isPatient) {
    const [
      medicalRecord,
      medications,
      appointments,
      upcomingAppointments,
      pendingAppointments,
    ] = await Promise.all([
      MedicalRecord.findOne({ patientId: userId }).lean(),
      Medication.find({ patientId: userId, isActive: true })
        .sort({ createdAt: -1 })
        .lean(),
      Appointment.find({ patient: userId })
        .populate(
          "doctor",
          "fullName personalPhoto doctorProfile.specialization",
        )
        .sort({ createdAt: -1 })
        .limit(10)
        .lean(),
      Appointment.countDocuments({
        patient: userId,
        status: { $in: ["pending", "accepted"] },
        scheduledAt: { $gte: new Date() },
      }),
      Appointment.countDocuments({
        patient: userId,
        status: "pending",
      }),
    ]);

    result.medicalRecord = medicalRecord;
    result.medications = medications;
    result.appointments = appointments;
    result.stats.upcomingAppointments = upcomingAppointments;
    result.stats.pendingAppointments = pendingAppointments;
  }

  // Doctor-specific data
  if (isDoctor) {
    const [
      articles,
      articlesCount,
      totalViews,
      doctorAppointments,
      pendingRequests,
      completedAppointments,
    ] = await Promise.all([
      Post.find({ author: userId, type: "article", isDeleted: { $ne: true } })
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),
      Post.countDocuments({
        author: userId,
        type: "article",
        isDeleted: { $ne: true },
      }),
      Post.aggregate([
        {
          $match: { author: userId, type: "article", isDeleted: { $ne: true } },
        },
        { $group: { _id: null, totalViews: { $sum: "$views" } } },
      ]),
      Appointment.find({ doctor: userId })
        .populate("patient", "fullName personalPhoto")
        .sort({ createdAt: -1 })
        .limit(10)
        .lean(),
      Appointment.countDocuments({ doctor: userId, status: "pending" }),
      Appointment.countDocuments({ doctor: userId, status: "completed" }),
    ]);

    result.articles = articles;
    result.stats.articlesCount = articlesCount;
    result.stats.totalViews = totalViews[0]?.totalViews || 0;
    result.appointments = doctorAppointments;
    result.stats.pendingRequests = pendingRequests;
    result.stats.completedAppointments = completedAppointments;
  }

  return result;
};

export const updateProfile = async (userId, data) => {
  const user = await User.findByIdAndUpdate(
    userId,
    { $set: data },
    { new: true, runValidators: true },
  ).select("-password -passwordResetToken -passwordResetExpires");

  if (!user) throw new AppError("User not found", 404);

  return transformUserResponse(user);
};

// ❌ Follow services REMOVED — no follow system for any users
