import { environment } from "@/environment/environment";

const BASE_URL = environment.apiUrl;
type RequestMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";


class ApiClient {

  /**
   * Méthode générique pour effectuer les requêtes
   * endpoint - le chemin de l’API après le BASE_URL (ex: "/users")
   * method - verbe HTTP : GET, POST, PUT, DELETE ou PATCH (GET par défaut)
   * body - données à envoyer (objet, transformé en JSON) 
   * @returns Promise qui résout avec les données reçues (typées via <T>)
   */
  async request<T>(endpoint: string, method: RequestMethod = "GET", body?: unknown): Promise<T> {
    
    // 1) Prépare les headers : toujours du JSON
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    // 2) Construit la configuration complète de fetch
    const config: RequestInit = {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined, // transforme l’objet en JSON
      credentials: "include", // Ajoute les cookies (dont HttpOnly) à chaque requête
    };

    try {
      // 3) Appelle l’API
      const response = await fetch(`${BASE_URL}${endpoint}`, config);

      // 4) Si le statut n’est pas 200, 201, on jette une erreur
      if (!response.ok) {
        // Lire le message d’erreur renvoyé par le serveur
        const errorBody = await response.json().catch(() => ({}));
        throw new Error(errorBody.message || `Erreur HTTP ${response.status}`);
      }

      // 5) Pas de corps à retourner (204 No Content) → objet vide typé
      if (response.status === 204) return {} as T;

      // 6) Sinon, renvoie les données JSON parsées
      // On lit d'abord en texte pour gérer le cas où le backend renvoie 200 avec un body vide
      const text = await response.text();
      return text ? JSON.parse(text) : {} as T;
      
    } catch (error) {
      // 7) Log et propage l’erreur pour que l’appelant puisse la gérer
      console.error(`API Error (${method} ${endpoint}):`, error);
      throw error;
    }
  }

  get<T>(endpoint: string) { return this.request<T>(endpoint, "GET"); }
  post<T>(endpoint: string, body: unknown) { return this.request<T>(endpoint, "POST", body); }
  put<T>(endpoint: string, body: unknown) { return this.request<T>(endpoint, "PUT", body); }
  delete<T>(endpoint: string) { return this.request<T>(endpoint, "DELETE"); }
}

export const apiClient = new ApiClient();