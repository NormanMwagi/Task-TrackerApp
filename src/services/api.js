import axios from 'axios';

// Use environment variable for API base URL (set VITE_API_BASE_URL in host) and default to local auth server port
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add Authorization header when token is present in localStorage
api.interceptors.request.use((config) => {
  try {
    const saved = localStorage.getItem('user');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${parsed.token}`;
      }
    }
  } catch {
    // ignore
  }
  return config;
});

// Auth API
export const authAPI = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data; // expected { token, user }
  },

  login: async (email, password) => {
    // Preferred: server implements POST /auth/login which returns { token, user }
    try {
      const response = await api.post('/auth/login', { email, password });
      return response.data; // expected shape: { token, user }
    } catch {
      // Fallback for simple/dev setups: fetch user by email only (do NOT send password in URL)
      // NOTE: This fallback is insecure and intended only for local/dev demos. Implement proper auth for production.
      const res = await api.get(`/users?email=${encodeURIComponent(email)}`);
      const user = res.data && res.data[0];
      return user || null;
    }
  },
};

// Tasks API
export const tasksAPI = {
  getTasks: async (userId) => {
    const response = await api.get(`/tasks?userId=${userId}`);
    return response.data;
  },

  createTask: async (taskData) => {
    const response = await api.post('/tasks', {
      ...taskData,
      createdAt: new Date().toISOString(),
    });
    return response.data;
  },

  updateTask: async (taskId, taskData) => {
    const response = await api.put(`/tasks/${taskId}`, taskData);
    return response.data;
  },

  deleteTask: async (taskId) => {
    await api.delete(`/tasks/${taskId}`);
  },

  toggleTask: async (taskId, completed) => {
    const response = await api.patch(`/tasks/${taskId}`, { completed });
    return response.data;
  },
};