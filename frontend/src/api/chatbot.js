import client from './client';

export const askQuestion = (message, conversationId) =>
  client
    .post('/chatbot/ask', { message, conversationId })
    .then((r) => r.data);

export const getConversations = () =>
  client.get('/chatbot/conversations').then((r) => r.data);

export const getMessages = (conversationId) =>
  client.get(`/chatbot/${conversationId}/messages`).then((r) => r.data);
