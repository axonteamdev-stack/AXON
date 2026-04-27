/**
 * UserService - User business logic
 * Handles user operations: signup, profile updates, follow/unfollow
 */

import mongoose from "mongoose";
import User from "../Models/UserModel.js";
import FileService from "./FileService.js";
import AppError from "../Utils/AppError.js";
import { ROLES, FILE_LIMITS } from "../Constants/index.js";
import { msg } from "../Utils/ResponseHelper.js";
import { escapeRegex } from "../Utils/regexEscape.js";

export class UserService {
  /**
   * Create patient user with medical data
   */
  static async createPatient(userData, files) {
    // Validate basic data
    if (!userData.email || !userData.password) {
      throw new AppError(
        msg("يرجى إدخال البريد وكلمة المرور", "Please enter email and password"),
        400,
      );
    }

    // Check existing user
    const existing = await User.findOne({
      email: userData.email.toLowerCase(),
    });
    if (existing) {
      throw new AppError(
        msg("البريد الإلكتروني مسجل بالفعل", "Email already registered"),
        400,
      );
    }

    const savedFiles = [];

    try {
      // Process files
      const personalPhoto = files?.personalPhoto?.[0]
        ? FileService.saveFile(
            files.personalPhoto[0],
            "PersonalPhoto",
            "patient",
          )
        : null;

      if (personalPhoto) savedFiles.push(personalPhoto);

      const radiologyTests = files?.radiologyImage
        ? FileService.processRadiologyTests(
            files.radiologyImage,
            userData.radiologyDescription,
          )
        : [];

      radiologyTests.forEach((test) => {
        if (test.image) savedFiles.push(test.image);
      });

      const labTests = files?.labImage
        ? FileService.processLabTests(files.labImage, userData.labDescription)
        : [];

      labTests.forEach((test) => {
        if (test.image) savedFiles.push(test.image);
      });

      // Create user document
      const user = await User.create({
        fullName: userData.fullName,
        email: userData.email.toLowerCase(),
        password: userData.password,
        phoneNumber: userData.phoneNumber,
        gender: userData.gender,
        role: ROLES.PATIENT,
        isVerified: true,
        personalPhoto,
        medicalProfile: {
          bloodType: userData.bloodType || null,
          height: userData.height || null,
          weight: userData.weight || null,
          conditions: FileService.safeParse(userData.conditions) || [],
          allergies: FileService.safeParse(userData.allergies) || [],
          radiologyTests,
          labTests,
        },
      });

      return user;
    } catch (error) {
      // Cleanup files on failure
      FileService.cleanupFiles(savedFiles);
      throw error;
    }
  }

  /**
   * Create doctor user with credentials
   */
  static async createDoctor(userData, files) {
    if (!userData.email || !userData.password) {
      throw new AppError(
        msg("يرجى إدخال البريد وكلمة المرور", "Please enter email and password"),
        400,
      );
    }

    // Check existing user
    const existing = await User.findOne({
      email: userData.email.toLowerCase(),
    });
    if (existing) {
      throw new AppError(
        msg("البريد الإلكتروني مسجل بالفعل", "Email already registered"),
        400,
      );
    }

    // License image required for doctors
    if (!files?.licenseImage?.[0]) {
      throw new AppError(
        msg("صورة ترخيص المزاولة مطلوبة للطبيب", "License image is required for doctor"),
        400,
      );
    }

    const savedFiles = [];

    try {
      const licenseImage = FileService.saveFile(
        files.licenseImage[0],
        "Certificates",
        "doctor",
      );
      savedFiles.push(licenseImage);

      const personalPhoto = files?.personalPhoto?.[0]
        ? FileService.saveFile(
            files.personalPhoto[0],
            "PersonalPhoto",
            "doctor",
          )
        : null;

      if (personalPhoto) savedFiles.push(personalPhoto);

      const user = await User.create({
        fullName: userData.fullName,
        email: userData.email.toLowerCase(),
        password: userData.password,
        phoneNumber: userData.phoneNumber,
        gender: userData.gender,
        role: ROLES.DOCTOR,
        isVerified: false, // Doctors require admin approval
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

      return user;
    } catch (error) {
      FileService.cleanupFiles(savedFiles);
      throw error;
    }
  }

  /**
   * Atomic follow/unfollow with transactions
   */
  static async toggleFollow(userId, doctorId) {
    if (userId.toString() === doctorId.toString()) {
      throw new AppError(
        msg("لا يمكنك متابعة نفسك!", "You cannot follow yourself!"),
        400,
      );
    }

    // Validate doctor exists
    const doctor = await User.findById(doctorId);
    if (!doctor || doctor.role !== ROLES.DOCTOR) {
      throw new AppError(
        msg("هذا الطبيب غير موجود", "Doctor not found"),
        404,
      );
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const isFollowing = doctor.followers.includes(userId);

      if (isFollowing) {
        // Unfollow
        await User.updateOne(
          { _id: userId },
          { $pull: { following: doctorId } },
          { session },
        );
        await User.updateOne(
          { _id: doctorId },
          { $pull: { followers: userId } },
          { session },
        );
      } else {
        // Follow
        await User.updateOne(
          { _id: userId },
          { $addToSet: { following: doctorId } },
          { session },
        );
        await User.updateOne(
          { _id: doctorId },
          { $addToSet: { followers: userId } },
          { session },
        );
      }

      await session.commitTransaction();
      return { followed: !isFollowing };
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  /**
   * Get all verified doctors with pagination
   */
  static async getAllDoctors(page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const doctors = await User.find({ role: ROLES.DOCTOR, isVerified: true })
      .select("fullName email phoneNumber personalPhoto gender doctorProfile")
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await User.countDocuments({
      role: ROLES.DOCTOR,
      isVerified: true,
    });

    return {
      data: doctors,
      pagination: {
        current: page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get doctor details by ID
   */
  static async getDoctorDetails(doctorId) {
    const doctor = await User.findById(doctorId)
      .select(
        "fullName email phoneNumber personalPhoto gender doctorProfile followers",
      )
      .lean();

    if (!doctor || doctor.role !== ROLES.DOCTOR) {
      throw new AppError(
        msg("هذا الطبيب غير موجود", "Doctor not found"),
        404,
      );
    }

    return doctor;
  }

  /**
   * Search doctors with text and specialty filters
   */
  static async searchDoctors(keyword, specialization, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    let query = { role: ROLES.DOCTOR, isVerified: true };

    if (keyword) {
      query.$text = { $search: keyword };
    }

    if (specialization) {
      query["doctorProfile.specialization"] = {
        $regex: `^${escapeRegex(specialization)}`,
        $options: "i",
      };
    }

    const doctors = await User.find(query)
      .select(
        "fullName personalPhoto doctorProfile.specialization doctorProfile.price",
      )
      .skip(skip)
      .limit(Math.min(limit, 50))
      .lean();

    const total = await User.countDocuments(query);

    return {
      data: doctors,
      pagination: {
        current: page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Update user profile
   */
  static async updateProfile(userId, updateData, files) {
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError(
        msg("المستخدم غير موجود", "User not found"),
        404,
      );
    }

    const savedFiles = [];
    const updateQuery = {};

    try {
      // Handle personal photo update
      if (files?.personalPhoto?.[0]) {
        // Delete old photo
        if (user.personalPhoto) {
          FileService.deleteFile(user.personalPhoto);
        }

        const newPhoto = FileService.saveFile(
          files.personalPhoto[0],
          "PersonalPhoto",
          user.role,
        );
        updateQuery.personalPhoto = newPhoto;
        savedFiles.push(newPhoto);
      }

      // Handle basic fields
      if (updateData.fullName) updateQuery.fullName = updateData.fullName;
      if (updateData.phoneNumber)
        updateQuery.phoneNumber = updateData.phoneNumber;
      if (updateData.gender) updateQuery.gender = updateData.gender;

      // Handle doctor profile updates
      if (user.role === ROLES.DOCTOR) {
        if (updateData.specialization) {
          updateQuery["doctorProfile.specialization"] =
            updateData.specialization;
        }
        if (updateData.yearsExperience !== undefined) {
          updateQuery["doctorProfile.yearsExperience"] =
            updateData.yearsExperience;
        }
        if (updateData.about)
          updateQuery["doctorProfile.about"] = updateData.about;
        if (updateData.price !== undefined)
          updateQuery["doctorProfile.price"] = updateData.price;
      }

      // Handle patient profile updates
      if (user.role === ROLES.PATIENT) {
        if (updateData.bloodType) {
          updateQuery["medicalProfile.bloodType"] = updateData.bloodType;
        }
        if (updateData.height !== undefined) {
          updateQuery["medicalProfile.height"] = updateData.height;
        }
        if (updateData.weight !== undefined) {
          updateQuery["medicalProfile.weight"] = updateData.weight;
        }

        // Handle medical image uploads
        if (files?.radiologyImage?.length) {
          const radiologyTests = FileService.processRadiologyTests(
            files.radiologyImage,
            updateData.radiologyDescription,
          );

          // Check array size limit
          const currentTests = user.medicalProfile?.radiologyTests?.length || 0;
          if (
            currentTests + radiologyTests.length >
            FILE_LIMITS.MAX_MEDICAL_TESTS
          ) {
            throw new AppError(
              msg(
                `يمكنك تخزين ${FILE_LIMITS.MAX_MEDICAL_TESTS} فحص أشعة فقط`,
                `Maximum ${FILE_LIMITS.MAX_MEDICAL_TESTS} radiology tests allowed`,
              ),
              400,
            );
          }

          updateQuery.$push = updateQuery.$push || {};
          updateQuery.$push["medicalProfile.radiologyTests"] = {
            $each: radiologyTests,
          };

          radiologyTests.forEach((test) => {
            if (test.image) savedFiles.push(test.image);
          });
        }

        if (files?.labImage?.length) {
          const labTests = FileService.processLabTests(
            files.labImage,
            updateData.labDescription,
          );

          // Check array size limit
          const currentTests = user.medicalProfile?.labTests?.length || 0;
          if (currentTests + labTests.length > FILE_LIMITS.MAX_MEDICAL_TESTS) {
            throw new AppError(
              msg(
                `يمكنك تخزين ${FILE_LIMITS.MAX_MEDICAL_TESTS} تحليل دم فقط`,
                `Maximum ${FILE_LIMITS.MAX_MEDICAL_TESTS} lab tests allowed`,
              ),
              400,
            );
          }

          updateQuery.$push = updateQuery.$push || {};
          updateQuery.$push["medicalProfile.labTests"] = {
            $each: labTests,
          };

          labTests.forEach((test) => {
            if (test.image) savedFiles.push(test.image);
          });
        }
      }

      // If no updates provided
      if (Object.keys(updateQuery).length === 0) {
        throw new AppError(
          msg("لم يتم إرسال بيانات صالحة للتحديث", "No valid data sent for update"),
          400,
        );
      }

      // Convert $set if needed
      if (
        Object.keys(updateQuery).length > 0 &&
        !updateQuery.$set &&
        !updateQuery.$push
      ) {
        updateQuery.$set = updateQuery;
        delete updateQuery.$set.$push;
      }

      if (updateQuery.$set && Object.keys(updateQuery.$set).length === 0) {
        delete updateQuery.$set;
      }

      const updated = await User.findByIdAndUpdate(userId, updateQuery, {
        new: true,
        runValidators: true,
      });

      return updated;
    } catch (error) {
      FileService.cleanupFiles(savedFiles);
      throw error;
    }
  }

  /**
   * Get user profile by ID
   */
  static async getUserProfile(userId) {
    const user = await User.findById(userId).select("-password").lean();

    if (!user) {
      throw new AppError(
        msg("المستخدم غير موجود", "User not found"),
        404,
      );
    }

    return user;
  }

  /**
   * Get list of users that this user is following
   */
  static async getFollowing(userId, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const user = await User.findById(userId).lean();
    if (!user) {
      throw new AppError(
        msg("المستخدم غير موجود", "User not found"),
        404,
      );
    }

    const following = await User.find({
      _id: { $in: user.following || [] },
    })
      .select("fullName personalPhoto doctorProfile")
      .skip(skip)
      .limit(limit)
      .lean();

    return following;
  }

  /**
   * Get list of users who are following this user
   */
  static async getFollowers(userId, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const user = await User.findById(userId).lean();
    if (!user) {
      throw new AppError(
        msg("المستخدم غير موجود", "User not found"),
        404,
      );
    }

    const followers = await User.find({
      _id: { $in: user.followers || [] },
    })
      .select("fullName personalPhoto doctorProfile")
      .skip(skip)
      .limit(limit)
      .lean();

    return followers;
  }
}

export default UserService;
