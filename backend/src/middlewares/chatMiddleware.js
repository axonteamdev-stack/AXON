import Appointment from "../Models/appointmentModel.js";
import AppError, { catchAsync } from "../Errors/appError.js";
import { HTTP_STATUS } from "../Constants/index.js";
import { msg } from "../I18n/index.js";

export const restrictChat = catchAsync(async (req, res, next) => {
  const { appointmentId } = req.params;
  const appointment = await Appointment.findById(appointmentId);

  if (!appointment) {
    return next(
      new AppError(
        msg("الحجز غير موجود", "Appointment not found"),
        HTTP_STATUS.NOT_FOUND,
      ),
    );
  }

  if (appointment.status !== "accepted") {
    return next(
      new AppError(
        msg(
          "لا يمكنك الشات إلا بعد قبول الدكتور للطلب",
          "Chat allowed only after doctor acceptance",
        ),
        HTTP_STATUS.FORBIDDEN,
      ),
    );
  }

  const isParticipant =
    appointment.patient.toString() === req.user.id ||
    appointment.doctor.toString() === req.user.id;

  if (!isParticipant) {
    return next(
      new AppError(
        msg("غير مسموح لك بالدخول", "Unauthorized access"),
        HTTP_STATUS.FORBIDDEN,
      ),
    );
  }

  next();
});
