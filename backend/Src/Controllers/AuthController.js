import User from "../Models/UserModel.js";
import AppError, { catchAsync } from "../Utils/AppError.js";
import { generateTokens } from "../Utils/TokenService.js";
import jwt from "jsonwebtoken";
import sendEmail from "../Utils/Email.js";
import crypto from "crypto";
import fs from "fs";
import path from "path";

/**
 * دالة مساعدة ذكية:
 * إذا كانت البيانات نصاً عادياً (مثل الذي تكتبه في بوستمان) تحوله لمصفوفة.
 * إذا كانت JSON تحولها لمصفوفة.
 */
const safeParse = (data) => {
  if (!data) return [];

  // 1. إذا كانت البيانات مصفوفة بالفعل (وهذا ما يفعله Postman عند تكرار الـ Key)
  if (Array.isArray(data)) return data;

  // 2. إذا كانت البيانات نصاً (String)
  try {
    // محاولة فكها إذا كانت مصفوفة JSON نصية مثل: ["desc1", "desc2"]
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [parsed];
  } catch (e) {
    // 3. إذا كان نصاً عادياً واحداً (ليس JSON)
    return [data];
  }
};

/**
 * دالة مساعدة لحفظ الملفات من الذاكرة (RAM) إلى الهارد ديسك
 * تُستخدم فقط بعد التأكد من صحة البيانات (Validation Success)
 */
const saveFile = (file, subFolder, role = "user") => {
  if (!file || !file.buffer) return null;

  const rootPath = process.cwd();
  const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
  const extension = path.extname(file.originalname) || ".jpg";

  // اسم الملف ثابت ومنظم (role-timestamp.ext)
  const fileName = `${role}-${uniqueSuffix}${extension}`;

  // تحديد المجلد المستهدف (مثلاً: Uploads/LabTests)
  const targetDir = path.join(rootPath, "Uploads", subFolder);

  // التأكد من وجود المجلد (لو مش موجود يتم إنشاؤه)
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  // المسار الكامل لحفظ الملف فعلياً على الهارد
  const filePath = path.join(targetDir, fileName);
  fs.writeFileSync(filePath, file.buffer);

  // التعديل هنا: نضمن إن المسار اللي راجع لقاعدة البيانات يستخدم / دائماً
  // ده بيمنع مشاكل الـ Backslashes (\) في الويندوز
  return `Uploads/${subFolder}/${fileName}`.replace(/\\/g, "/");
};

// 1. PATIENT SIGNUP (بعد التعديل لنظام الذاكرة)
export const signupPatient = catchAsync(async (req, res, next) => {
  const {
    fullName,
    email,
    password,
    phoneNumber,
    gender,
    bloodType,
    height,
    weight,
    conditions,
    allergies,
    radiologyDescription,
    labDescription,
  } = req.body;

  // 1. فحص الإيميل أولاً
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new AppError("البريد الإلكتروني مسجل بالفعل", 400));
  }

  // 2. معالجة صورة الملف الشخصي (صورة واحدة فقط)
  const personalPhotoPath = saveFile(
    req.files?.personalPhoto?.[0],
    "PersonalPhoto",
    "patient",
  );

  // 3. معالجة مصفوفة الأشعة (Radiology)
  // نحول الأوصاف لمصفوفة باستخدام safeParse لضمان التعامل معها برمجياً
  const radDescs = safeParse(radiologyDescription);
  let radiologyTests = [];
  if (req.files?.radiologyImage) {
    radiologyTests = req.files.radiologyImage.map((file, index) => ({
      image: saveFile(file, "Radiology", "patient"),
      description: radDescs[index] || "", // يربط الصورة بوصفها حسب الترتيب
    }));
  }

  // 4. معالجة مصفوفة التحاليل (Lab Tests)
  const labDescs = safeParse(labDescription);
  let labTests = [];
  if (req.files?.labImage) {
    labTests = req.files.labImage.map((file, index) => ({
      image: saveFile(file, "LabTests", "patient"),
      description: labDescs[index] || "", // يربط الصورة بوصفها حسب الترتيب
    }));
  }

  // 5. إنشاء المستخدم بالهيكل الجديد (Arrays)
  const newUser = await User.create({
    fullName,
    email,
    password,
    phoneNumber,
    gender,
    role: "patient",
    isVerified: true,
    personalPhoto: personalPhotoPath,
    medicalProfile: {
      bloodType,
      height,
      weight,
      conditions: safeParse(conditions),
      allergies: safeParse(allergies),
      radiologyTests, // المصفوفة الجديدة ✅
      labTests, // المصفوفة الجديدة ✅
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

// 2. DOCTOR SIGNUP (بعد التعديل لنظام الذاكرة)
export const signupDoctor = catchAsync(async (req, res, next) => {
  const {
    fullName,
    email,
    password,
    phoneNumber,
    gender,
    specialization,
    yearsExperience,
    medicalLicenseNumber,
    about,
    price,
  } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser)
    return next(new AppError("البريد الإلكتروني مسجل بالفعل", 400));

  // التأكد من وجود صورة الترخيص في الذاكرة أولاً
  if (!req.files?.licenseImage?.[0]) {
    return next(new AppError("صورة ترخيص المزاولة مطلوبة للطبيب", 400));
  }

  // حفظ الصور يدوياً
  const licenseImagePath = saveFile(
    req.files.licenseImage[0],
    "Certificates",
    "doctor",
  );
  const personalPhotoPath = saveFile(
    req.files?.personalPhoto?.[0],
    "PersonalPhoto",
    "doctor",
  );

  const newUser = await User.create({
    fullName,
    email,
    password,
    phoneNumber,
    gender,
    role: "doctor",
    isVerified: true,
    personalPhoto: personalPhotoPath,
    doctorProfile: {
      specialization,
      yearsExperience,
      medicalLicenseNumber,
      licenseImage: licenseImagePath,
      about,
      price,
    },
  });

  res.status(201).json({
    status: "success",
    message: "تم إرسال طلب التسجيل بنجاح",
    data: { id: newUser._id, email: newUser.email, role: newUser.role },
  });
});

// 3. LOGIN
export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password)
    return next(new AppError("يرجى إدخال البريد وكلمة المرور", 400));

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.matchPassword(password))) {
    return next(new AppError("بيانات الدخول غير صحيحة", 401));
  }

  if (user.role === "doctor" && !user.isVerified) {
    return next(new AppError("حسابك في انتظار موافقة الإدارة", 403));
  }

  const { accessToken, refreshToken } = generateTokens(res, user._id);
  const isMobile = req.headers["platform"] === "mobile";

  res.status(200).json({
    status: "success",
    ...(isMobile && { token: accessToken, refreshToken }),
    data: user,
  });
});

// 4. REFRESH TOKEN
export const refreshAccessToken = catchAsync(async (req, res, next) => {
  const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
  if (!refreshToken) return next(new AppError("لا يوجد Refresh Token", 401));

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return next(new AppError("المستخدم غير موجود", 404));

    const { accessToken } = generateTokens(res, user._id);
    res.status(200).json({ status: "success", token: accessToken });
  } catch (err) {
    return next(
      new AppError("انتهت صلاحية الجلسة، يرجى تسجيل الدخول مجدداً", 401),
    );
  }
});

// 5. FORGOT PASSWORD
export const forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return next(new AppError("لا يوجد مستخدم بهذا البريد", 404));

  const resetToken = Math.floor(100000 + Math.random() * 900000).toString();
  user.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  await user.save({ validateBeforeSave: false });

  try {
    await sendEmail({
      email: user.email,
      subject: "رمز إعادة تعيين كلمة المرور",
      message: `كود التحقق الخاص بك هو: ${resetToken}`,
    });
    res
      .status(200)
      .json({ status: "success", message: "تم إرسال الكود للبريد الإلكتروني" });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new AppError("فشل في إرسال البريد الإلكتروني", 500));
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

  if (!user) return next(new AppError("الكود غير صحيح أو انتهت صلاحيته", 400));

  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  res
    .status(200)
    .json({ status: "success", message: "تم تغيير كلمة المرور بنجاح" });
});

// دالة حماية الروابط (Authentication Middleware)
export const protect = catchAsync(async (req, res, next) => {
  // 1) التأكد من وجود التوكن في الـ Headers
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies?.jwt) {
    // غيرنا "accessToken" لـ "jwt"
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      new AppError(
        "أنت غير مسجل دخول، يرجى تسجيل الدخول للوصول لهذه الخدمة",
        401,
      ),
    );
  }

  // 2) التحقق من صحة التوكن
  const decoded = jwt.verify(token, process.env.JWT_SECRET); // تأكد إن الاسم JWT_SECRET

  // 3) التأكد من أن المستخدم صاحب التوكن لا يزال موجوداً
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(new AppError("المستخدم صاحب هذا التوكن لم يعد موجوداً", 401));
  }

  // 4) تمرير بيانات المستخدم للطلب (مهم جداً لعمل updateMe)
  req.user = currentUser;
  next();
});

// 6. UPDATE ME (تحديث بيانات المستخدم الحالي)
export const updateMe = catchAsync(async (req, res, next) => {
  const body = req.body || {};

  // 1) حماية الحقول الحساسة
  if (body.password || body.role || body.email) {
    return next(
      new AppError(
        "هذا الرابط ليس لتغيير كلمة المرور أو الصلاحيات أو الإيميل",
        400,
      ),
    );
  }

  const updateData = {};
  const pushData = {}; // كائن خاص للإضافات للمصفوفات

  // 2) تحديث الحقول النصية الأساسية
  const basicFields = ["fullName", "phoneNumber", "gender"];
  basicFields.forEach((field) => {
    if (body[field]) updateData[field] = body[field];
  });

  // 3) تحديث بيانات الطبيب
  if (req.user.role === "doctor") {
    ["specialization", "yearsExperience", "about", "price"].forEach((field) => {
      if (body[field] !== undefined)
        updateData[`doctorProfile.${field}`] = body[field];
    });
  }

  // 4) تحديث بيانات المريض (البيانات العادية)
  if (req.user.role === "patient") {
    ["bloodType", "height", "weight"].forEach((field) => {
      if (body[field] !== undefined)
        updateData[`medicalProfile.${field}`] = body[field];
    });
  }

  // 5) معالجة الصور (الملف الشخصي + مصفوفات الأشعة والتحاليل)
  if (req.files) {
    // أ- الصورة الشخصية (استبدال آمن)
    if (req.files.personalPhoto && req.files.personalPhoto[0]) {
      if (req.user.personalPhoto) {
        const oldPath = path.normalize(
          path.join(process.cwd(), req.user.personalPhoto),
        );
        try {
          // فحص الوجود قبل الحذف لتجنب الأخطاء
          if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        } catch (err) {
          console.error(
            "Warning: Could not delete old personal photo:",
            err.message,
          );
        }
      }
      updateData.personalPhoto = saveFile(
        req.files.personalPhoto[0],
        "PersonalPhoto",
        req.user.role,
      );
    }

    // ب- إضافة صور أشعة جديدة (Array Push)
    if (req.user.role === "patient" && req.files.radiologyImage) {
      const radDescs = safeParse(body.radiologyDescription);
      const newRadiologies = req.files.radiologyImage.map((file, index) => ({
        image: saveFile(file, "Radiology", "patient"),
        description: radDescs[index] || "",
        date: Date.now(),
      }));

      pushData["medicalProfile.radiologyTests"] = { $each: newRadiologies };
    }

    // ج- إضافة صور تحاليل جديدة (Array Push)
    if (req.user.role === "patient" && req.files.labImage) {
      const labDescs = safeParse(body.labDescription);
      const newLabs = req.files.labImage.map((file, index) => ({
        image: saveFile(file, "LabTests", "patient"), // تم توحيد الاسم لـ image ليطابق الـ Schema
        description: labDescs[index] || "",
        uploadedAt: Date.now(),
      }));

      pushData["medicalProfile.labTests"] = { $each: newLabs };
    }
  }

  // 6) بناء استعلام التحديث النهائي
  const updateQuery = {};

  if (Object.keys(updateData).length > 0) {
    updateQuery.$set = updateData;
  }

  if (Object.keys(pushData).length > 0) {
    updateQuery.$push = pushData;
  }

  // إذا لم يكن هناك بيانات للتحديث
  if (Object.keys(updateQuery).length === 0) {
    return next(new AppError("لم يتم إرسال بيانات صالحة للتحديث", 400));
  }

  const updatedUser = await User.findByIdAndUpdate(req.user.id, updateQuery, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    message: "تم تحديث البيانات بنجاح",
    data: updatedUser,
  });
});
