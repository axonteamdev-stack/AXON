import axios from "axios";
import Medication from "../models/medicationModel.js";
import User from "../models/userModel.js";

const AI_TIMEOUT_MS = 5000;
const DEFAULT_AI_URL = "http://localhost:5001/api/predict-ddi";

const getAiUrl = () => process.env.AI_DDI_SERVICE_URL || DEFAULT_AI_URL;

export const checkDrugInteractions = async (patientId, newMedicationName) => {
  const activeMedications = await Medication.find({
    patientId,
    isActive: true,
    endDate: { $gt: new Date() },
  }).select("medicineName dosage");

  if (!activeMedications?.length) {
    return { riskLevel: "none", conflicts: [], recommendation: "No active medications to check against" };
  }

  const drugList = [
    ...activeMedications.map((m) => m.medicineName.toLowerCase().trim()),
    newMedicationName.toLowerCase().trim(),
  ];

  try {
    const { data } = await axios.post(
      getAiUrl(),
      { drugs: drugList },
      { timeout: AI_TIMEOUT_MS, headers: { "Content-Type": "application/json" } }
    );
    return {
      riskLevel: data.risk_level || "unknown",
      conflicts: data.conflicts || [],
      recommendation: data.recommendation || "Review with pharmacist",
    };
  } catch (err) {
    console.warn("AI DDI Service unavailable:", err.message);
    return { riskLevel: "unknown", conflicts: [], recommendation: "Review with pharmacist" };
  }
};

export const checkContraindications = async (patientId, medicineName) => {
  const user = await User.findById(patientId).select("medicalProfile");
  if (!user?.medicalProfile) {
    return { allergies: [], conditions: [], requiresManualReview: true };
  }
  return {
    allergies: user.medicalProfile.allergies || [],
    conditions: user.medicalProfile.conditions || [],
    requiresManualReview: true,
  };
};
