import mongoose from "mongoose";

const APPOINTMENT_STATUS = Object.freeze({
    PENDING: "pending",
    ACCEPTED: "accepted",
    REJECTED: "rejected",
    COMPLETED: "completed",
    CANCELLED: "cancelled",
});

const appointmentSchema = new mongoose.Schema(
    {
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
        status: {
            type: String,
            enum: Object.values(APPOINTMENT_STATUS),
            default: APPOINTMENT_STATUS.PENDING,
        },
        scheduledAt: {
            type: Date,
            required: true,
        },
        notes: {
            type: String,
            maxlength: 500,
            default: null,
        },
    },
    { timestamps: true },
);

appointmentSchema.index({ doctor: 1, status: 1 });
appointmentSchema.index({ patient: 1, status: 1 });
appointmentSchema.index({ scheduledAt: 1 });

export default mongoose.model("Appointment", appointmentSchema);
