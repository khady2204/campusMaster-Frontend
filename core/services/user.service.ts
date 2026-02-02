// Service de gestion des users

import { createUserApi, deleteUserApi, getUserByIdApi, getusersApi, getAllusersApi, updateUserApi, getUsersByRoleApi } from "../api/user.api";
import { PagedResponse } from "../model/user/pageResponse.model";
import { User } from "../model/user/user.model";


class UserService {

    // recuperer la liste des users
    async getUsers(): Promise<User[]> {
        try {
            const response = await getusersApi();
            return response.content;
        } catch (error) {
            throw error;
        }
    }

    // recuperer la liste des users
    async getAllUsers(): Promise<User[]> {
        try {
            const response = await getAllusersApi();
            return response;
        } catch (error) {
            throw error;
        }
    }

    // recuperer la liste des users par role
    async getAllUsersByRole(
        role: string,
        page: number = 0,
        size: number = 10
    ): Promise<PagedResponse<User>> {
    try {
        return await getUsersByRoleApi(role, page, size);
    } catch (error) {
        throw error;
    }
    }

    // Récupérer un user par son ID
    async getUserById(id: string): Promise<User> {
        try {
            const response = await getUserByIdApi(id);
            return response;
        } catch (error) {
            throw error;
        }
    }

    // Créer un nouveau user
    async createUser(data: User): Promise<User> {
        try {
            const response = await createUserApi(data);
            return response;
        } catch (error) {
            throw error;
        }
    }

    // Mettre à jour un user existant
    async updateUser(id: string, data: User): Promise<User> {
        try {
            const response = await updateUserApi(id, data);
            return response;
        } catch (error) {
            throw error;
        }
    }

    // Supprimer un user
    async deleteUser(id: string): Promise<void> {
        try {
            await deleteUserApi(id);
        } catch (error) {
            throw error;
        }
    }
}

export const userService = new UserService();