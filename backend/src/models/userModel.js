import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const { Schema } = mongoose;

// ─── Inline constants (previously in Constants/roles.js) ───────────
const GENDER = Object.freeze({
  MALE: "Male",
  FEMALE: "Female",
});

const ROLES = Object.freeze({
  PATIENT: "patient",
  DOCTOR: "doctor",
  ADMIN: "admin",
});

const BLOOD_TYPES = Object.freeze([
  "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-",
]);

const SALT_ROUNDS = 12;

const TIMEZONES = Object.freeze([
  "Africa/Cairo", "Africa/Johannesburg", "Asia/Dubai", "Asia/Kolkata",
  "Europe/London", "Europe/Paris", "America/New_York", "America/Los_Angeles",
  "America/Toronto", "Australia/Sydney",
]);

// Hard limits to prevent unbounded array growth
const MAX_LIKES_PER_USER = 5000;
const MAX_FOLLOWING = 5000;
const MAX_FOLLOWERS = 50000;
const MAX_MEDICAL_TESTS = 50;

// ─── Sanitize Output (must be defined BEFORE schema) ───────────────
const sanitizeOutput = (_doc, ret) => {
  delete ret.password;
  delete ret.passwordResetToken;
  delete ret.passwordResetExpires;
  delete ret.isDeleted;
  delete ret.__v;
  return ret;
};

// ─── Schema definition ─────────────────────────────────────────────
const userSchema = new Schema({
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
    unique: true,
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
      values: Object.values(GENDER),
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
  personalPhoto: {
    type: String,
    default: null,
  },
  timezone: {
    type: String,
    enum: TIMEZONES,
    default: "Africa/Cairo",
  },
  preferredLanguage: {
    type: String,
    enum: ["en", "ar"],
    default: "ar",
  },
  role: {
    type: String,
    enum: {
      values: Object.values(ROLES),
      message: "Role must be patient, doctor, or admin",
    },
    default: ROLES.PATIENT,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  lastLoginAt: {
    type: Date,
    default: null,
  },
  loginAttempts: {
    type: Number,
    default: 0,
  },
  lockUntil: {
    type: Date,
    default: null,
  },
  following: {
    type: [{ type: Schema.Types.ObjectId, ref: "User" }],
    default: [],
    validate: {
      validator: function (v) {
        return v.length <= MAX_FOLLOWING;
      },
      message: `Cannot follow more than ${MAX_FOLLOWING} users`,
    },
  },
  followers: {
    type: [{ type: Schema.Types.ObjectId, ref: "User" }],
    default: [],
    validate: {
      validator: function (v) {
        return v.length <= MAX_FOLLOWERS;
      },
      message: `Cannot exceed ${MAX_FOLLOWERS} followers`,
    },
  },
  likes: {
    type: [{ type: Schema.Types.ObjectId, ref: "Post" }],
    default: [],
    validate: {
      validator: function (v) {
        return v.length <= MAX_LIKES_PER_USER;
      },
      message: `Cannot like more than ${MAX_LIKES_PER_USER} posts`,
    },
  },
  doctorProfile: {
    specialization: { type: String, trim: true, default: null },
    yearsExperience: { type: Number, min: 0, default: null },
    medicalLicenseNumber: { type: String, unique: true, sparse: true, trim: true, default: null },
    licenseImage: { type: String, default: null },
    about: { type: String, trim: true, default: null },
    price: { type: Number, min: 0, default: null },
  },
  medicalProfile: {
    bloodType: { type: String, enum: BLOOD_TYPES, default: null },
    height: { type: Number, min: 30, max: 300, default: null },
    weight: { type: Number, min: 2, max: 500, default: null },
    conditions: { type: [String], default: [] },
    allergies: { type: [String], default: [] },
    radiologyTests: {
      type: [{
        image: { type: String, default: null },
        description: { type: String, trim: true, default: "" },
        date: { type: Date, default: Date.now },
      }],
      default: [],
      validate: {
        validator: function (v) {
          return v.length <= MAX_MEDICAL_TESTS;
        },
        message: `Cannot store more than ${MAX_MEDICAL_TESTS} radiology tests`,
      },
    },
    labTests: {
      type: [{
        image: { type: String, default: null },
        description: { type: String, trim: true, default: "" },
        uploadedAt: { type: Date, default: Date.now },
      }],
      default: [],
      validate: {
        validator: function (v) {
          return v.length <= MAX_MEDICAL_TESTS;
        },
        message: `Cannot store more than ${MAX_MEDICAL_TESTS} lab tests`,
      },
    },
  },
  passwordResetToken: { type: String, select: false },
  passwordResetExpires: { type: Date, select: false },
  isDeleted: {
    type: Boolean,
    default: false,
    select: false,
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true, transform: sanitizeOutput },
  toObject: { virtuals: true, transform: sanitizeOutput },
});

userSchema.index({ role: 1, isVerified: 1 });
userSchema.index({ "doctorProfile.specialization": 1 });
userSchema.index({ isDeleted: 1 });

userSchema.virtual("followerCount").get(function () {
  return this.followers?.length || 0;
});

userSchema.virtual("followingCount").get(function () {
  return this.following?.length || 0;
});

userSchema.virtual("isDoctor").get(function () {
  return this.role === ROLES.DOCTOR;
});

userSchema.virtual("isPatient").get(function () {
  return this.role === ROLES.PATIENT;
});

userSchema.virtual("isAdmin").get(function () {
  return this.role === ROLES.ADMIN;
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.pre(/^find/, function () {
  this.find({ isDeleted: { $ne: true } });
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.isLocked = function () {
  return !!(this.lockUntil && this.lockUntil > Date.now());
};

userSchema.statics.findByEmail = function (email) {
  return this.findOne({ email: email.toLowerCase().trim() });
};

export default mongoose.model("User", userSchema);
