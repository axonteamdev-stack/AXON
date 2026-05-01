import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true
  },
  doctor: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true
  },

  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending"
  },

  paymentStatus: {
    type: String,
    enum: ["pending", "held", "paid", "refunded"],
    default: "pending"
  },

  amount: {
    type: Number,
    required: true
  }

}, { timestamps: true });

export default mongoose.model("Appointment", appointmentSchema);
