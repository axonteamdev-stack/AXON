import { catchAsync } from "../utils/catchAsync.js";
import { sendResponse } from "../utils/response.js";
import { msg } from "../utils/i18n.js";
import * as AppointmentService from "../services/appointmentService.js";

export const create = catchAsync(async (req, res) => {
    const appointment = await AppointmentService.create(req.user.id, req.body);
    sendResponse(res, 201, msg("تم حجز الموعد بنجاح", "Appointment booked"), {
        appointment,
    });
});

export const getMyAppointments = catchAsync(async (req, res) => {
    const appointments = await AppointmentService.getForPatient(req.user.id);
    sendResponse(res, 200, msg("تم جلب المواعيد", "Appointments fetched"), {
        appointments,
    });
});

export const getPendingRequests = catchAsync(async (req, res) => {
    const appointments = await AppointmentService.getPendingForDoctor(
        req.user.id,
    );
    sendResponse(
        res,
        200,
        msg("تم جلب الطلبات المعلقة", "Pending requests fetched"),
        { appointments },
    );
});

export const getDoctorHistory = catchAsync(async (req, res) => {
    const appointments = await AppointmentService.getHistoryForDoctor(
        req.user.id,
    );
    sendResponse(res, 200, msg("تم جلب السجل", "History fetched"), {
        appointments,
    });
});

export const updateStatus = catchAsync(async (req, res) => {
    const { status } = req.body;
    const appointment = await AppointmentService.updateStatus(
        req.params.id,
        req.user.id,
        status,
    );
    sendResponse(res, 200, msg("تم تحديث الحالة", "Status updated"), {
        appointment,
    });
});

export const cancel = catchAsync(async (req, res) => {
    const appointment = await AppointmentService.cancel(
        req.params.id,
        req.user.id,
    );
    sendResponse(res, 200, msg("تم إلغاء الموعد", "Appointment cancelled"), {
        appointment,
    });
});
