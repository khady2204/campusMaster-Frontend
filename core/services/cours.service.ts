// Service de gestion des cours

import { createCoursApi, deleteCoursApi, getCoursApi, getCoursByIdApi, getCoursByModuleApi, updateCoursApi } from "../api/cours.api";
import { Cours } from "../model/cours/cours";


class CoursService {

    // Récupérer les cours par module 
    async getCoursByModule(moduleId: string): Promise<Cours[]> {
        try {
        return await getCoursByModuleApi(moduleId);
        } catch (error) {
        throw error;
        }
    }

    // recuperer la liste des cours
    async getAllCours(): Promise<Cours[]> {
        try {
            const response = await getCoursApi();
            return response;
        } catch (error) {
            throw error;
        }
    }

    // Récupérer un cours par son ID
    async getCoursById(id: string): Promise<Cours> {
        try {
            const response = await getCoursByIdApi(id);
            return response;
        } catch (error) {
            throw error;
        }
    }

    // Créer un nouveau cours
    async createCours(data: Cours): Promise<Cours> {
        try {
            const response = await createCoursApi(data);
            return response;
        } catch (error) {
            throw error;
        }
    }

    // Mettre à jour un cours existant
    async updateCours(id: string, data: Cours): Promise<Cours> {
        try {
            const response = await updateCoursApi(id, data);
            return response;
        } catch (error) {
            throw error;
        }
    }

    // Supprimer un cours
    async deleteCours(id: string): Promise<void> {
        try {
            await deleteCoursApi(id);
        } catch (error) {
            throw error;
        }
    }
}

export const coursService = new CoursService();