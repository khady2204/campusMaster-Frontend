// src/core/api/support.api.ts
import { apiClient } from '@/lib/api-client/api-client';
import { Support } from '../model/cours/support';
import { headers } from 'next/headers';

const SUPPORT_ENDPOINT = '/cours-service/api/supports';

// GET - /supports (tous les supports)
export const getSupportsApi = async (): Promise<Support[]> => {
  return apiClient.get<Support[]>(SUPPORT_ENDPOINT);
};

// GET - /supports/cours/{coursId} (supports par cours)
export const getSupportsByCoursIdApi = async (coursId: string): Promise<Support[]> => {
  return apiClient.get<Support[]>(`${SUPPORT_ENDPOINT}/cours/${coursId}`);
};

// GET - /supports/{id}
export const getSupportByIdApi = async (id: string): Promise<Support> => {
  return apiClient.get<Support>(`${SUPPORT_ENDPOINT}/${id}`);
};

// POST - /supports
export const createSupportApi = async (data: any): Promise<Support> => {
  return apiClient.post<Support>(SUPPORT_ENDPOINT, data);
};

// PUT - /supports/{id}
export const updateSupportApi = async (id: string, data: Partial<Support>): Promise<Support> => {
  return apiClient.put<Support>(`${SUPPORT_ENDPOINT}/${id}`, data);
};

// DELETE - /supports/{id}
export const deleteSupportApi = async (id: string): Promise<void> => {
  await apiClient.delete<void>(`${SUPPORT_ENDPOINT}/${id}`);
};



