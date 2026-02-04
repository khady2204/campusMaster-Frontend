import { apiClient } from '@/lib/api-client/api-client';
import { Cours } from '../model/cours/cours';

const Cours_ENDPOINT = '/cours-service/api/cours';

// GET - /cours
export const getCoursApi = async (): Promise<Cours[]> => {
  return apiClient.get<Cours[]>(Cours_ENDPOINT)
}

// GET - /cours/:id
export const getCoursByIdApi = async (id: string): Promise<Cours> => {
  return apiClient.get<Cours>(`${Cours_ENDPOINT}/${id}`)
}

// GET - /cours/etudiant/:id
export const getAllCoursByEtudiantApi = async (id: string): Promise<Cours[]> => {
  return apiClient.get<Cours[]>(`${Cours_ENDPOINT}/etudiant/${id}`)
}

// GET - /cours/module/:id
export const getAllCoursByModuleApi = async (id: string): Promise<Cours[]> => {
  return apiClient.get<Cours[]>(`${Cours_ENDPOINT}/module/${id}`)
}

// GET - /cours/enseignant/:id
export const getAllCoursByEnseignantApi = async (id: string): Promise<Cours[]> => {
  return apiClient.get<Cours[]>(`${Cours_ENDPOINT}/enseignant/${id}`)
}

// POST - /cours
export const createCoursApi = async (data: Cours): Promise<Cours> => {
  return apiClient.post<Cours>(Cours_ENDPOINT, data)
}

// PUT - /cours/:id
export const updateCoursApi = async (id: string, data: Cours): Promise<Cours> => {
  return apiClient.put<Cours>(`${Cours_ENDPOINT}/${id}`, data)
}

// DELETE - /cours/:id
export const deleteCoursApi = async (id: string): Promise<void> => {
  await apiClient.delete<void>(`${Cours_ENDPOINT}/${id}`)
}