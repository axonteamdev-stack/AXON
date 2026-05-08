import { catchAsync } from "../utils/catchAsync.js";
import { sendResponse } from "../utils/response.js";
import { msg } from "../utils/i18n.js";
import * as AppointmentService from "../services/appointmentService.js";

export const createAppointment = catchAsync(async (req, res) => {
  const appointment = await AppointmentService.create(req.user.id, req.body);
  sendResponse(res, 201, msg("تم إرسال طلب الحجز", "Appointment request sent"), appointment);
});

export const getDoctorAppointments = catchAsync(async (req, res) => {
  const appointments = await AppointmentService.getPendingForDoctor(req.user.id);
  sendResponse(res, 200, msg("تم جلب طلبات الحجز", "Appointments retrieved"), {
    results: appointments.length,
    appointments,
  });
});

export const getDoctorHistory = catchAsync(async (req, res) => {
  const appointments = await AppointmentService.getHistoryForDoctor(req.user.id);
  sendResponse(res, 200, msg("تم جلب تاريخ الحجوزات", "History retrieved"), appointments);
});

export const getPatientAppointments = catchAsync(async (req, res) => {
  const appointments = await AppointmentService.getForPatient(req.user.id);
  sendResponse(res, 200, msg("تم جلب حجوزاتك", "Your appointments retrieved"), appointments);
});

export const updateAppointmentStatus = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const appointment = await AppointmentService.updateStatus(id, req.user.id, status);
  sendResponse(res, 200, msg("تم تحديث الحجز", "Appointment updated"), appointment);
});
