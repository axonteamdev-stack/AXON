import User from "../models/User.js";
import Follow from "../models/Follow.js";
import AppError from "../utils/AppError.js";
import { msg } from "../utils/i18n.js";

const MAX_SEARCH_LIMIT = 50;

const escapeRegex = (string) => {
    if (!string) return "";
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

const buildPagination = (page, limit) => ({
    skip: (page - 1) * limit,
    limit: Math.min(limit, MAX_SEARCH_LIMIT),
});

export const getAllDoctors = async (page = 1, limit = 10) => {
    const { skip, limit: clampedLimit } = buildPagination(page, limit);
    const [doctors, total] = await Promise.all([
        User.find({ role: "doctor", isVerified: true })
            .select(
                "fullName email phoneNumber personalPhoto gender doctorProfile",
            )
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
        .select("fullName email phoneNumber personalPhoto gender doctorProfile")
        .lean();
    if (!doctor || doctor.role !== "doctor") {
        throw new AppError(
            msg("هذا الطبيب غير موجود", "Doctor not found"),
            404,
        );
    }
    return doctor;
};

export const searchDoctors = async (
    keyword,
    specialization,
    page = 1,
    limit = 10,
) => {
    const { skip, limit: clampedLimit } = buildPagination(page, limit);
    const query = { role: "doctor", isVerified: true };

    if (keyword) {
        const safeKeyword = escapeRegex(keyword);
        query.$or = [
            { fullName: { $regex: safeKeyword, $options: "i" } },
            {
                "doctorProfile.specialization": {
                    $regex: safeKeyword,
                    $options: "i",
                },
            },
        ];
    }

    if (specialization) {
        const safeSpecialization = escapeRegex(specialization);
        query["doctorProfile.specialization"] = {
            $regex: safeSpecialization,
            $options: "i",
        };
    }

    const [doctors, total] = await Promise.all([
        User.find(query)
            .select(
                "fullName personalPhoto doctorProfile.specialization doctorProfile.price",
            )
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

export const toggleFollow = async (userId, doctorId) => {
    if (userId.toString() === doctorId.toString()) {
        throw new AppError(
            msg("لا يمكنك متابعة نفسك!", "You cannot follow yourself!"),
            400,
        );
    }

    const doctor = await User.findById(doctorId).lean();
    if (!doctor || doctor.role !== "doctor") {
        throw new AppError(
            msg("هذا الطبيب غير موجود", "Doctor not found"),
            404,
        );
    }

    const existing = await Follow.findOne({
        follower: userId,
        following: doctorId,
    });

    if (existing) {
        await Follow.deleteOne({ _id: existing._id });
        return { followed: false };
    }

    await Follow.create({ follower: userId, following: doctorId });
    return { followed: true };
};

export const getFollowing = async (userId, page = 1, limit = 10) => {
    const { skip, limit: clampedLimit } = buildPagination(page, limit);

    const [follows, total] = await Promise.all([
        Follow.find({ follower: userId })
            .populate("following", "fullName personalPhoto doctorProfile")
            .skip(skip)
            .limit(clampedLimit)
            .lean(),
        Follow.countDocuments({ follower: userId }),
    ]);

    return {
        data: follows.map((f) => f.following),
        pagination: {
            current: page,
            limit: clampedLimit,
            total,
            pages: Math.ceil(total / clampedLimit),
        },
    };
};

export const getFollowers = async (userId, page = 1, limit = 10) => {
    const { skip, limit: clampedLimit } = buildPagination(page, limit);

    const [follows, total] = await Promise.all([
        Follow.find({ following: userId })
            .populate("follower", "fullName personalPhoto")
            .skip(skip)
            .limit(clampedLimit)
            .lean(),
        Follow.countDocuments({ following: userId }),
    ]);

    return {
        data: follows.map((f) => f.follower),
        pagination: {
            current: page,
            limit: clampedLimit,
            total,
            pages: Math.ceil(total / clampedLimit),
        },
    };
};

export const getUserProfile = async (userId) => {
    const user = await User.findById(userId).select("-password").lean();
    if (!user) {
        throw new AppError(msg("المستخدم غير موجود", "User not found"), 404);
    }
    return user;
};

export const updateProfile = async (userId, updateData) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new AppError(msg("المستخدم غير موجود", "User not found"), 404);
    }

    const allowedFields = [
        "fullName",
        "phoneNumber",
        "gender",
        "preferredLanguage",
    ];
    const update = {};

    allowedFields.forEach((field) => {
        if (updateData[field] !== undefined) update[field] = updateData[field];
    });

    if (user.role === "doctor") {
        const doctorFields = [
            "specialization",
            "yearsExperience",
            "about",
            "price",
        ];
        doctorFields.forEach((field) => {
            if (updateData[field] !== undefined)
                update[`doctorProfile.${field}`] = updateData[field];
        });
    }

    if (Object.keys(update).length === 0) {
        throw new AppError(
            msg("لا توجد بيانات للتحديث", "No data to update"),
            400,
        );
    }

    return User.findByIdAndUpdate(
        userId,
        { $set: update },
        { new: true, runValidators: true },
    );
};
