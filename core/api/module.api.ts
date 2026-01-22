import { apiClient } from '@/lib/api-client/api-client';
import { Module } from '../model/cours/module';

const Modules_ENDPOINT = '/cours-service/api/modules';

// GET - /modules
export const getModulesApi = async (): Promise<Module[]> => {
  return apiClient.get<Module[]>(Modules_ENDPOINT)
}

// GET - /modules/:id
export const getModuleByIdApi = async (id: string): Promise<Module> => {
  return apiClient.get<Module>(`${Modules_ENDPOINT}/${id}`)
}

// POST - /modules
export const createModuleApi = async (data: Module): Promise<Module> => {
  return apiClient.post<Module>(Modules_ENDPOINT, data)
}

// PUT - /modules/:id
export const updateModuleApi = async (id: string, data: Module): Promise<Module> => {
  return apiClient.put<Module>(`${Modules_ENDPOINT}/${id}`, data)
}

// DELETE - /modules/:id
export const deleteModuleApi = async (id: string): Promise<void> => {
  await apiClient.delete<void>(`${Modules_ENDPOINT}/${id}`)
}