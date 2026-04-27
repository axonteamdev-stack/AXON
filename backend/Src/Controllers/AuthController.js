import User from "../Models/UserModel.js";
import AppError, { catchAsync, sendResponse } from "../Utils/AppError.js";
import { msg } from "../Utils/ResponseHelper.js";
import { authCookieDefaults, generateTokens } from "../Utils/TokenService.js";
import jwt from "jsonwebtoken";
import sendEmail from "../Utils/Email.js";
import crypto from "crypto";
import fs from "fs";
import { promises as fsPromises } from "fs"; // Optimized: Async File System
import path from "path";

/**
 * دالة مساعدة لتحويل البيانات إلى مصفوفة بشكل آمن
 */
const safeParse = (data) => {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  try {
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [parsed];
  } catch (e) {
    return [data];
  }
};

/**
 * دالة مساعدة لحفظ الملفات بشكل غير متزامن (Async) لزيادة السرعة
 */
const saveFile = async (file, subFolder, role = "user") => {
  if (!file || !file.buffer) return null;

  const rootPath = process.cwd();
  const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
  const extension = path.extname(file.originalname) || ".jpg";
  const fileName = `${role}-${uniqueSuffix}${extension}`;
  const targetDir = path.join(rootPath, "Uploads", subFolder);

  // التأكد من وجود المجلد بشكل غير متزامن
  if (!fs.existsSync(targetDir)) {
    await fsPromises.mkdir(targetDir, { recursive: true });
  }

  const filePath = path.join(targetDir, fileName);
  
  // حفظ الملف بدون تعطيل السيرفر (Non-blocking I/O)
  await fsPromises.writeFile(filePath, file.buffer);

  return `Uploads/${subFolder}/${fileName}`.replace(/\\/g, "/");
};

// 1. PATIENT SIGNUP (Optimized with Promise.all)
export const signupPatient = catchAsync(async (req, res, next) => {
  const {
    fullName, email, password, phoneNumber, gender,
    bloodType, height, weight, conditions, allergies,
    radiologyDescription, labDescription,
  } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new AppError(msg("البريد الإلكتروني مسجل بالفعل", "Email registered"), 400));
  }

  // مصفوفات الوصف
  const radDescs = safeParse(radiologyDescription);
  const labDescs = safeParse(labDescription);

  // تشغيل عمليات حفظ الملفات بالتوازي (Parallel Processing)
  const personalPhotoPromise = saveFile(req.files?.personalPhoto?.[0], "PersonalPhoto", "patient");

  const radiologyPromises = (req.files?.radiologyImage || []).map(async (file, index) => ({
    image: await saveFile(file, "Radiology", "patient"),
    description: radDescs[index] || "",
  }));

  const labPromises = (req.files?.labImage || []).map(async (file, index) => ({
    image: await saveFile(file, "LabTests", "patient"),
    description: labDescs[index] || "",
    uploadedAt: new Date()
  }));

  // انتظار انتهاء جميع الصور في وقت واحد بدلاً من الواحدة تلو الأخرى
  const [personalPhotoPath, radiologyTests, labTests] = await Promise.all([
    personalPhotoPromise,
    Promise.all(radiologyPromises),
    Promise.all(labPromises)
  ]);

  const newUser = await User.create({
    fullName, email, password, phoneNumber, gender,
    role: "patient",
    isVerified: true,
    personalPhoto: personalPhotoPath,
    medicalProfile: {
      bloodType, height, weight,
      conditions: safeParse(conditions),
      allergies: safeParse(allergies),
      radiologyTests,
      labTests,
    },
  });

  const { accessToken, refreshToken } = generateTokens(res, newUser._id);
  const isMobile = req.headers["platform"] === "mobile";

  res.status(201).json({
    status: "success",
    ...(isMobile && { token: accessToken, refreshToken }),
    data: newUser,
  });
});

// 2. DOCTOR SIGNUP (Optimized)
export const signupDoctor = catchAsync(async (req, res, next) => {
  const {
    fullName, email, password, phoneNumber, gender,
    specialization, yearsExperience, medicalLicenseNumber, about, price,
  } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new AppError(msg("البريد الإلكتروني مسجل بالفعل", "Email registered"), 400));
  }

  if (!req.files?.licenseImage?.[0]) {
    return next(new AppError(msg("صورة ترخيص المزاولة مطلوبة", "License image required"), 400));
  }

  // حفظ الملفات بالتوازي
  const [licenseImagePath, personalPhotoPath] = await Promise.all([
    saveFile(req.files.licenseImage[0], "Certificates", "doctor"),
    saveFile(req.files?.personalPhoto?.[0], "PersonalPhoto", "doctor")
  ]);

  const newUser = await User.create({
    fullName, email, password, phoneNumber, gender,
    role: "doctor",
    isVerified: true,
    personalPhoto: personalPhotoPath,
    doctorProfile: {
      specialization, yearsExperience, medicalLicenseNumber,
      licenseImage: licenseImagePath, about, price,
    },
  });

  sendResponse(res, 201, msg("تم التسجيل بنجاح", "Doctor registration successful"), {
    id: newUser._id,
    email: newUser.email,
    role: newUser.role
  });
});

// 3. LOGIN
export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError(msg("يرجى إدخال البيانات", "Enter credentials"), 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.matchPassword(password))) {
    return next(new AppError(msg("بيانات غير صحيحة", "Invalid credentials"), 401));
  }

  if (user.role === "doctor" && !user.isVerified) {
    return next(new AppError(msg("حسابك قيد المراجعة", "Pending approval"), 403));
  }

  const { accessToken, refreshToken } = generateTokens(res, user._id);
  const isMobile = req.headers["platform"] === "mobile";

  res.status(200).json({
    status: "success",
    ...(isMobile && { token: accessToken, refreshToken }),
    data: user,
  });
});

export const logout = (req, res) => {
  const clearOpts = { ...authCookieDefaults, expires: new Date(0) };
  res.cookie("jwt", "", clearOpts);
  res.cookie("refreshToken", "", clearOpts);
  sendResponse(res, 200, msg("تم الخروج بنجاح", "Logged out"));
};

// 4. REFRESH TOKEN
export const refreshAccessToken = catchAsync(async (req, res, next) => {
  const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
  if (!refreshToken) {
    return next(new AppError(msg("لا يوجد توكن", "No token"), 401));
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return next(new AppError(msg("المستخدم غير موجود", "User not found"), 404));

    const { accessToken } = generateTokens(res, user._id);
    res.status(200).json({ status: "success", token: accessToken });
  } catch (err) {
    return next(new AppError(msg("انتهت الجلسة", "Session expired"), 401));
  }
});

// 5. FORGOT PASSWORD
export const forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return next(new AppError(msg("المستخدم غير موجود", "User not found"), 404));

  const resetToken = crypto.randomInt(100_000, 1_000_000).toString();
  user.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  await user.save({ validateBeforeSave: false });

  try {
    await sendEmail({
      email: user.email,
      subject: "رمز إعادة تعيين كلمة المرور",
      message: `كود التحقق الخاص بك هو: ${resetToken}`,
    });
    sendResponse(res, 200, msg("تم إرسال الكود", "Code sent"));
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new AppError(msg("فشل في إرسال البريد", "Email failed"), 500));
  }
});

// 6. RESET PASSWORD
export const resetPassword = catchAsync(async (req, res, next) => {
  const { token, password } = req.body;
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) return next(new AppError(msg("كود غير صالح", "Invalid code"), 400));

  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  sendResponse(res, 200, msg("تم التغيير بنجاح", "Success"));
});

// 7. UPDATE USER PROFILE (Optimized with logic for radiology/lab)
export const updateMe = catchAsync(async (req, res, next) => {
  const body = req.body || {};
  if (body.password || body.role || body.email) {
    return next(new AppError(msg("تعديل غير مسموح", "Update not allowed"), 400));
  }

  const updateData = {};
  const pushData = {};

  const basicFields = ["fullName", "phoneNumber", "gender"];
  basicFields.forEach(field => { if (body[field]) updateData[field] = body[field]; });

  if (req.user.role === "doctor") {
    ["specialization", "yearsExperience", "about", "price"].forEach(field => {
      if (body[field] !== undefined) updateData[`doctorProfile.${field}`] = body[field];
    });
  }

  if (req.user.role === "patient") {
    ["bloodType", "height", "weight"].forEach(field => {
      if (body[field] !== undefined) updateData[`medicalProfile.${field}`] = body[field];
    });
  }

  if (req.files) {
    // تحديث الصورة الشخصية وحذف القديمة
    if (req.files.personalPhoto?.[0]) {
      if (req.user.personalPhoto) {
        const oldPath = path.normalize(path.join(process.cwd(), req.user.personalPhoto));
        try { if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath); } catch (e) {}
      }
      updateData.personalPhoto = await saveFile(req.files.personalPhoto[0], "PersonalPhoto", req.user.role);
    }

    // إضافة تحاليل وأشعة جديدة بالتوازي
    if (req.user.role === "patient") {
      if (req.files.radiologyImage) {
        const radDescs = safeParse(body.radiologyDescription);
        pushData["medicalProfile.radiologyTests"] = {
          $each: await Promise.all(req.files.radiologyImage.map(async (file, i) => ({
            image: await saveFile(file, "Radiology", "patient"),
            description: radDescs[i] || "",
            date: new Date()
          })))
        };
      }
      if (req.files.labImage) {
        const labDescs = safeParse(body.labDescription);
        pushData["medicalProfile.labTests"] = {
          $each: await Promise.all(req.files.labImage.map(async (file, i) => ({
            image: await saveFile(file, "LabTests", "patient"),
            description: labDescs[i] || "",
            uploadedAt: new Date()
          })))
        };
      }
    }
  }

  const updateQuery = {};
  if (Object.keys(updateData).length > 0) updateQuery.$set = updateData;
  if (Object.keys(pushData).length > 0) updateQuery.$push = pushData;

  if (Object.keys(updateQuery).length === 0) {
    return next(new AppError(msg("لا توجد بيانات للتحديث", "No data to update"), 400));
  }

  const updatedUser = await User.findByIdAndUpdate(req.user.id, updateQuery, {
    new: true,
    runValidators: true,
  });

  sendResponse(res, 200, msg("تم التحديث بنجاح", "Updated successfully"), updatedUser);
});
