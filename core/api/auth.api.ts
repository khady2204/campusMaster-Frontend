import { apiClient } from '@/lib/api-client/api-client';
import { Login, loginResponse, Register, registerResponse } from '../model/auth.model';
import { User } from '../model/user.model';

// Post - /auth/login
export const loginApi = async (data: Login): Promise<loginResponse> => {
  return apiClient.post<loginResponse>('/auth/login', data)
}

// POST /auth/register
export const registerApi = async (data: Register): Promise<registerResponse> => {
  return apiClient.post<registerResponse>('/auth/register', data)
}

// POST /auth/logout
export const logoutApi = async (): Promise<void> => {
  await apiClient.post<void>('/auth/logout', {})
}

// POST /auth/me
export const meApi = async (): Promise<User> => {
  return apiClient.get<User>('/auth/me')
}
