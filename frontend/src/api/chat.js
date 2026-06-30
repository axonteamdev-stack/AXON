import client from './client';

export const getMyConversations = () =>
  client.get('/chat/conversations').then((r) => r.data);

export const startConversation = (appointmentId) =>
  client.post(`/chat/start/${appointmentId}`).then((r) => r.data);

export const getMessages = (conversationId) =>
  client.get(`/chat/${conversationId}/messages`).then((r) => r.data);

export const sendMessage = (conversationId, text) =>
  client.post(`/chat/${conversationId}/messages`, { text }).then((r) => r.data);
