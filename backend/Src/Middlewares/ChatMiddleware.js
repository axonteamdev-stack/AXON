import Appointment from "../Models/AppointmentModel.js";
import AppError, { catchAsync } from "../Utils/AppError.js";

export const restrictChat = catchAsync(async (req, res, next) => {
    const { appointmentId } = req.params;
    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
        return next(new AppError({ ar: "المحادثة غير موجودة", en: "Chat not found" }, 404));
    }

    // شرط الوسيط الصارم
    if (appointment.status !== 'accepted') {
        return next(new AppError({ 
            ar: "لا يمكنك الشات إلا بعد قبول الدكتور للطلب", 
            en: "Chat allowed only after doctor acceptance" 
        }, 403));
    }

    // التأكد أن المستخدم جزء من الشات
    const isParticipant = 
        appointment.patient.toString() === req.user.id || 
        appointment.doctor.toString() === req.user.id;

    if (!isParticipant) {
        return next(new AppError({ ar: "غير مسموح لك بالدخول", en: "Unauthorized access" }, 403));
    }

    next();
});
