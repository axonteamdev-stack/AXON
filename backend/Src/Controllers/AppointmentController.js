import Appointment from "../Models/AppointmentModel.js";
import AppError, { catchAsync, sendResponse } from "../Utils/AppError.js";
import { getIO } from "../Socket/socket.js";

/**
 * 1. إنشاء حجز جديد (المريض يطلب الحجز)
 * الحالة تبدأ بـ Pending والفلوس Held عند الوسيط
 */
export const createAppointment = catchAsync(async (req, res, next) => {
    const { doctorId, amount } = req.body;

    // إنشاء الحجز في قاعدة البيانات
    const appointment = await Appointment.create({
        patient: req.user.id,
        doctor: doctorId,
        amount,
        paymentStatus: "held" // 💰 الأموال محجوزة الآن
    });

    // إرسال تنبيه لحظي للدكتور عبر الـ Socket
    const io = getIO();
    io.to(doctorId.toString()).emit("newAppointmentRequest", {
        message: "لديك طلب كشف جديد في انتظار موافقتك",
        appointmentId: appointment._id
    });

    sendResponse(res, 201, {
        ar: "تم إرسال طلب الحجز، والفلوس في عهدة الوسيط لحين موافقة الدكتور",
        en: "Appointment request sent. Funds are held until doctor approval."
    }, appointment);
});

/**
 * 2. جلب الطلبات الجديدة (خاص بالطبيب)
 * يعرض الحجوزات التي حالتها Pending فقط
 */
export const getDoctorAppointments = catchAsync(async (req, res, next) => {
    const appointments = await Appointment.find({
        doctor: req.user.id,
        status: 'pending'
    })
    .populate('patient', 'fullName personalPhoto')
    .sort('-createdAt');

    // بنبعت الرد وبنضيف حقل results عشان الفرونت إند يعرف العدد بسهولة
    sendResponse(res, 200, {
        ar: "تم جلب طلبات الحجز الجديدة بنجاح",
        en: "New appointment requests retrieved successfully"
    }, {
        results: appointments.length, // 🔥 هنا ضفنا العدد
        appointments // المصفوفة نفسها
    });
});

/**
 * 3. قبول الحجز (الطبيب يوافق)
 * تتحول الأموال للطبيب ويفتح نظام الشات
 */
export const acceptAppointment = catchAsync(async (req, res, next) => {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
        return next(new AppError({ ar: "عذراً، هذا الحجز غير موجود", en: "Appointment not found" }, 404));
    }

    // التحقق من الهوية (يجب أن يكون الطبيب هو صاحب الحجز)
    if (appointment.doctor.toString() !== req.user.id) {
        return next(new AppError({ ar: "غير مسموح لك باتخاذ هذا القرار", en: "Unauthorized" }, 403));
    }

    appointment.status = "accepted";
    appointment.paymentStatus = "paid"; // 💰 الفلوس تحولت للدكتور
    await appointment.save();

    sendResponse(res, 200, {
        ar: "تم قبول الحجز بنجاح، يمكنك الآن التواصل مع المريض عبر الشات",
        en: "Appointment accepted. You can now chat with the patient."
    });
});

/**
 * 4. رفض الحجز (الطبيب يرفض)
 * تعود الأموال للمريض ويظل الشات مغلقاً
 */
export const rejectAppointment = catchAsync(async (req, res, next) => {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
        return next(new AppError({ ar: "عذراً، هذا الحجز غير موجود", en: "Appointment not found" }, 404));
    }

    if (appointment.doctor.toString() !== req.user.id) {
        return next(new AppError({ ar: "غير مسموح لك باتخاذ هذا القرار", en: "Unauthorized" }, 403));
    }

    appointment.status = "rejected";
    appointment.paymentStatus = "refunded"; // 🔁 استرجاع المبلغ للمريض
    await appointment.save();

    sendResponse(res, 200, {
        ar: "تم رفض الحجز وإعادة المبلغ لمحفظة المريض",
        en: "Appointment rejected. Funds have been refunded to the patient."
    });
});

/**
 * 5. جلب تاريخ العمليات (History)
 * يعرض للطبيب كل الحالات السابقة (Accepted / Rejected / Cancelled)
 */
export const getDoctorHistory = catchAsync(async (req, res, next) => {
    const appointments = await Appointment.find({
        doctor: req.user.id,
        status: { $ne: 'pending' } // كل شيء ما عدا المعلق
    })
    .populate('patient', 'fullName personalPhoto')
    .sort('-updatedAt');

    sendResponse(res, 200, {
        ar: "تم جلب تاريخ الحجوزات بنجاح",
        en: "Appointment history retrieved successfully"
    }, appointments);
});

/**
 * 6. جلب حجوزات المريض (اختياري)
 * لكي يعرف المريض حالة طلبه (هل تم القبول أم الرفض)
 */
export const getPatientAppointments = catchAsync(async (req, res, next) => {
    const appointments = await Appointment.find({ patient: req.user.id })
        .populate('doctor', 'fullName personalPhoto')
        .sort('-createdAt');

    sendResponse(res, 200, {
        ar: "تم جلب حجوزاتك بنجاح",
        en: "Your appointments retrieved successfully"
    }, appointments);
});
