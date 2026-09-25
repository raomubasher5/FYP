import { apiClient } from './client';

export const postApi = {
  getAll: (status) => apiClient.get(status ? `/posts?status=${status}` : '/posts'),
  getById: (id) => apiClient.get(`/posts/${id}`),
  create: (data) => apiClient.post('/posts', data),
  update: (id, data) => apiClient.put(`/posts/${id}`, data),
  delete: (id) => apiClient.delete(`/posts/${id}`),
  approve: (id) => apiClient.post(`/posts/${id}/approve`, {}),
  publishNow: (id) => apiClient.post(`/posts/${id}/publish-now`, {}),
  generateAI: (payload) => apiClient.post('/posts/generate', payload),
};

export const accountApi = {
  getAll: () => apiClient.get('/accounts'),
  toggle: (id) => apiClient.post(`/accounts/${id}/toggle`, {}),
  setMode: (id, mode) => apiClient.post(`/accounts/${id}/mode`, { mode }),
};

export const profileApi = {
  get: () => apiClient.get('/profile'),
  update: (data) => apiClient.put('/profile', data),
  updateAIConfig: (data) => apiClient.post('/profile/ai-config', data),
};

export const analyticsApi = {
  getOverview: () => apiClient.get('/analytics'),
  getLogs: () => apiClient.get('/logs'),
  resetDemo: () => apiClient.post('/system/reset', {}),
};
