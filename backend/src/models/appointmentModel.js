import mongoose from "mongoose";

const APPOINTMENT_STATUS = Object.freeze({
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
});

const PAYMENT_STATUS = Object.freeze({
  HELD: "held",
  RELEASED: "released",
  REFUNDED: "refunded",
  FAILED: "failed",
});

const appointmentSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  doctor: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  status: {
    type: String,
    enum: Object.values(APPOINTMENT_STATUS),
    default: APPOINTMENT_STATUS.PENDING,
  },
  paymentStatus: {
    type: String,
    enum: Object.values(PAYMENT_STATUS),
    default: PAYMENT_STATUS.HELD,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  currency: {
    type: String,
    default: "EGP",
  },
  scheduledAt: {
    type: Date,
    required: true,
  },
  cancellationReason: {
    type: String,
    default: null,
  },
  cancelledBy: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    default: null,
  },
  notes: {
    type: String,
    maxlength: 500,
    default: null,
  },
}, { timestamps: true });

appointmentSchema.index({ doctor: 1, status: 1 });
appointmentSchema.index({ patient: 1, status: 1 });
appointmentSchema.index({ scheduledAt: 1 });

export default mongoose.model("Appointment", appointmentSchema);
