import { apiClient } from '@/lib/api-client/api-client';
import { Login, loginResponse, Register, registerResponse } from '../../core/model/auth/auth.model';
import { User } from '../model/user/user.model';

// Post - /auth/login
export const loginApi = async (data: Login): Promise<loginResponse> => {
  return apiClient.post<loginResponse>('/api/auth/login', data)
}

// POST /auth/register
export const registerApi = async (data: Register): Promise<registerResponse> => {
  return apiClient.post<registerResponse>('/api/auth/register', data)
}

// POST /auth/logout
export const logoutApi = async (): Promise<void> => {
  await apiClient.post<void>('/api/auth/logout', {})
}

// POST /auth/me
export const meApi = async (): Promise<User> => {
  return apiClient.get<User>('/api/auth/me')
}
