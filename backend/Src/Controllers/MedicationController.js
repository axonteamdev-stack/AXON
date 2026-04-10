import Medication from "../Models/MedicationModel.js";
import { catchAsync } from "../Utils/AppError.js";
import { sendResponse } from "../Utils/AppError.js";
import AppError from "../Utils/AppError.js";

/** * --- دوال مساعدة لحساب التوقيت (تبقى كما هي) ---
 */
const parseTime = (timeStr) => {
    const [time, modifier] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    if (modifier === 'PM' && hours < 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;
    return { hours, minutes };
};

const formatTime = (h, m) => {
    const modifier = h >= 12 ? 'PM' : 'AM';
    let hours = h % 12 || 12;
    let minutes = m < 10 ? `0${m}` : m;
    return `${hours}:${minutes} ${modifier}`;
};

const generateIntakeTimes = (firstTime, frequency) => {
    const { hours, minutes } = parseTime(firstTime);
    const times = [firstTime];

    if (frequency === "twice daily") {
        const secondHour = (hours + 12) % 24;
        times.push(formatTime(secondHour, minutes));
    } else if (frequency === "three times daily") {
        const secondHour = (hours + 8) % 24;
        const thirdHour = (hours + 16) % 24;
        times.push(formatTime(secondHour, minutes));
        times.push(formatTime(thirdHour, minutes));
    }
    return times;
};

/** * --- الـ Controller Functions المعدلة ---
 */

// 1. جلب الأدوية وتحديث الحالة تلقائياً
export const getMyMedications = catchAsync(async (req, res, next) => {
    const now = new Date();
    // تحديث الأدوية التي انتهت صلاحيتها
    await Medication.updateMany(
        { patientId: req.user.id, endDate: { $lt: now }, isActive: true },
        { isActive: false }
    );

    const medications = await Medication.find({ patientId: req.user.id }).sort({ createdAt: -1 });
    
    // استخدام sendResponse للنجاح
    sendResponse(res, 200, {
        ar: "تم جلب قائمة الأدوية بنجاح",
        en: "Medications list fetched successfully"
    }, medications);
});

// 2. إضافة دواء جديد
export const addMedication = catchAsync(async (req, res, next) => {
    const { medicineName, frequency, intakeTime, startDate, endDate } = req.body;
    const medicineNameClean = medicineName?.trim();
    const now = new Date();
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const start = new Date(startDate);
    const end = new Date(endDate);

    // أخطاء مترجمة
    if (start < startOfToday) {
        return next(new AppError({
            ar: 'تاريخ البداية لا يمكن أن يكون في الماضي',
            en: 'Start date cannot be in the past'
        }, 400));
    }
    if (end < now) {
        return next(new AppError({
            ar: 'تاريخ النهاية لا يمكن أن يكون في الماضي',
            en: 'End date cannot be in the past'
        }, 400));
    }

    const existingMed = await Medication.findOne({
        patientId: req.user.id,
        medicineName: { $regex: new RegExp(`^${medicineNameClean}$`, 'i') },
        $or: [{ endDate: { $gte: startOfToday } }, { isActive: true }]
    });

    if (existingMed) {
        return next(new AppError({
            ar: 'هذا الدواء مضاف بالفعل وما زال سارياً.',
            en: 'This medication is already added and still active.'
        }, 400));
    }

    const calculatedTimes = generateIntakeTimes(intakeTime, frequency);
    const diffDays = Math.ceil(Math.abs(end - start) / (1000 * 60 * 60 * 24));

    const medication = await Medication.create({
        ...req.body,
        medicineName: medicineNameClean,
        intakeTime: calculatedTimes,
        duration: `${diffDays} days`,
        patientId: req.user.id,
        isActive: true
    });

    sendResponse(res, 201, {
        ar: "تمت إضافة الدواء بنجاح",
        en: "Medication added successfully"
    }, medication);
});

// 3. تعديل دواء موجود
export const updateMedication = catchAsync(async (req, res, next) => {
    const now = new Date();
    let medication = await Medication.findOne({ _id: req.params.id, patientId: req.user.id });

    if (!medication) {
        return next(new AppError({
            ar: 'الدواء غير موجود',
            en: 'Medication not found'
        }, 404));
    }

    if (req.body.intakeTime || req.body.frequency) {
        const freq = req.body.frequency || medication.frequency;
        const firstTime = req.body.intakeTime || medication.intakeTime[0];
        req.body.intakeTime = generateIntakeTimes(firstTime, freq);
    }

    if (req.body.startDate || req.body.endDate) {
        const start = new Date(req.body.startDate || medication.startDate);
        const end = new Date(req.body.endDate || medication.endDate);
        if (end < start) {
            return next(new AppError({
                ar: 'تاريخ النهاية غير منطقي مقارنة بالبداية',
                en: 'End date is not logical compared to start date'
            }, 400));
        }
        req.body.duration = `${Math.ceil(Math.abs(end - start) / (1000 * 60 * 60 * 24))} days`;
        req.body.isActive = end >= now;
    }

    const updatedMed = await Medication.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    sendResponse(res, 200, {
        ar: "تم تحديث بيانات الدواء بنجاح",
        en: "Medication updated successfully"
    }, updatedMed);
});




// جلب دواء واحد بواسطة الـ ID
export const getSingleMedication = catchAsync(async (req, res, next) => {
    const medication = await Medication.findOne({ 
        _id: req.params.id, 
        patientId: req.user.id // لضمان أن المريض يرى أدوية تخصه فقط
    });

    if (!medication) {
        return next(new AppError({
            ar: 'الدواء غير موجود',
            en: 'Medication not found'
        }, 404));
    }

    sendResponse(res, 200, {
        ar: "تم جلب بيانات الدواء بنجاح",
        en: "Medication details fetched successfully"
    }, medication);
});





// 4. حذف دواء
export const deleteMedication = catchAsync(async (req, res, next) => {
    const med = await Medication.findOneAndDelete({ _id: req.params.id, patientId: req.user.id });
    
    if (!med) {
        return next(new AppError({
            ar: 'الدواء غير موجود',
            en: 'Medication not found'
        }, 404));
    }

    sendResponse(res, 200, {
        ar: 'تم حذف الدواء بنجاح',
        en: 'Medication deleted successfully'
    });
});
