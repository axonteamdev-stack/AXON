import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    // البيانات الأساسية (الشاشة 1)
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phoneNumber: { type: String, required: true },
    gender: { type: String, enum: ["Male", "Female"], required: true },
    password: { type: String, required: true, select: false },

    // التحكم في الصلاحيات
    role: {
      type: String,
      enum: ["patient", "doctor", "admin"],
      default: "patient",
    },
    isVerified: { type: Boolean, default: false },

    // بروفايل المريض (الشاشة 3 للمريض)
    medicalProfile: {
      bloodType: String,
      height: Number,
      weight: Number,
      conditions: [String],
      allergies: [String],
      radiologyImage: String,
      radiologyDescription: String,
    },

    // بروفايل الطبيب (الشاشة 3 للطبيب)
    doctorProfile: {
      specialization: String,
      yearsExperience: Number,
      medicalLicenseNumber: { type: String, unique: true, sparse: true },
      licenseImage: String,
    },

    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  { timestamps: true }
);

// Hash password before saving (using async/await)
userSchema.pre("save", async function () {
  // Only hash if password is modified
  if (!this.isModified("password")) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare passwords at login
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("User", userSchema);
