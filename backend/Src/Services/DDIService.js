/**
 * DDIService - Drug-Drug Interaction Service
 * ✅ CRITICAL FIX: Integrate with AI/DDI prediction system
 * Handles integration with AI model to detect medication interactions
 */

import axios from "axios";
import AppError from "../Utils/AppError.js";
import { msg } from "../Utils/ResponseHelper.js";
import Medication from "../Models/MedicationModel.js";

export class DDIService {
  static AI_DDI_SERVICE_URL =
    process.env.AI_DDI_SERVICE_URL || "http://localhost:5001/api/predict-ddi";

  /**
   * Check for drug-drug interactions when new medication is prescribed
   * ✅ MEDICAL SAFETY: Non-blocking background check
   * Returns: { riskLevel: 'none'|'mild'|'moderate'|'severe'|'unknown', conflicts: [...], recommendation: '...' }
   */
  static async checkDrugInteractions(patientId, newMedicationName) {
    try {
      // Get patient's active medications
      const activeMedications = await Medication.find({
        patientId,
        isActive: true,
        endDate: { $gt: new Date() },
      }).select("medicineName dosage");

      if (!activeMedications || activeMedications.length === 0) {
        return {
          riskLevel: "none",
          conflicts: [],
          recommendation: "No active medications to check against",
        };
      }

      const drugList = [
        ...activeMedications.map((m) => m.medicineName),
        newMedicationName,
      ];

      try {
        // ✅ CALL AI SERVICE: Send drug combinations for DDI prediction
        const response = await axios.post(
          this.AI_DDI_SERVICE_URL,
          { drugs: drugList },
          {
            timeout: 5000,
            headers: { "Content-Type": "application/json" },
          },
        );

        return {
          riskLevel: response.data.risk_level || "unknown",
          conflicts: response.data.conflicts || [],
          recommendation:
            response.data.recommendation || "Review with pharmacist",
        };
      } catch (aiError) {
        // ✅ FALLBACK: Graceful degradation if AI service unavailable
        console.warn(
          "AI DDI Service unavailable, returning safe default:",
          aiError.message,
        );
        return {
          riskLevel: "unknown",
          conflicts: [],
          recommendation:
            "Unable to check interactions. Manual pharmacist review recommended.",
        };
      }
    } catch (error) {
      console.error("DDI Service error:", error.message);

      // Return safe default rather than crash
      return {
        riskLevel: "unknown",
        conflicts: [],
        recommendation: "Unable to check interactions. Contact pharmacist.",
      };
    }
  }

  /**
   * Notify doctor of DDI risks
   * ✅ NON-BLOCKING: Executed as background task
   */
  static async alertDoctorOfDDI(medicationId, doctorId, ddiRisks) {
    if (!ddiRisks || ddiRisks.conflicts.length === 0) return;

    try {
      // ✅ BACKGROUND TASK: Non-blocking notification
      const notification = {
        type: "DDI_ALERT",
        severity: ddiRisks.riskLevel,
        medicationId,
        message: `Drug interaction risk detected: ${ddiRisks.conflicts.join(", ")}`,
        recommendation: ddiRisks.recommendation,
        createdAt: new Date(),
      };

      // Log for audit trail
      console.log(`⚠️ DDI Alert for Doctor ${doctorId}:`, notification);

      // TODO: Implement notification queue (e.g., notification service)
      // await NotificationService.queueNotification(doctorId, notification);
    } catch (error) {
      console.error("Failed to alert doctor of DDI:", error.message);
      // Don't throw - this is a background operation
    }
  }

  /**
   * Check if medication has critical contraindications for patient
   */
  static async checkContraindications(patientId, medicineName) {
    const user = await User.findById(patientId).select("medicalProfile");

    if (!user || !user.medicalProfile) return [];

    // ✅ MEDICAL SAFETY: Check against known allergies and conditions
    const allergies = user.medicalProfile.allergies || [];
    const conditions = user.medicalProfile.conditions || [];

    // This would ideally connect to a contraindication database
    // For now, log for manual review
    return {
      allergies,
      conditions,
      requiresManualReview: true,
    };
  }
}

export default DDIService;
