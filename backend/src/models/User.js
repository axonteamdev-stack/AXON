import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const { Schema } = mongoose;

const ROLES = Object.freeze({
    PATIENT: "patient",
    DOCTOR: "doctor",
    ADMIN: "admin",
});

const GENDER = Object.freeze({
    MALE: "Male",
    FEMALE: "Female",
});

const userSchema = new Schema(
    {
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
            enum: Object.values(GENDER),
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
        preferredLanguage: {
            type: String,
            enum: ["en", "ar"],
            default: "ar",
        },
        role: {
            type: String,
            enum: Object.values(ROLES),
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
        doctorProfile: {
            specialization: { type: String, trim: true, default: null },
            yearsExperience: { type: Number, min: 0, default: null },
            medicalLicenseNumber: {
                type: String,
                unique: true,
                sparse: true,
                trim: true,
                default: null,
            },
            licenseImage: { type: String, default: null },
            about: { type: String, trim: true, default: null },
            price: { type: Number, min: 0, default: null },
        },
        passwordResetToken: { type: String, select: false },
        passwordResetExpires: { type: Date, select: false },
        isDeleted: {
            type: Boolean,
            default: false,
            select: false,
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    },
);

userSchema.index({ role: 1, isVerified: 1 });
userSchema.index({ "doctorProfile.specialization": 1 });
userSchema.index({ isDeleted: 1 });

userSchema.virtual("isDoctor").get(function () {
    return this.role === ROLES.DOCTOR;
});

userSchema.virtual("isPatient").get(function () {
    return this.role === ROLES.PATIENT;
});

userSchema.pre("save", async function () {
    if (!this.isModified("password")) return
    this.password = await bcrypt.hash(this.password, 12);
});

userSchema.pre(/^find/, function () {
    this.find({ isDeleted: { $ne: true } });
});

userSchema.methods.matchPassword = async function (enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password);
};

userSchema.statics.findByEmail = function (email) {
    return this.findOne({ email: email.toLowerCase().trim() });
};

export default mongoose.models.User || mongoose.model("User", userSchema);
