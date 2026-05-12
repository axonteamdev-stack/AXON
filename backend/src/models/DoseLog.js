import mongoose from "mongoose";

const { Schema } = mongoose;

const DOSE_STATUSES = Object.freeze([
  "pending", "taken", "skipped", "missed",
]);

const doseLogSchema = new Schema({
  patientId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  medicationId: {
    type: Schema.Types.ObjectId,
    ref: "Medication",
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: DOSE_STATUSES,
    default: "pending",
  },
  updatedAt: {
    type: Date,
    default: null,
  },
}, {
  timestamps: true,
});

doseLogSchema.index({ patientId: 1, medicationId: 1, date: 1 });
doseLogSchema.index({ patientId: 1, date: 1 });
doseLogSchema.index({ status: 1, date: 1 });

export default mongoose.model("DoseLog", doseLogSchema);
