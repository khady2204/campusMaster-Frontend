// Service de gestion des semestres

import { createSemestreApi, deleteSemestreApi, getSemestreByIdApi, getSemestresApi, updateSemestreApi } from "../api/semestre.api";
import { Semestre } from "../model/cours/semestre";


class SemestreService {

    // recuperer la liste des semestres
    async getSemestres(): Promise<Semestre[]> {
        try {
            const response = await getSemestresApi();
            return response;
        } catch (error) {
            throw error;
        }
    }

    // Récupérer un semestre par son ID
    async getSemestreById(id: string): Promise<Semestre> {
        try {
            const response = await getSemestreByIdApi(id);
            return response;
        } catch (error) {
            throw error;
        }
    }

    // Créer un nouveau semestre
    async createSemestre(data: Semestre): Promise<Semestre> {
        try {
            const response = await createSemestreApi(data);
            return response;
        } catch (error) {
            throw error;
        }
    }

    // Mettre à jour un semestre existant
    async updateSemestre(id: string, data: Semestre): Promise<Semestre> {
        try {
            const response = await updateSemestreApi(id, data);
            return response;
        } catch (error) {
            throw error;
        }
    }

    // Supprimer un semestre
    async deleteSemestre(id: string): Promise<void> {
        try {
            await deleteSemestreApi(id);
        } catch (error) {
            throw error;
        }
    }
}

export const semestreService = new SemestreService();