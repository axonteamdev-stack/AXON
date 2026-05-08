import mongoose from "mongoose";
import User from "../models/userModel.js";
import {
  processRadiologyTests,
  processLabTests,
  saveFile,
  deleteFile,
  cleanupFiles,
} from "./fileService.js";
import AppError from "../utils/appError.js";
import { msg } from "../utils/i18n.js";
import { escapeRegex } from "../utils/sanitize.js";
import { safeParse } from "../utils/parsing.js";

const MAX_SEARCH_LIMIT = 50;
const MAX_MEDICAL_TESTS = 50;

const buildPagination = (page, limit) => ({
  skip: (page - 1) * limit,
  limit: Math.min(limit, MAX_SEARCH_LIMIT),
});

const validateEmailUnique = async (email) => {
  const existing = await User.findOne({ email: email.toLowerCase() }).lean();
  if (existing) {
    throw new AppError(msg("البريد الإلكتروني مسجل بالفعل", "Email already registered"), 400);
  }
};

const collectSavedFiles = (tests, savedFiles) => {
  tests.forEach((test) => {
    if (test.image) savedFiles.push(test.image);
  });
  return tests;
};

export const createPatient = async (userData, files) => {
  if (!userData.email || !userData.password) {
    throw new AppError(msg("يرجى إدخال البريد وكلمة المرور", "Please enter email and password"), 400);
  }
  await validateEmailUnique(userData.email);

  const savedFiles = [];
  try {
    const personalPhoto = files?.personalPhoto?.[0]
      ? await saveFile(files.personalPhoto[0], "personalPhoto", "patient")
      : null;
    if (personalPhoto) savedFiles.push(personalPhoto);

    const radiologyTests = collectSavedFiles(
      await processRadiologyTests(files?.radiologyImage, userData.radiologyDescription),
      savedFiles
    );
    const labTests = collectSavedFiles(
      await processLabTests(files?.labImage, userData.labDescription),
      savedFiles
    );

    return await User.create({
      fullName: userData.fullName,
      email: userData.email.toLowerCase(),
      password: userData.password,
      phoneNumber: userData.phoneNumber,
      gender: userData.gender,
      role: "patient",
      isVerified: true,
      personalPhoto,
      medicalProfile: {
        bloodType: userData.bloodType || null,
        height: userData.height || null,
        weight: userData.weight || null,
        conditions: safeParse(userData.conditions) || [],
        allergies: safeParse(userData.allergies) || [],
        radiologyTests,
        labTests,
      },
    });
  } catch (err) {
    await cleanupFiles(savedFiles);
    throw err;
  }
};

export const createDoctor = async (userData, files) => {
  if (!userData.email || !userData.password) {
    throw new AppError(msg("يرجى إدخال البريد وكلمة المرور", "Please enter email and password"), 400);
  }
  await validateEmailUnique(userData.email);

  if (!files?.licenseImage?.[0]) {
    throw new AppError(msg("صورة ترخيص المزاولة مطلوبة للطبيب", "License image required"), 400);
  }

  const savedFiles = [];
  try {
    const licenseImage = await saveFile(files.licenseImage[0], "certificates", "doctor");
    savedFiles.push(licenseImage);

    const personalPhoto = files?.personalPhoto?.[0]
      ? await saveFile(files.personalPhoto[0], "personalPhoto", "doctor")
      : null;
    if (personalPhoto) savedFiles.push(personalPhoto);

    return await User.create({
      fullName: userData.fullName,
      email: userData.email.toLowerCase(),
      password: userData.password,
      phoneNumber: userData.phoneNumber,
      gender: userData.gender,
      role: "doctor",
      isVerified: false,
      personalPhoto,
      doctorProfile: {
        specialization: userData.specialization,
        yearsExperience: userData.yearsExperience,
        medicalLicenseNumber: userData.medicalLicenseNumber,
        licenseImage,
        about: userData.about,
        price: userData.price,
      },
    });
  } catch (err) {
    await cleanupFiles(savedFiles);
    throw err;
  }
};

export const toggleFollow = async (userId, doctorId) => {
  if (userId.toString() === doctorId.toString()) {
    throw new AppError(msg("لا يمكنك متابعة نفسك!", "You cannot follow yourself!"), 400);
  }

  const doctor = await User.findById(doctorId).lean();
  if (!doctor || doctor.role !== "doctor") {
    throw new AppError(msg("هذا الطبيب غير موجود", "Doctor not found"), 404);
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const isFollowing = doctor.followers?.includes(userId);
    const op = isFollowing ? "$pull" : "$addToSet";

    await User.updateOne({ _id: userId }, { [op]: { following: doctorId } }, { session });
    await User.updateOne({ _id: doctorId }, { [op]: { followers: userId } }, { session });
    await session.commitTransaction();

    return { followed: !isFollowing };
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
};

export const getAllDoctors = async (page = 1, limit = 10) => {
  const { skip, limit: clampedLimit } = buildPagination(page, limit);
  const [doctors, total] = await Promise.all([
    User.find({ role: "doctor", isVerified: true })
      .select("fullName email phoneNumber personalPhoto gender doctorProfile")
      .skip(skip)
      .limit(clampedLimit)
      .lean(),
    User.countDocuments({ role: "doctor", isVerified: true }),
  ]);
  return {
    data: doctors,
    pagination: {
      current: page,
      limit: clampedLimit,
      total,
      pages: Math.ceil(total / clampedLimit),
    },
  };
};

export const getDoctorDetails = async (doctorId) => {
  const doctor = await User.findById(doctorId)
    .select("fullName email phoneNumber personalPhoto gender doctorProfile followers")
    .lean();
  if (!doctor || doctor.role !== "doctor") {
    throw new AppError(msg("هذا الطبيب غير موجود", "Doctor not found"), 404);
  }
  return doctor;
};

export const searchDoctors = async (keyword, specialization, page = 1, limit = 10) => {
  const { skip, limit: clampedLimit } = buildPagination(page, limit);
  const query = { role: "doctor", isVerified: true };
  if (keyword) query.$text = { $search: keyword };
  if (specialization) {
    query["doctorProfile.specialization"] = {
      $regex: `^${escapeRegex(specialization)}`,
      $options: "i",
    };
  }

  const [doctors, total] = await Promise.all([
    User.find(query)
      .select("fullName personalPhoto doctorProfile.specialization doctorProfile.price")
      .skip(skip)
      .limit(clampedLimit)
      .lean(),
    User.countDocuments(query),
  ]);
  return {
    data: doctors,
    pagination: {
      current: page,
      limit: clampedLimit,
      total,
      pages: Math.ceil(total / clampedLimit),
    },
  };
};

export const updateProfile = async (userId, updateData, files) => {
  const user = await User.findById(userId);
  if (!user)
    throw new AppError(msg("المستخدم غير موجود", "User not found"), 404);

  const savedFiles = [];
  const $set = {};
  const $push = {};

  try {
    if (files?.personalPhoto?.[0]) {
      if (user.personalPhoto) await deleteFile(user.personalPhoto);
      const newPhoto = await saveFile(files.personalPhoto[0], "personalPhoto", user.role);
      $set.personalPhoto = newPhoto;
      savedFiles.push(newPhoto);
    }

    if (updateData.fullName) $set.fullName = updateData.fullName;
    if (updateData.phoneNumber) $set.phoneNumber = updateData.phoneNumber;
    if (updateData.gender) $set.gender = updateData.gender;

    if (user.role === "doctor") {
      if (updateData.specialization) $set["doctorProfile.specialization"] = updateData.specialization;
      if (updateData.yearsExperience !== undefined) $set["doctorProfile.yearsExperience"] = updateData.yearsExperience;
      if (updateData.about) $set["doctorProfile.about"] = updateData.about;
      if (updateData.price !== undefined) $set["doctorProfile.price"] = updateData.price;
    }

    if (user.role === "patient") {
      if (updateData.bloodType) $set["medicalProfile.bloodType"] = updateData.bloodType;
      if (updateData.height !== undefined) $set["medicalProfile.height"] = updateData.height;
      if (updateData.weight !== undefined) $set["medicalProfile.weight"] = updateData.weight;

      if (files?.radiologyImage?.length) {
        const tests = await processRadiologyTests(files.radiologyImage, updateData.radiologyDescription);
        const currentCount = user.medicalProfile?.radiologyTests?.length || 0;
        if (currentCount + tests.length > MAX_MEDICAL_TESTS) {
          throw new AppError(
            msg(`يمكنك تخزين ${MAX_MEDICAL_TESTS} فحص أشعة فقط`, `Maximum ${MAX_MEDICAL_TESTS} radiology tests`),
            400
          );
        }
        $push["medicalProfile.radiologyTests"] = { $each: tests, $slice: -MAX_MEDICAL_TESTS };
        collectSavedFiles(tests, savedFiles);
      }

      if (files?.labImage?.length) {
        const tests = await processLabTests(files.labImage, updateData.labDescription);
        const currentCount = user.medicalProfile?.labTests?.length || 0;
        if (currentCount + tests.length > MAX_MEDICAL_TESTS) {
          throw new AppError(
            msg(`يمكنك تخزين ${MAX_MEDICAL_TESTS} تحليل دم فقط`, `Maximum ${MAX_MEDICAL_TESTS} lab tests`),
            400
          );
        }
        $push["medicalProfile.labTests"] = { $each: tests, $slice: -MAX_MEDICAL_TESTS };
        collectSavedFiles(tests, savedFiles);
      }
    }

    const updateQuery = {};
    if (Object.keys($set).length) updateQuery.$set = $set;
    if (Object.keys($push).length) updateQuery.$push = $push;

    if (!Object.keys(updateQuery).length) {
      throw new AppError(msg("لم يتم إرسال بيانات صالحة للتحديث", "No valid data sent"), 400);
    }

    return await User.findByIdAndUpdate(userId, updateQuery, { new: true, runValidators: true });
  } catch (err) {
    await cleanupFiles(savedFiles);
    throw err;
  }
};

export const getUserProfile = async (userId) => {
  const user = await User.findById(userId).select("-password").lean();
  if (!user)
    throw new AppError(msg("المستخدم غير موجود", "User not found"), 404);
  return user;
};

export const getFollowing = async (userId, page = 1, limit = 10) => {
  const { skip, limit: clampedLimit } = buildPagination(page, limit);
  const user = await User.findById(userId).lean();
  if (!user)
    throw new AppError(msg("المستخدم غير موجود", "User not found"), 404);

  const following = await User.find({ _id: { $in: user.following || [] } })
    .select("fullName personalPhoto doctorProfile")
    .skip(skip)
    .limit(clampedLimit)
    .lean();

  return {
    data: following,
    pagination: {
      current: page,
      limit: clampedLimit,
      total: user.following?.length || 0,
      pages: Math.ceil((user.following?.length || 0) / clampedLimit),
    },
  };
};

export const getFollowers = async (userId, page = 1, limit = 10) => {
  const { skip, limit: clampedLimit } = buildPagination(page, limit);
  const user = await User.findById(userId).lean();
  if (!user)
    throw new AppError(msg("المستخدم غير موجود", "User not found"), 404);

  const followers = await User.find({ _id: { $in: user.followers || [] } })
    .select("fullName personalPhoto doctorProfile")
    .skip(skip)
    .limit(clampedLimit)
    .lean();

  return {
    data: followers,
    pagination: {
      current: page,
      limit: clampedLimit,
      total: user.followers?.length || 0,
      pages: Math.ceil((user.followers?.length || 0) / clampedLimit),
    },
  };
};
