import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Replace with your backend API URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Example API call to login
export const login = async (credentials) => {
  const response = await api.post('/login', credentials);
  return response.data;
};

// Example API call to register
export const register = async (userData) => {
  const response = await api.post('/register', userData);
  return response.data;
};

// Example API call to fetch user profile
export const fetchProfile = async (userId) => {
  const response = await api.get(`/profile/${userId}`);
  return response.data;
};

// Example API call to fetch admin dashboard data
export const fetchAdminDashboard = async () => {
  const response = await api.get('/admin/dashboard');
  return response.data;
};

// Example API call to fetch user dashboard data
export const fetchUserDashboard = async () => {
  const response = await api.get('/dashboard');
  return response.data;
};

export default api;