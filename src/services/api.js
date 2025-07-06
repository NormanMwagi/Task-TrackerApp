import axios from 'axios';


const API_BASE_URL = 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth API
export const authAPI = {
  register: async (userData) => {
    const response = await api.post('/users', userData);
    return response.data;
  },

  login: async (email, password) => {
    const response = await api.get(`/users?email=${email}&password=${password}`);
    return response.data[0]; // Return first matching user
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