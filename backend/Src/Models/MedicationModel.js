import mongoose from "mongoose";

const { Schema } = mongoose;

const medicationSchema = new Schema(
  {
    patientId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Patient reference is required"],
      // index: true, // Removed: Redundant because patientId is the prefix of the compound indexes below
    },
    medicineName: {
      type: String,
      required: [true, "Medicine name is required"],
      trim: true,
      minlength: [2, "Medicine name must be at least 2 characters"],
    },
    frequency: {
      type: String,
      enum: ["once daily", "twice daily", "three times daily"],
      required: [true, "Frequency is required"],
    },
    intakeTime: {
      type: [String],
      required: [true, "Intake times are required"],
      validate: {
        validator: function (v) {
          return Array.isArray(v) && v.length > 0;
        },
        message: "At least one intake time must be provided",
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
    isActive: {
      type: Boolean,
      default: true,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, "Notes must not exceed 500 characters"],
    },

    // --- Daily Tracker ---
    dailyTracker: [
      {
        time: {
          type: String,
          required: [true, "Time is required"],
        },
        status: {
          type: String,
          enum: ["pending", "taken", "skipped"],
          default: "pending",
        },
        updatedAt: {
          type: Date,
          default: null,
        },
      },
    ],

    lastResetDate: {
      type: String,
      default: () => new Date().toISOString().split("T")[0],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// --- Indexes ---
// These compound indexes already allow efficient searching by patientId alone.
medicationSchema.index({ patientId: 1, isActive: 1 });
medicationSchema.index({ patientId: 1, startDate: -1 });
medicationSchema.index({ endDate: 1 });

// --- Virtuals ---
medicationSchema.virtual("isExpired").get(function () {
  return new Date() > new Date(this.endDate);
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

// --- Pre-save Hook ---
medicationSchema.pre("save", function () {
  // Validate endDate > startDate
  if (this.endDate <= this.startDate) {
    return next(new Error("End date must be after start date"));
  }

  // Reset daily tracker if date changed
  const today = new Date().toISOString().split("T")[0];
  if (this.lastResetDate !== today && this.isModified("dailyTracker")) {
    this.lastResetDate = today;
  }
});

// --- Query Hook ---
medicationSchema.pre(/^find/, function () {
  // Only show active medications by default, unless explicitly querying inactive
  if (!this.getQuery().hasOwnProperty("isActive")) {
    this.where({ isActive: true });
  }
});

export default mongoose.model("Medication", medicationSchema);
