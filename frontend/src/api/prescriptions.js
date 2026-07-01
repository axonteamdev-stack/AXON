import client from './client';

export const prescribeFromAppointment = (appointmentId, data) =>
  client.post(`/prescriptions/appointment/${appointmentId}`, data).then((r) => r.data);

export const prescribeFromQR = (data) =>
  client.post('/prescriptions/qr', data).then((r) => r.data);
