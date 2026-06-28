import Medication from "../models/Medication.js";
import Patient from "../models/Patient.js";

const AI_TIMEOUT_MS = 15000;
const DEFAULT_AI_URL = "http://localhost:5001/api/predict-ddi-batch";

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
      pairwiseResults: [],
    };
  }

  const drugList = [
    ...activeMedications.map((m) => m.medicineName.toLowerCase().trim()),
    newMedicationName.toLowerCase().trim(),
  ];

  return await callAiService(drugList);
};

export const checkDirectDrugInteractions = async (drugs) => {
  const drugList = drugs.map((d) => d.toLowerCase().trim());
  return await callAiService(drugList);
};

const callAiService = async (drugList) => {
  try {
    const response = await fetch(getAiUrl(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ drugs: drugList }),
      signal: AbortSignal.timeout(AI_TIMEOUT_MS),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`AI service error ${response.status}: ${errText}`);
    }

    const data = await response.json();
    return {
      riskLevel: data.risk_level || "unknown",
      conflicts: data.conflicts || [],
      recommendation: data.recommendation || "Review with pharmacist",
      pairwiseResults: data.pairwise_results || [],
      modelUsed: data.model_used || "unknown",
      confidence: data.confidence,
    };
  } catch (err) {
    console.warn("AI DDI Service unavailable:", err.message);
    return {
      riskLevel: "unknown",
      conflicts: [],
      recommendation: "AI service unavailable. Review with pharmacist manually.",
      pairwiseResults: [],
      modelUsed: "offline",
    };
  }
};

export const checkContraindications = async (patientId, medicineName) => {
  const record = await Patient.findOne({ userId: patientId }).select(
    "allergies conditions",
  );
  if (!record) {
    return {
      allergies: [],
      conditions: [],
      requiresManualReview: true,
    };
  }

  const hasRiskFactors =
    (record.allergies?.length > 0) || (record.conditions?.length > 0);

  return {
    allergies: record.allergies || [],
    conditions: record.conditions || [],
    requiresManualReview: hasRiskFactors,
    medicineName,
  };
};

export const checkMultipleInteractions = async (patientId, newMedications) => {
  const results = [];
  for (const med of newMedications) {
    const result = await checkDrugInteractions(patientId, med);
    results.push({ medicineName: med, ...result });
  }
  return results;
};
