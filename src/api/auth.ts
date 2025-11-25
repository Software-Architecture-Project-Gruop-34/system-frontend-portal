import apiClient from './apiClient';
import type { LoginCredentials, LoginResponse, RegistrationData, RegistrationResponse, UpdateProfileData, User } from '../types';

export const login = (credentials: LoginCredentials): Promise<LoginResponse> => {
  return apiClient.post('/users/login', credentials);
};

export const register = (data: RegistrationData): Promise<RegistrationResponse> => {
  return apiClient.post('/users/register', data);
};


export const getUserProfile = async (userId: number): Promise<User> => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Authentication required. Please log in.');
  }

  const response = await apiClient.get(`/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.data;
};


export const updateUserProfile = async (data: UpdateProfileData): Promise<User> => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Authentication required. Please log in.');
  }

  const response = await apiClient.put('/users/profile', data, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  return response.data.data;
};
