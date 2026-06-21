import client from './client';

export const createAppointment = (data) =>
  client.post('/appointments', data).then((r) => r.data);

export const getMyAppointments = () =>
  client.get('/appointments/my').then((r) => r.data);

export const getPendingRequests = () =>
  client.get('/appointments/pending').then((r) => r.data);

export const getDoctorHistory = () =>
  client.get('/appointments/history').then((r) => r.data);

export const updateAppointmentStatus = (appointmentId, status) =>
  client.patch(`/appointments/${appointmentId}/status`, { status }).then((r) => r.data);

export const cancelAppointment = (appointmentId) =>
  client.patch(`/appointments/${appointmentId}/cancel`).then((r) => r.data);
