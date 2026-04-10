import mongoose from "mongoose";

const medicationSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  medicineName: {
    type: String,
    required: [true, "اسم الدواء مطلوب"],
    trim: true
  },
  frequency: {
    type: String,
    enum: ["once daily", "twice daily", "three times daily"],
    required: [true, "التكرار مطلوب"]
  },
  intakeTime: {
    type: [String], // مصفوفة لتحديد المواعيد
    required: [true, "مواعيد الجرعات مطلوبة"]
  },
  startDate: {
    type: Date,
    required: [true, "تاريخ بداية الدواء مطلوب"]
  },
  isActive: {
    type: Boolean,
    default: true
  },
  endDate: {
    type: Date,
    required: [true, "تاريخ نهاية الدواء مطلوب"]
  },
  // تم حذف duration نهائياً 
  // حقل الملاحظات اختياري (ليس له required)
  notes: {
    type: String,
    trim: true
  }
}, { 
  timestamps: true,
  // إضافة خاصية لتحويل التاريخ لشكل مقروء عند الإرسال كـ JSON
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

export default mongoose.model("Medication", medicationSchema);
