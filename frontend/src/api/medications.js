import client from './client';

export const createMedication = (data) =>
  client.post('/medications', data).then((r) => r.data);

export const getMyMedications = () =>
  client.get('/medications').then((r) => r.data);

export const getMedicationById = (medicationId) =>
  client.get(`/medications/${medicationId}`).then((r) => r.data);

export const updateMedication = (medicationId, data) =>
  client.patch(`/medications/${medicationId}`, data).then((r) => r.data);

export const deleteMedication = (medicationId) =>
  client.delete(`/medications/${medicationId}`).then((r) => r.data);

export const markDose = (medicationId, time, status) =>
  client.post(`/medications/${medicationId}/doses`, { time, status }).then((r) => r.data);

export const getPendingDoses = () =>
  client.get('/medications/pending-doses').then((r) => r.data);
