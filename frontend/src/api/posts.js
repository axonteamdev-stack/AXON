import client from './client';

export const getAllPosts = (page = 1, limit = 10) =>
  client.get('/posts', { params: { page, limit } }).then((r) => r.data);

export const getPostById = (postId) =>
  client.get(`/posts/${postId}`).then((r) => r.data);

export const getDoctorPosts = (doctorId, page = 1, limit = 10) =>
  client.get(`/posts/doctor/${doctorId}`, { params: { page, limit } }).then((r) => r.data);

export const createArticle = (formData) =>
  client
    .post('/posts/articles', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    .then((r) => r.data);

export const createCommunityPost = (formData) =>
  client
    .post('/posts/community', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    .then((r) => r.data);

export const updatePost = (postId, data) =>
  client.patch(`/posts/${postId}`, data).then((r) => r.data);

export const deletePost = (postId) =>
  client.delete(`/posts/${postId}`).then((r) => r.data);

export const toggleLike = (postId) =>
  client.post(`/posts/${postId}/like`).then((r) => r.data);

export const addComment = (postId, content) =>
  client.post(`/posts/${postId}/comments`, { content }).then((r) => r.data);

export const getComments = (postId, page = 1, limit = 10) =>
  client.get(`/posts/${postId}/comments`, { params: { page, limit } }).then((r) => r.data);
