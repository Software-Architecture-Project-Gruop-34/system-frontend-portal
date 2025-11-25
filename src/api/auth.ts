import apiClient from './apiClient';
import type { LoginCredentials, LoginResponse, RegistrationData, RegistrationResponse, User } from '../types';

export const login = (credentials: LoginCredentials): Promise<LoginResponse> => {
  return apiClient.post('/users/login', credentials);
};

export const register = (data: RegistrationData): Promise<RegistrationResponse> => {
  return apiClient.post('/users/register', data);
};

export interface UserProfileResponse {
  success: boolean;
  message: string;
  data: User;
}

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
