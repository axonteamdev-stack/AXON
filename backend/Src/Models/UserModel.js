import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    // --- Basic Info ---
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      minlength: [3, "Full name must be at least 3 characters"],
      maxlength: [50, "Full name must not exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true, // This ALREADY creates an index
      lowercase: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    gender: {
      type: String,
      enum: {
        values: ["Male", "Female"],
        message: "Gender must be Male or Female",
      },
      required: [true, "Gender is required"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },

    // --- Profile Photo ---
    personalPhoto: {
      type: String,
      default: null,
    },

    // --- Role & Permissions ---
    role: {
      type: String,
      enum: {
        values: ["patient", "doctor", "admin"],
        message: "Role must be patient, doctor, or admin",
      },
      default: "patient",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },

    // --- Social ---
    following: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],
    followers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],

    // --- Doctor Profile (only if role === "doctor") ---
    doctorProfile: {
      specialization: {
        type: String,
        trim: true,
        default: null,
      },
      yearsExperience: {
        type: Number,
        min: [0, "Years of experience cannot be negative"],
        default: null,
      },
      medicalLicenseNumber: {
        type: String,
        unique: true,
        sparse: true,
        trim: true,
        default: null,
      },
      licenseImage: {
        type: String,
        default: null,
      },
      about: {
        type: String,
        trim: true,
        default: null,
      },
      price: {
        type: Number,
        min: [0, "Price cannot be negative"],
        default: null,
      },
    },

    // --- Patient Profile (only if role === "patient") ---
    medicalProfile: {
      bloodType: {
        type: String,
        enum: {
          values: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
          message: "Invalid blood type",
        },
        default: null,
      },
      height: {
        type: Number,
        min: [30, "Height must be at least 30 cm"],
        max: [300, "Height must not exceed 300 cm"],
        default: null,
      },
      weight: {
        type: Number,
        min: [2, "Weight must be at least 2 kg"],
        max: [500, "Weight must not exceed 500 kg"],
        default: null,
      },
      conditions: {
        type: [String],
        default: [],
      },
      allergies: {
        type: [String],
        default: [],
      },
      radiologyTests: [
        {
          image: { type: String, default: null },
          description: { type: String, trim: true, default: "" },
          date: { type: Date, default: () => new Date() },
        },
      ],
      labTests: [
        {
          image: { type: String, default: null },
          description: { type: String, trim: true, default: "" },
          uploadedAt: { type: Date, default: () => new Date() },
        },
      ],
    },

    // --- Password Reset ---
    passwordResetToken: { type: String, select: false },
    passwordResetExpires: { type: Date, select: false },

    // --- Soft Delete ---
    isDeleted: {
      type: Boolean,
      default: false,
      select: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret.password;
        delete ret.passwordResetToken;
        delete ret.passwordResetExpires;
        delete ret.__v;
        delete ret.isDeleted;
        return ret;
      },
    },
    toObject: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret.password;
        delete ret.passwordResetToken;
        delete ret.passwordResetExpires;
        delete ret.__v;
        delete ret.isDeleted;
        return ret;
      },
    },
  },
);

// --- Indexes ---
// REMOVED userSchema.index({ email: 1 }); because unique: true handles it.
userSchema.index({ role: 1, isVerified: 1 });
userSchema.index({ "doctorProfile.specialization": 1 });
userSchema.index({ isDeleted: 1 });

// --- Virtuals ---
userSchema.virtual("followerCount").get(function () {
  return this.followers?.length || 0;
});

userSchema.virtual("followingCount").get(function () {
  return this.following?.length || 0;
});

userSchema.virtual("isDoctor").get(function () {
  return this.role === "doctor";
});

userSchema.virtual("isPatient").get(function () {
  return this.role === "patient";
});

userSchema.virtual("isAdmin").get(function () {
  return this.role === "admin";
});

// --- Pre-save Hook: Hash Password ---
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// --- Query Hook: Soft Delete Filter ---
userSchema.pre(/^find/, function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

// --- Instance Methods ---
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// --- Static Methods ---
userSchema.statics.findByEmail = function (email) {
  return this.findOne({ email: email.toLowerCase().trim() });
};

export default mongoose.model("User", userSchema);
