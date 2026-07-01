import client from './client';

export const createSetupIntent = (appointmentId) =>
  client.post('/payment/setup-intent', { appointmentId }).then((r) => r.data);

export const attachPaymentMethod = (appointmentId, setupIntentId) =>
  client.post('/payment/attach', { appointmentId, setupIntentId }).then((r) => r.data);

export const getPayment = (appointmentId) =>
  client.get(`/payment/${appointmentId}`).then((r) => r.data);
