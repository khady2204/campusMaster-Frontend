// Service de gestion de l'authentification

import { loginApi, logoutApi, registerApi, meApi } from "../api/auth.api";
import { Login, loginResponse, Register, registerResponse } from "../model/auth.model";
import { User } from "../model/user.model";

class AuthService {
    
    // Connexion utilisateur
    async login(data: Login): Promise<loginResponse> {
        try {
            // Le backend place le cookie HttpOnly automatiquement
            const response = await loginApi(data);
            return response;
        } catch (error) {
            throw error;
        }
    }

    // Deconnexion
    async logout(): Promise<void> {
        try {
            await logoutApi();
        } catch (error) {
            console.error("Erreur lors de la déconnexion API", error);
        }
    }

    // Inscription d'un nouvel utilisateur
    async register(data: Register): Promise<registerResponse> {
        try {
            const response = await registerApi(data);
            return response;
        } catch (error) {
            throw error;
        }
    }

    // Récupérer l'utilisateur connecté
    async me(): Promise<User> {
        try {
            return await meApi();
        } catch (error) {
            throw error;
        }
    }

    // Suppression de getToken : inutile avec cookie HttpOnly
}

export const authService = new AuthService();
