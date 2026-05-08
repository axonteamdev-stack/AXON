import mongoose from "mongoose";

const { Schema } = mongoose;

// ─── Inline constants (previously in Constants/medical.js) ─────────
const DOSAGE_UNITS = Object.freeze([
  "mg", "g", "ml", "l", "mcg", "IU", "units", "tablets", "capsules", "drops", "puffs", "patches",
]);

const FREQUENCY_OPTIONS = Object.freeze([
  "once daily", "twice daily", "three times daily", "four times daily",
  "every 4 hours", "every 6 hours", "every 8 hours", "every 12 hours",
  "weekly", "monthly", "as needed",
]);

const DOSE_STATUSES = Object.freeze([
  "pending", "taken", "skipped", "missed", "late",
]);

const RISK_LEVELS = Object.freeze([
  "none", "low", "moderate", "high", "severe", "unknown",
]);

const medicationSchema = new Schema(
  {
    patientId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Patient reference is required"],
    },
    medicineName: {
      type: String,
      required: [true, "Medicine name is required"],
      trim: true,
      minlength: [2, "Medicine name must be at least 2 characters"],
    },
    dosage: {
      value: {
        type: Number,
        required: [true, "Dosage value is required"],
        min: [0.1, "Dosage must be greater than 0"],
        max: [10000, "Dosage must not exceed 10,000 units"],
      },
      unit: {
        type: String,
        enum: {
          values: DOSAGE_UNITS,
          message: "Invalid dosage unit",
        },
        required: [true, "Dosage unit is required"],
      },
    },
    frequency: {
      type: String,
      enum: FREQUENCY_OPTIONS,
      required: [true, "Frequency is required"],
    },
    intakeTime: {
      type: [String],
      required: [true, "Intake times are required"],
      validate: {
        validator: (v) =>
          Array.isArray(v) &&
          v.length > 0 &&
          v.every((t) => /^\d{1,2}:\d{2}\s?(AM|PM)$/i.test(t)),
        message: "Intake times must be valid 12-hour format (e.g., 10:00 AM)",
      },
    },
    startDate: {
      type: Date,
      required: [true, "Start date is required"],
    },
    endDate: {
      type: Date,
      required: [true, "End date is required"],
    },
    prescribedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Prescriber is required"],
    },
    indication: {
      type: String,
      trim: true,
      maxlength: [500, "Indication must not exceed 500 characters"],
    },
    contraindications: {
      type: [String],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, "Notes must not exceed 500 characters"],
    },
    ddiRisk: {
      checkedAt: Date,
      riskLevel: {
        type: String,
        enum: RISK_LEVELS,
        default: "unknown",
      },
      conflicts: [String],
      recommendation: String,
    },
    dailyTracker: [
      {
        time: {
          type: String,
          required: [true, "Time is required"],
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
      },
    ],
    lastResetDate: {
      type: Date,
      default: () => new Date(),
    },
    auditTrail: [
      {
        action: String,
        actor: { type: Schema.Types.ObjectId, ref: "User" },
        timestamp: { type: Date, default: Date.now },
        details: Schema.Types.Mixed,
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

medicationSchema.index({ patientId: 1, isActive: 1 });
medicationSchema.index({ patientId: 1, startDate: -1 });
medicationSchema.index({ endDate: 1 });
medicationSchema.index({ prescribedBy: 1, createdAt: -1 });

medicationSchema.virtual("isExpired").get(function () {
  return new Date() > this.endDate;
});

medicationSchema.virtual("totalDoses").get(function () {
  return this.dailyTracker?.length || 0;
});

medicationSchema.virtual("takenDoses").get(function () {
  return this.dailyTracker?.filter((d) => d.status === "taken").length || 0;
});

medicationSchema.virtual("pendingDoses").get(function () {
  return this.dailyTracker?.filter((d) => d.status === "pending").length || 0;
});

medicationSchema.pre("save", function (next) {
  if (this.endDate <= this.startDate) {
    return next(new Error("End date must be after start date"));
  }
  next();
});

// Validate frequency vs intakeTime count
medicationSchema.pre("save", function (next) {
  const expectedCounts = {
    "once daily": 1,
    "twice daily": 2,
    "three times daily": 3,
  };
  const expected = expectedCounts[this.frequency];
  if (expected && this.intakeTime.length !== expected) {
    return next(
      new Error(`${this.frequency} requires exactly ${expected} intake times`),
    );
  }
  next();
});

// Audit trail limit
medicationSchema.pre("save", function (next) {
  if (this.auditTrail.length > 100) {
    this.auditTrail = this.auditTrail.slice(-100);
  }
  next();
});

export default mongoose.model("Medication", medicationSchema);
