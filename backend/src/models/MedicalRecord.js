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

const medicalRecordSchema = new Schema(
    {
        patientId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },
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
        radiologyTests: [
            {
                image: { type: String, required: true },
                description: { type: String, trim: true, default: "" },
                date: { type: Date, default: Date.now },
            },
        ],
        labTests: [
            {
                image: { type: String, required: true },
                description: { type: String, trim: true, default: "" },
                date: { type: Date, default: Date.now },
            },
        ],
        emergencyQR: {
            token: { type: String, default: null },
            expiresAt: { type: Date, default: null },
        },
    },
    {
        timestamps: true,
    },
);


export default mongoose.models.MedicalRecord || mongoose.model("MedicalRecord", medicalRecordSchema);
