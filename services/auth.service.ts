/* eslint-disable @typescript-eslint/no-unused-vars */
// services/auth.service.ts
import { apiClient } from "@/lib/api-client";
import { AuthResponse, LoginCredentials, User } from "@/types/auth";

export class AuthService {
  // Connexion utilisateur
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try { 
      // Le backend attend "identifier" et "password"
      const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
      
      // Stocker le token d'accès
      apiClient.setToken(response.accessToken);
      
      // Stocker le token dans un cookie pour le Middleware Next.js (si utilisé)
      if (typeof document !== 'undefined') {
        document.cookie = `auth_token=${response.accessToken}; path=/; max-age=86400; SameSite=Lax`;
      }
      
      // Stocker les infos utilisateur
      if (typeof window !== 'undefined') {
        // On ne stocke le refreshToken que s'il est présent dans la réponse
        if (response.refreshToken) {
          localStorage.setItem('refreshToken', response.refreshToken);
        }
        
        if (response.user) {
          localStorage.setItem('user', JSON.stringify(response.user));
        }
      }
      
      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  // Déconnexion
  logout(): void {
    apiClient.removeToken();
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
      localStorage.removeItem('refreshToken');
      document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
    }
  }

  // Récupérer l'utilisateur courant
  getCurrentUser(): User | null {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user');
      if (userStr && userStr !== 'undefined') {
        try {
          return JSON.parse(userStr) as User;
        } catch {
          return null;
        }
      }
    }
    return null;
  }

  // Vérifie si un token est présent
  isAuthenticated(): boolean {
    return !!apiClient.getToken();
  }

  // Rafraîchir le token si nécessaire
  async refreshToken(): Promise<string | null> {
    try {
      // On suppose que l'endpoint attend un POST vide ou avec l'ancien token
      // Ajuste selon ton API Spring Boot. Ici, on simule un refresh en utilisant le login avec les mêmes creds
      // ou un endpoint spécifique si disponible. Pour l'instant, on ne fait rien de réel.
      
      // TODO: Implémenter un vrai endpoint de rafraîchissement de token si l'API le supporte.
      // Pour l'instant, on retourne le token actuel si valide, sinon on déconnecte.
      const currentToken = apiClient.getToken();
      if (currentToken) {
        // Ici, on pourrait appeler un endpoint /auth/refresh qui renvoie un nouveau token
        // const response = await apiGateway.request<{ token: string }>('/auth/refresh', { method: 'POST' });
        // apiGateway.setToken(response.token);
        // return response.token;
        return currentToken; // Retourne le token actuel si pas de refresh implémenté
      }
      return null;
    } catch (error) {
      this.logout();
      return null;
    }
  }
}

export const authService = new AuthService();