import mongoose from "mongoose";

const medicationSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  medicineName: { type: String, required: [true, "اسم الدواء مطلوب"], trim: true },
  frequency: { 
    type: String, 
    enum: ["once daily", "twice daily", "three times daily"], 
    required: [true, "التكرار مطلوب"] 
  },
  intakeTime: { type: [String], required: [true, "مواعيد الجرعات مطلوبة"] },
  startDate: { type: Date, required: [true, "تاريخ بداية الدواء مطلوب"] },
  endDate: { type: Date, required: [true, "تاريخ نهاية الدواء مطلوب"] },
  isActive: { type: Boolean, default: true },
  notes: { type: String, trim: true },
  
  // --- الحقول الجديدة للـ Tracker ---
  dailyTracker: [
    {
      time: String, // الموعد (مثلاً 10:00 AM)
      status: { 
        type: String, 
        enum: ['pending', 'taken', 'skipped'], 
        default: 'pending' 
      },
      updatedAt: { type: Date, default: Date.now }
    }
  ],
  lastResetDate: { 
    type: String, 
    default: new Date().toISOString().split('T')[0] // لتصفير الجرعات يومياً
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

export default mongoose.model("Medication", medicationSchema);
