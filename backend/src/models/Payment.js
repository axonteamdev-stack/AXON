import mongoose from "mongoose";

const PAYMENT_STATUS = Object.freeze({
  PENDING: "pending",
  REQUIRES_PAYMENT_METHOD: "requires_payment_method",
  PROCESSING: "processing",
  SUCCEEDED: "succeeded",
  FAILED: "failed",
  REFUNDED: "refunded",
});

const paymentSchema = new mongoose.Schema(
  {
    appointment: {
      type: mongoose.Schema.ObjectId,
      ref: "Appointment",
      required: true,
      unique: true,
    },
    patient: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    doctor: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: "egp",
      lowercase: true,
    },
    status: {
      type: String,
      enum: Object.values(PAYMENT_STATUS),
      default: PAYMENT_STATUS.PENDING,
    },
    stripeSetupIntentId: {
      type: String,
      default: null,
    },
    stripePaymentIntentId: {
      type: String,
      default: null,
    },
    stripePaymentMethodId: {
      type: String,
      default: null,
    },
    clientSecret: {
      type: String,
      default: null,
    },
    paidAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

paymentSchema.index({ patient: 1 });
paymentSchema.index({ stripePaymentIntentId: 1 });

export default mongoose.models.Payment ||
  mongoose.model("Payment", paymentSchema);
