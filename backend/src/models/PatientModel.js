import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const patientSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false, // Do not return the password hash by default
    },
    role: {
      type: String,
      default: "patient",
      immutable: true,
    },
    profileImage: {
      type: String, // مسار الصورة داخل مجلد personalphoto
      default: "", // يمكن تركها فارغة في البداية
    },
  },
  {
    timestamps: true,
  }
);

// Method to compare passwords for login
patientSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Middleware to hash password before saving (Only run on password modification)
patientSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const Patient = mongoose.model("Patient", patientSchema);

export default Patient;
