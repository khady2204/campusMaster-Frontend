import { apiClient } from "@/lib/api-client/api-client";
import { User } from "../model/user/user.model";

const USERS_ENDPOINT = '/api/users';

// GET - /users
export const getusersApi = async (): Promise<User[]> => {
  return apiClient.get<User[]>(USERS_ENDPOINT)
}

// GET - /users/:id
export const getUserByIdApi = async (id: string): Promise<User> => {
  return apiClient.get<User>(`${USERS_ENDPOINT}/${id}`)
}

// POST - /users
export const createUserApi = async (data: User): Promise<User> => {
  return apiClient.post<User>(USERS_ENDPOINT, data)
}

// PUT - /users/:id
export const updateUserApi = async (id: string, data: User): Promise<User> => {
  return apiClient.put<User>(`${USERS_ENDPOINT}/${id}`, data)
}

// DELETE - /users/:id
export const deleteUserApi = async (id: string): Promise<void> => {
  await apiClient.delete<void>(`${USERS_ENDPOINT}/${id}`)
}