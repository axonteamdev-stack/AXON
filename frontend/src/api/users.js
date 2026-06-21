import client from './client';

export const getAllDoctors = (page = 1, limit = 10) =>
  client.get('/users/doctors', { params: { page, limit } }).then((r) => r.data);

export const getDoctorDetails = (doctorId) =>
  client.get(`/users/doctors/${doctorId}`).then((r) => r.data);

export const searchDoctors = (params) =>
  client.get('/users/doctors/search', { params }).then((r) => r.data);

export const getMyProfile = () =>
  client.get('/users/me').then((r) => r.data);

export const updateProfile = (formData) =>
  client
    .patch('/users/me', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    .then((r) => r.data);
