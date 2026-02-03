// Service de gestion des enrollements

import { createEnrollementApi, deleteEnrollementApi, getEnrollementByIdApi, getenrollementsApi, updateEnrollementApi } from "../api/enrollement.api";
import { Enrollement } from "../model/cours/enrollement";



class EnrollementService {

    // recuperer la liste des enrollements
    async getAllEnrollements(): Promise<Enrollement[]> {
        try {
            const response = await getenrollementsApi();
            return response;
        } catch (error) {
            throw error;
        }
    }

    // Récupérer un enrollement par son ID
    async getEnrollementById(id: string): Promise<Enrollement> {
        try {
            const response = await getEnrollementByIdApi(id);
            return response;
        } catch (error) {
            throw error;
        }
    }

    // Créer un nouveau enrollement
    async createEnrollement(data: Enrollement): Promise<Enrollement> {
        try {
            const response = await createEnrollementApi(data);
            return response;
        } catch (error) {
            throw error;
        }
    }

    // Mettre à jour un enrollement existant
    async updateEnrollement(id: string, data: Enrollement): Promise<Enrollement> {
        try {
            const response = await updateEnrollementApi(id, data);
            return response;
        } catch (error) {
            throw error;
        }
    }

    // Supprimer un enrollement
    async deleteEnrollement(id: string): Promise<void> {
        try {
            await deleteEnrollementApi(id);
        } catch (error) {
            throw error;
        }
    }
}

export const enrollementService = new EnrollementService();