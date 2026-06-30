import client from './client';

export const getMyRecord = () =>
  client.get('/records/me').then((r) => r.data);

export const updateRecord = (data) =>
  client.patch('/records/me', data).then((r) => r.data);

export const addRadiologyTest = (formData) =>
  client
    .post('/records/tests/radiology', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    .then((r) => r.data);

export const addLabTest = (formData) =>
  client
    .post('/records/tests/lab', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    .then((r) => r.data);

export const generateQRCode = () =>
  client.post('/records/qr').then((r) => r.data);

export const accessRecordByQR = (patientId) =>
  client.get(`/records/qr/access/${patientId}`).then((r) => r.data);

export const getEmergencyData = (qrToken) =>
  client.get(`/records/emergency-data/${qrToken}`).then((r) => r.data);
