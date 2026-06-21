import client from './client';

export const checkInteractions = (newMedicationName) =>
  client.post('/ddi/check', { newMedicationName }).then((r) => r.data);

export const checkContraindications = (medicineName) =>
  client.post('/ddi/contraindications', { medicineName }).then((r) => r.data);
