import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor – attach Bearer token and language
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('medai-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    const lang = localStorage.getItem('medai-language') || 'en';
    config.headers['Accept-Language'] = lang;
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor – handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('medai-token');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// ── Auth API ──
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (name, email, password) => api.post('/auth/register', { name, email, password }),
  getMe: () => api.get('/auth/me'),
};

// ── Chat / Symptom API ──
export const chatAPI = {
  sendSymptoms: (symptoms, config = {}) =>
    api.post('/chat/symptom', { symptoms }, config),
  getHistory: () => api.get('/chat/history'),
  getChat: (id) => api.get(`/chat/${id}`),
  deleteChat: (id) => api.delete(`/chat/${id}`),
};

// ── Report API ──
export const reportAPI = {
  analyzeReport: (formData, config = {}) =>
    api.post('/report/analyze', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      ...config
    }),
  getHistory: () => api.get('/report/history'),
};

// ── Image API ──
export const imageAPI = {
  analyzeImage: (formData, config = {}) =>
    api.post('/image/analyze', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      ...config
    }),
  getHistory: () => api.get('/image/history'),
};

// ── User API ──
export const userAPI = {
  updateProfile: (data) => api.put('/user/profile', data),
  updateSettings: (data) => api.put('/user/settings', data),
  clearHistory: () => api.delete('/user/history'),
};

export default api;
