import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const doctorSchema = new mongoose.Schema(
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
      select: false,
    },
    specialization: {
      type: String,
      required: [true, "Specialization is required"],
    },
    yearsExperience: {
      type: Number,
      required: [true, "Years of experience is required"],
      min: 0,
    },
    medicalCertificateNumber: {
      type: String,
      required: [true, "Medical certificate number is required"],
      unique: true,
    },
    certificateImage: {
      type: String, // Path to the uploaded file
      required: [true, "Medical certificate image is required"],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      default: "doctor",
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

// Method to compare passwords
doctorSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Middleware to hash password before saving
doctorSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const Doctor = mongoose.model("Doctor", doctorSchema);

export default Doctor;
