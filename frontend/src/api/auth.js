import api from './axios';

export const authApi = {
  register: (data) => api.post('/auth/register', data),

  login: (data) => api.post('/auth/login', data),

  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),

  resetPassword: (data) => api.post('/auth/reset-password', data),

  getProfile: () => api.get('/auth/me'),

  updateProfile: (data) => api.put('/auth/update-profile', data),

  updatePassword: (data) => api.put('/auth/update-password', data),
};
