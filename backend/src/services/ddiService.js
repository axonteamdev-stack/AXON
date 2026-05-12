import Medication from "../models/Medication.js";
import MedicalRecord from "../models/MedicalRecord.js";

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
    return {
      riskLevel: "none",
      conflicts: [],
      recommendation: "No active medications to check against",
    };
  }

  const drugList = [
    ...activeMedications.map((m) => m.medicineName.toLowerCase().trim()),
    newMedicationName.toLowerCase().trim(),
  ];

  try {
    const response = await fetch(getAiUrl(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ drugs: drugList }),
      signal: AbortSignal.timeout(AI_TIMEOUT_MS),
    });

    if (!response.ok) throw new Error("AI service error");

    const data = await response.json();
    return {
      riskLevel: data.risk_level || "unknown",
      conflicts: data.conflicts || [],
      recommendation: data.recommendation || "Review with pharmacist",
    };
  } catch (err) {
    console.warn("AI DDI Service unavailable:", err.message);
    return {
      riskLevel: "unknown",
      conflicts: [],
      recommendation: "Review with pharmacist",
    };
  }
};

export const checkContraindications = async (patientId, medicineName) => {
  const record = await MedicalRecord.findOne({ patientId }).select("allergies conditions");
  if (!record) {
    return {
      allergies: [],
      conditions: [],
      requiresManualReview: true,
    };
  }

  return {
    allergies: record.allergies || [],
    conditions: record.conditions || [],
    requiresManualReview: true,
  };
};
