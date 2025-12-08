import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getMe: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout'),
};

// Typing test endpoints
export const typingAPI = {
  getText: () => api.get('/typing/text'),
  submitResult: (resultData) => api.post('/typing/result', resultData),
  getResults: (params) => api.get('/typing/results', { params }),
  getBestResults: (limit = 10) => api.get(`/typing/best-results?limit=${limit}`),
  getStats: (days = 7) => api.get(`/typing/stats?days=${days}`),
  deleteResult: (id) => api.delete(`/typing/result/${id}`),
};

// Stats endpoints
export const statsAPI = {
  getLeaderboard: (params) => api.get('/stats/leaderboard', { params }),
  getGlobalStats: () => api.get('/stats/global'),
  getTrends: (days = 30) => api.get(`/stats/trends?days=${days}`),
};

export default api;