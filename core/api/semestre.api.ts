import { apiClient } from '@/lib/api-client/api-client';
import { Semestre } from '../../core/model/cours/semestre';

const SEMESTRES_ENDPOINT = '/cours-service/api/semestres';

// GET - /semestres
export const getSemestresApi = async (): Promise<Semestre[]> => {
  return apiClient.get<Semestre[]>(SEMESTRES_ENDPOINT)
}

// GET - /semestres/:id
export const getSemestreByIdApi = async (id: string): Promise<Semestre> => {
  return apiClient.get<Semestre>(`semestresEndpoint/${id}`)
}

// POST - /semestres
export const createSemestreApi = async (data: Semestre): Promise<Semestre> => {
  return apiClient.post<Semestre>(SEMESTRES_ENDPOINT, data)
}

// PUT - /semestres/:id
export const updateSemestreApi = async (id: string, data: Semestre): Promise<Semestre> => {
  return apiClient.put<Semestre>(`SEMESTRES_ENDPOINT/${id}`, data)
}

// DELETE - /semestres/:id
export const deleteSemestreApi = async (id: string): Promise<void> => {
  await apiClient.delete<void>(`SEMESTRES_ENDPOINT/${id}`)
}