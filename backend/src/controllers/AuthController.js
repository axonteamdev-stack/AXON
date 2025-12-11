import fs from "fs";
import Patient from "../models/PatientModel.js";
import Doctor from "../models/DoctorModel.js";
import generateTokenAndSetCookie from "../utils/GenerateToken.js";

const registerPatient = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    const profileImagePath = req.file?.path || null; // single upload
    if (await Patient.findOne({ email }))
      return res
        .status(400)
        .json({ message: "Patient with this email already exists" });

    const patient = await Patient.create({
      fullName,
      email,
      password,
      profileImage: profileImagePath,
    });
    const token = generateTokenAndSetCookie(res, patient._id, "patient");

    res.status(201).json({
      _id: patient._id,
      fullName: patient.fullName,
      email: patient.email,
      role: patient.role,
      token,
      profileImage: profileImagePath,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Server error during patient registration" });
  }
};

const registerDoctor = async (req, res) => {
  const certificateImagePath = req.files?.certificateImage?.[0]?.path || null;
  const profileImagePath = req.files?.profileImage?.[0]?.path || null;

  const cleanupFiles = () => {
    try {
      if (certificateImagePath && fs.existsSync(certificateImagePath))
        fs.unlinkSync(certificateImagePath);
      if (profileImagePath && fs.existsSync(profileImagePath))
        fs.unlinkSync(profileImagePath);
    } catch (err) {
      console.error("Error cleaning up files:", err);
    }
  };

  try {
    if (!certificateImagePath) {
      cleanupFiles();
      return res
        .status(400)
        .json({ message: "Medical certificate image is required." });
    }

    const {
      fullName,
      email,
      password,
      specialization,
      yearsExperience,
      medicalCertificateNumber,
    } = req.body;

    if (await Doctor.findOne({ email })) {
      if (certificateImagePath) fs.unlinkSync(certificateImagePath);
      if (profileImagePath) fs.unlinkSync(profileImagePath);
      return res.status(400).json({ message: "Email exists" });
    }
    if (await Doctor.findOne({ medicalCertificateNumber })) {
      if (certificateImagePath) fs.unlinkSync(certificateImagePath);
      if (profileImagePath) fs.unlinkSync(profileImagePath);
      return res.status(400).json({ message: "Certificate exists" });
    }

    const doctor = await Doctor.create({
      fullName,
      email,
      password,
      specialization,
      yearsExperience,
      medicalCertificateNumber,
      certificateImage: certificateImagePath,
      profileImage: profileImagePath,
      isVerified: false,
    });

    const token = generateTokenAndSetCookie(res, doctor._id, "doctor");

    res.status(201).json({
      _id: doctor._id,
      fullName: doctor.fullName,
      email: doctor.email,
      specialization: doctor.specialization,
      isVerified: doctor.isVerified,
      role: doctor.role,
      token,
      certificateImage: certificateImagePath,
      profileImage: profileImagePath,
    });
  } catch (error) {
    cleanupFiles();
    console.error(error);
    res
      .status(500)
      .json({ message: "Server error during doctor registration" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    let userModel =
      role === "patient" ? Patient : role === "doctor" ? Doctor : null;
    if (!userModel)
      return res.status(400).json({ message: "Invalid login role" });

    const user = await userModel.findOne({ email }).select("+password");
    if (user && (await user.matchPassword(password))) {
      const token = generateTokenAndSetCookie(res, user._id, role);
      const response = {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        token,
      };
      if (role === "doctor") {
        response.specialization = user.specialization;
        response.isVerified = user.isVerified;
      }
      return res.json(response);
    }
    res.status(401).json({ message: "Invalid credentials" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error during login" });
  }
};

const logoutUser = (req, res) => {
  res.cookie("jwt", "", { httpOnly: true, expires: new Date(0) });
  res.status(200).json({ message: "User logged out successfully" });
};

const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    // req.user is already populated by protect middleware
    const role = req.user.role;

    const userModel =
      role === "patient" ? Patient : role === "doctor" ? Doctor : null;

    const user = await userModel.findById(req.user._id).select("+password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if old password is correct
    const isMatch = await user.matchPassword(oldPassword);

    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    // Set new password
    user.password = newPassword;
    await user.save(); // bcryptjs will hash it in pre-save

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error updating password" });
  }
};

export default {
  registerPatient,
  registerDoctor,
  loginUser,
  logoutUser,
  changePassword,
};
