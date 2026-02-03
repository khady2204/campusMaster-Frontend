import { apiClient } from '@/lib/api-client/api-client';
import { Enrollement } from '../model/cours/enrollement';

const ENROLLEMENT_ENDPOINT = '/cours-service/api/enrollements';

// GET - /enrollements
export const getenrollementsApi = async (): Promise<Enrollement[]> => {
  return apiClient.get<Enrollement[]>(ENROLLEMENT_ENDPOINT)
}

// GET - /enrollements/:id
export const getEnrollementByIdApi = async (id: string): Promise<Enrollement> => {
  return apiClient.get<Enrollement>(`${ENROLLEMENT_ENDPOINT}/${id}`)
}

// POST - /enrollements
export const createEnrollementApi = async (data: Enrollement): Promise<Enrollement> => {
  return apiClient.post<Enrollement>(ENROLLEMENT_ENDPOINT, data)
}

// PUT - /enrollements/:id
export const updateEnrollementApi = async (id: string, data: Enrollement): Promise<Enrollement> => {
  return apiClient.put<Enrollement>(`${ENROLLEMENT_ENDPOINT}/${id}`, data)
}

// DELETE - /enrollements/:id
export const deleteEnrollementApi = async (id: string): Promise<void> => {
  await apiClient.delete<void>(`${ENROLLEMENT_ENDPOINT}/${id}`)
}