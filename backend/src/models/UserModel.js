import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    // --- البيانات الأساسية ---
    fullName: { 
      type: String, 
      required: [true, "الاسم الكامل مطلوب"],
      trim: true 
    },
    email: { 
      type: String, 
      required: [true, "البريد الإلكتروني مطلوب"], 
      unique: true, 
      lowercase: true,
      trim: true
    },
    phoneNumber: { 
      type: String, 
      required: [true, "رقم الهاتف مطلوب"] 
    },
    gender: { 
      type: String, 
      enum: ["Male", "Female"], 
      required: [true, "الجنس مطلوب"] 
    },
    password: { 
      type: String, 
      required: [true, "كلمة المرور مطلوبة"], 
      select: false // لن تظهر في استعلامات البحث العادية
    },

    // --- الصورة الشخصية (متاحة للطبيب والمريض) ---
    personalPhoto: { 
      type: String, 
      default: null 
    },

    // --- التحكم في الصلاحيات ---
    role: {
      type: String,
      enum: ["patient", "doctor", "admin"],
      default: "patient",
    },
    isVerified: { 
      type: Boolean, 
      default: false 
    },

    // --- بروفايل الطبيب (يُملأ فقط إذا كان الدور doctor) ---
    doctorProfile: {
      specialization: String,
      yearsExperience: Number,
      medicalLicenseNumber: { 
        type: String, 
        unique: true, 
        sparse: true // يسمح بوجود قيم null مكررة للمرضى
      },
      licenseImage: String,
      about: { 
        type: String, 
        required: function() { return this.role === 'doctor'; } 
      },
      price: { 
        type: Number, 
        required: function() { return this.role === 'doctor'; } 
      },
    },

    // --- بروفايل المريض (يُملأ فقط إذا كان الدور patient) ---
    medicalProfile: {
      bloodType: String,
      height: Number,
      weight: Number,
      conditions: {
        type: [String],
        default: []
      },
      allergies: {
        type: [String],
        default: []
      },
      radiologyTests: [{
    image: String,
    description: String,
    date: { type: Date, default: Date.now }
  }],
  labTests: [
  {
    image: String, // تم التغيير من labImage إلى image
    description: String, // تم التغيير من labDescription إلى description
    uploadedAt: { type: Date, default: Date.now }
  }
  ]
  },

    // --- بيانات استعادة كلمة المرور ---
    passwordResetToken: { type: String, select: false },
    passwordResetExpires: { type: Date, select: false },
  },
  { 
    timestamps: true,
    // تحويل البيانات عند إرسالها كـ JSON (لإخفاء البيانات الحساسة)
    toJSON: {
      transform: function(doc, ret) {
        delete ret.password;
        delete ret.passwordResetToken;
        delete ret.passwordResetExpires;
        delete ret.__v;
        return ret;
      }
    },
    toObject: { transform: true }
  }
);

/**
 * تشفير كلمة المرور قبل الحفظ (Middleware)
 */
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

/**
 * مقارنة كلمة المرور عند تسجيل الدخول
 */
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("User", userSchema);
