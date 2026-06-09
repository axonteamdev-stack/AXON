import mongoose from "mongoose";

const { Schema } = mongoose;

const DOSAGE_UNITS = Object.freeze([
    "mg",
    "g",
    "ml",
    "l",
    "mcg",
    "IU",
    "units",
    "tablets",
    "capsules",
    "drops",
    "puffs",
    "patches",
]);

const FREQUENCY_OPTIONS = Object.freeze([
    "once daily",
    "twice daily",
    "three times daily",
    "four times daily",
    "every 4 hours",
    "every 6 hours",
    "every 8 hours",
    "every 12 hours",
    "weekly",
    "monthly",
    "as needed",
]);

const medicationSchema = new Schema(
    {
        patientId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        medicineName: {
            type: String,
            required: true,
            trim: true,
            minlength: [2, "Medicine name must be at least 2 characters"],
        },
        dosage: {
            value: {
                type: Number,
                required: true,
                min: [0.1, "Dosage must be greater than 0"],
            },
            unit: {
                type: String,
                enum: DOSAGE_UNITS,
                required: true,
            },
        },
        frequency: {
            type: String,
            enum: FREQUENCY_OPTIONS,
            required: true,
        },
        intakeTimes: {
            type: [String],
            required: true,
        },
        startDate: {
            type: Date,
            required: true,
        },
        endDate: {
            type: Date,
            required: true,
        },
        indication: {
            type: String,
            trim: true,
            maxlength: [500, "Indication must not exceed 500 characters"],
            default: null,
        },
        notes: {
            type: String,
            trim: true,
            maxlength: [500, "Notes must not exceed 500 characters"],
            default: null,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    },
);

medicationSchema.index({ patientId: 1, isActive: 1 });
medicationSchema.index({ patientId: 1, startDate: -1 });
medicationSchema.index({ endDate: 1 });

medicationSchema.virtual("isExpired").get(function () {
    return new Date() > this.endDate;
});

medicationSchema.pre("save", function () {
    if (this.endDate <= this.startDate) {
        throw new Error("End date must be after start date");
    }
});

export default mongoose.models.Medication || mongoose.model("Medication", medicationSchema);
