import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    // البيانات الأساسية (الشاشة 1)
    fullName: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phoneNumber: { type: String, required: true },
    gender: { type: String, enum: ["Male", "Female"], required: true },
    password: { type: String, required: true, select: false },
    profileImage: String, // Add this field

    // --- التحكم في الصلاحيات ---
    role: {
      type: String,
      enum: ["patient", "doctor", "admin"],
      default: "patient",
    },
    isVerified: { type: Boolean, default: false },

    // --- بروفايل الطبيب (يُملأ فقط إذا كان الدور doctor) ---
    doctorProfile: {
      specialization: String,
      yearsExperience: Number,
      medicalLicenseNumber: { type: String, unique: true, sparse: true },
      licenseImage: String,
      about: {
        type: String,
        required: function () {
          return this.role === "doctor";
        },
      },
      price: {
        type: Number,
        required: function () {
          return this.role === "doctor";
        },
      },
    },

    // --- بروفايل المريض (يُملأ فقط إذا كان الدور patient) ---
    medicalProfile: {
      bloodType: String,
      height: Number,
      weight: Number,
      conditions: { type: [String], default: [] },
      allergies: { type: [String], default: [] },
      radiologyImage: String,
      radiologyDescription: String,
    },

    // --- بيانات استعادة كلمة المرور ---
    passwordResetToken: { type: String, select: false },
    passwordResetExpires: { type: Date, select: false },
  },
  {
    timestamps: true,
    // تحويل البيانات عند إرسالها كـ JSON (لإخفاء البيانات الحساسة)
    toJSON: {
      transform: function (doc, ret) {
        delete ret.password;
        delete ret.passwordResetToken;
        delete ret.passwordResetExpires;
        delete ret.__v;
        return ret;
      },
    },
  },
);

/**
 * تشفير كلمة المرور قبل الحفظ (Middleware)
 */
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

/**
 * مقارنة كلمة المرور عند تسجيل الدخول
 */
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("User", userSchema);
