import mongoose from "mongoose";

const { Schema } = mongoose;

const BLOOD_TYPES = Object.freeze([
  "A+",
  "A-",
  "B+",
  "B-",
  "AB+",
  "AB-",
  "O+",
  "O-",
]);

const patientSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      // NO unique: true here — use explicit index below
    },

    // Profile
    bloodType: {
      type: String,
      enum: BLOOD_TYPES,
      default: null,
    },
    height: {
      type: Number,
      min: 30,
      max: 300,
      default: null,
    },
    weight: {
      type: Number,
      min: 2,
      max: 500,
      default: null,
    },
    conditions: {
      type: [String],
      default: [],
    },
    allergies: {
      type: [String],
      default: [],
    },

    // Emergency
    emergencyContact: {
      name: { type: String, default: null },
      phone: { type: String, default: null },
      relationship: { type: String, default: null },
    },
    emergencyQR: {
      token: { type: String, default: null },
      pin: { type: String, default: null },
      expiresAt: { type: Date, default: null },
      usedAt: { type: Date, default: null },
      accessLog: [
        {
          accessedAt: { type: Date, default: Date.now },
          ip: { type: String, default: null },
        },
      ],
    },

    // History
    radiologyTests: [
      {
        image: { type: String, required: true },
        description: { type: String, trim: true, default: "" },
        date: { type: Date, default: Date.now },
        archived: { type: Boolean, default: false },
      },
    ],
    labTests: [
      {
        image: { type: String, required: true },
        description: { type: String, trim: true, default: "" },
        date: { type: Date, default: Date.now },
        archived: { type: Boolean, default: false },
      },
    ],
  },
  { timestamps: true },
);

// Explicit indexes — follows your pattern
patientSchema.index({ userId: 1 }, { unique: true });

export default mongoose.models.Patient ||
  mongoose.model("Patient", patientSchema);
