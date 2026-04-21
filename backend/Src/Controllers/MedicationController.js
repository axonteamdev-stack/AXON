import Medication from "../Models/MedicationModel.js";
import { catchAsync } from "../Utils/AppError.js";
import { sendResponse } from "../Utils/AppError.js";
import AppError from "../Utils/AppError.js";


/** * --- دوال مساعدة لحساب التوقيت (مهمة لإنشاء الـ Tracker) ---
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




const syncDailyTracker = async (medication) => {
    const today = new Date().toISOString().split('T')[0];
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    // 🟢 1. لو يوم جديد → Reset لكل الجرعات
    if (medication.lastResetDate !== today) {
        medication.dailyTracker = medication.intakeTime.map(time => ({
            time,
            status: 'pending',
            updatedAt: new Date()
        }));

        medication.lastResetDate = today;

        medication.markModified('dailyTracker');
        await medication.save();
    }

    // 🔴 2. تحويل الجرعات اللي فات وقتها إلى skipped
    let modified = false;

    for (let i = 0; i < medication.dailyTracker.length; i++) {
        const dose = medication.dailyTracker[i];

        if (dose.status === 'pending') {
            const { hours, minutes } = parseTime(dose.time);
            const doseMinutes = hours * 60 + minutes;

            // لو وقت الجرعة عدى
            if (doseMinutes < currentMinutes) {
                medication.dailyTracker[i].status = 'skipped';
                medication.dailyTracker[i].updatedAt = new Date();
                modified = true;
            }
        }
    }

    // 🟡 3. احفظ لو حصل تعديل
    if (modified) {
        medication.markModified('dailyTracker');
        await medication.save();
    }

    return medication;
};













/** * --- الـ Controller Functions ---
 */

// 1. جلب الأدوية وتحديث الحالة تلقائياً
export const getMyMedications = catchAsync(async (req, res, next) => {
    const now = new Date();
    // تحديث الأدوية التي انتهت صلاحيتها
    await Medication.updateMany(
        { patientId: req.user.id, endDate: { $lt: now }, isActive: true },
        { isActive: false }
    );

    let medications = await Medication.find({ patientId: req.user.id }).sort({ createdAt: -1 });
    
    // مزامنة الـ Tracker لكل دواء قبل إرساله (لضمان ظهور حالة اليوم الحالي)
    // medications = medications.map(med => syncDailyTracker(med));

    // استبدل السطر بـ loop ينتظر التنفيذ
for (let i = 0; i < medications.length; i++) {
    medications[i] = await syncDailyTracker(medications[i]);
}



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

    if (start < startOfToday) {
        return next(new AppError({ ar: 'تاريخ البداية لا يمكن أن يكون في الماضي', en: 'Start date cannot be in the past' }, 400));
    }
    if (end < now) {
        return next(new AppError({ ar: 'تاريخ النهاية لا يمكن أن يكون في الماضي', en: 'End date cannot be in the past' }, 400));
    }

    const existingMed = await Medication.findOne({
        patientId: req.user.id,
        medicineName: { $regex: new RegExp(`^${medicineNameClean}$`, 'i') },
        $or: [{ endDate: { $gte: startOfToday } }, { isActive: true }]
    });

    if (existingMed) {
        return next(new AppError({ ar: 'هذا الدواء مضاف بالفعل وما زال سارياً.', en: 'This medication is already added and still active.' }, 400));
    }

    const calculatedTimes = generateIntakeTimes(intakeTime, frequency);
    
    // إنشاء الدواء مع الـ Tracker الابتدائي
    const medication = await Medication.create({
        ...req.body,
        medicineName: medicineNameClean,
        intakeTime: calculatedTimes,
        dailyTracker: calculatedTimes.map(t => ({ time: t, status: 'pending' })),
        lastResetDate: new Date().toISOString().split('T')[0],
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
        return next(new AppError({ ar: 'الدواء غير موجود', en: 'Medication not found' }, 404));
    }

    if (req.body.intakeTime || req.body.frequency) {
        const freq = req.body.frequency || medication.frequency;
        const firstTime = req.body.intakeTime || medication.intakeTime[0];
        req.body.intakeTime = generateIntakeTimes(firstTime, freq);
        // تحديث الـ Tracker في حال تغير المواعيد
        req.body.dailyTracker = req.body.intakeTime.map(t => ({ time: t, status: 'pending' }));
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




// 4. تسجيل الجرعة كـ "تم الأخذ" (Taken) - نسخة مطورة
export const markAsTaken = catchAsync(async (req, res, next) => {
    const medication = await Medication.findOne({ _id: req.params.id, patientId: req.user.id });
    if (!medication) return next(new AppError({ ar: 'الدواء غير موجود' }, 404));

    // syncDailyTracker(medication);

    await syncDailyTracker(medication); // صح

    

    // بنغير حالة أول جرعة pending بس (اللي هي المفروض ظاهرة في الـ Dashboard)
    const doseIndex = medication.dailyTracker.findIndex(d => d.status === 'pending');

    if (doseIndex === -1) {
        return next(new AppError({ ar: 'لا توجد جرعات متبقية' }, 400));
    }

    medication.dailyTracker[doseIndex].status = 'taken';
    medication.dailyTracker[doseIndex].updatedAt = new Date();

    // السطر ده هو اللي بيخلي المونجوس يحس بالتغيير جوه المصفوفة
    medication.markModified('dailyTracker'); 
    await medication.save();

    sendResponse(res, 200, { ar: "تم تسجيل الجرعة" }, medication);
});

// 5. تسجيل الجرعة كـ "تخطي" (Skip) - نسخة مطورة
export const skipDose = catchAsync(async (req, res, next) => {
    let medication = await Medication.findOne({ _id: req.params.id, patientId: req.user.id });
    if (!medication) return next(new AppError({ ar: 'الدواء غير موجود', en: 'Medication not found' }, 404));

    // syncDailyTracker(medication);

    await syncDailyTracker(medication); // صح



    const doseToUpdate = medication.dailyTracker.find(d => d.status === 'pending');

    if (!doseToUpdate) {
        return next(new AppError({ ar: 'لا توجد جرعات متبقية لتخطيها', en: 'No pending doses to skip' }, 400));
    }

    doseToUpdate.status = 'skipped';
    doseToUpdate.updatedAt = new Date();

    medication.markModified('dailyTracker');
    await medication.save();

    sendResponse(res, 200, { ar: "تم تخطي الجرعة", en: "Dose skipped" }, medication);
});






// جلب دواء واحد بواسطة الـ ID
export const getSingleMedication = catchAsync(async (req, res, next) => {
    let medication = await Medication.findOne({ _id: req.params.id, patientId: req.user.id });

    if (!medication) {
        return next(new AppError({ ar: 'الدواء غير موجود', en: 'Medication not found' }, 404));
    }

    // syncDailyTracker(medication);

    await syncDailyTracker(medication); // صح
    

    sendResponse(res, 200, {
        ar: "تم جلب بيانات الدواء بنجاح",
        en: "Medication details fetched successfully"
    }, medication);
});

// حذف دواء
export const deleteMedication = catchAsync(async (req, res, next) => {
    const med = await Medication.findOneAndDelete({ _id: req.params.id, patientId: req.user.id });
    
    if (!med) {
        return next(new AppError({ ar: 'الدواء غير موجود', en: 'Medication not found' }, 404));
    }

    sendResponse(res, 200, {
        ar: 'تم حذف الدواء بنجاح',
        en: 'Medication deleted successfully'
    });
});

export const getHomeDashboard = catchAsync(async (req, res, next) => {
    // 1. جلب جميع الأدوية النشطة الخاصة بالمريض
    const medications = await Medication.find({ 
        patientId: req.user.id, 
        isActive: true 
    });

    let totalDosesToday = 0;
    let takenDosesToday = 0;
    let masterQueue = []; // السلة التي تجمع كل الجرعات الـ pending من كل الأدوية

    // 2. الحصول على الوقت الحالي (بالدقائق) للمقارنة إذا أردت تطوير المنطق لاحقاً
    // const now = new Date();
    // const currentTotalMinutes = now.getHours() * 60 + now.getMinutes();

    // 3. معالجة الأدوية باستخدام for...of لضمان استقرار الـ Async/Await
    for (const med of medications) {
        
        // التأكد من مزامنة الجرعات لليوم الحالي (تصفير يومي) وحفظها
        await syncDailyTracker(med); 
        
        med.dailyTracker.forEach(dose => {
            // حساب إجمالي الجرعات المخطط لها اليوم
            totalDosesToday++;
            
            if (dose.status !== 'pending') {
                // إذا كانت الحالة Taken أو Skipped تزيد العداد المنفذ
                takenDosesToday++; 
            } else {
                // إذا كانت pending، تضاف للطابور ليتم اختيار "الأقرب" منها
                const timeInfo = parseTime(dose.time);
                masterQueue.push({
                    medId: med._id, 
                    name: med.medicineName,
                    time: dose.time,
                    // تحويل الوقت لدقائق (مثلاً 2:00 AM = 120 دقيقة) للترتيب
                    totalMinutes: timeInfo.hours * 60 + timeInfo.minutes
                });
            }
        });
    }

    // 4. ترتيب الطابور زمنياً (من الصبح لليل)
    // هذا السطر يضمن أن الجرعة التي تظهر هي الأقرب زمنياً
    // masterQueue.sort((a, b) => a.totalMinutes - b.totalMinutes);


    masterQueue.sort((a, b) => {
    if (a.totalMinutes !== b.totalMinutes) {
        return a.totalMinutes - b.totalMinutes;
    }
    // لو الوقت متساوي، رتب بالاسم عشان يظهروا بترتيب أبجدي مستقر
    return a.name.localeCompare(b.name);
});



    // 5. الجرعة الحالية هي أول عنصر في الطابور المترتب
    const currentDose = masterQueue.length > 0 ? masterQueue[0] : null;

    // 6. إرسال الاستجابة بصيغة واضحة للموبايل (Flutter/React Native)
    sendResponse(res, 200, {
        ar: "تم جلب بيانات لوحة التحكم بنجاح",
        en: "Dashboard data fetched successfully"
    }, {
        counter: {
            taken: takenDosesToday,
            total: totalDosesToday,
            remaining: totalDosesToday - takenDosesToday,
            text: `${takenDosesToday} / ${totalDosesToday}`
        },
        currentDose: currentDose ? {
            medId: currentDose.medId,
            name: currentDose.name,
            time: currentDose.time
        } : null // يرجع null إذا انتهت جميع جرعات اليوم
    });
});
