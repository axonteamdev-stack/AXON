import { getIO } from "../config/socket.js";

export const alertDoctorOfDDI = async (medicationId, doctorId, ddiRisks) => {
  if (!ddiRisks?.conflicts?.length) return;

  const notification = {
    type: "DDI_ALERT",
    severity: ddiRisks.riskLevel,
    medicationId,
    message: `Drug interaction risk detected: ${ddiRisks.conflicts.join(", ")}`,
    recommendation: ddiRisks.recommendation,
    createdAt: new Date(),
  };

  try {
    const io = getIO();
    io.to(doctorId.toString()).emit("ddiAlert", notification);
  } catch (err) {
    console.error("Socket not initialized, logging notification:", notification);
  }
};
