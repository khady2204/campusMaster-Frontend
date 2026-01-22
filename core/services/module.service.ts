// Service de gestion des modules

import { createModuleApi, deleteModuleApi, getModuleByIdApi, getModulesApi, updateModuleApi } from "../api/module.api";
import { Module } from "../model/cours/module";


class ModuleService {

    // recuperer la liste des modules
    async getAllModules(): Promise<Module[]> {
        try {
            const response = await getModulesApi();
            return response;
        } catch (error) {
            throw error;
        }
    }

    // Récupérer un module par son ID
    async getModuleById(id: string): Promise<Module> {
        try {
            const response = await getModuleByIdApi(id);
            return response;
        } catch (error) {
            throw error;
        }
    }

    // Créer un nouveau module
    async createModule(data: Module): Promise<Module> {
        try {
            const response = await createModuleApi(data);
            return response;
        } catch (error) {
            throw error;
        }
    }

    // Mettre à jour un module existant
    async updateModule(id: string, data: Module): Promise<Module> {
        try {
            const response = await updateModuleApi(id, data);
            return response;
        } catch (error) {
            throw error;
        }
    }

    // Supprimer un module
    async deleteModule(id: string): Promise<void> {
        try {
            await deleteModuleApi(id);
        } catch (error) {
            throw error;
        }
    }
}

export const moduleService = new ModuleService();