import client from './client';

export const login = (email, password) =>
  client.post('/auth/login', { email, password }).then((r) => r.data);

export const signupPatient = (data) =>
  client.post('/auth/signup/patient', data).then((r) => r.data);

export const signupDoctor = (formData) =>
  client
    .post('/auth/signup/doctor', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    .then((r) => r.data);

export const logout = () =>
  client.post('/auth/logout').then((r) => r.data);

export const forgotPassword = (email) =>
  client.post('/auth/forgot-password', { email }).then((r) => r.data);

export const resetPassword = (token, password) =>
  client.post('/auth/reset-password', { token, password }).then((r) => r.data);
