const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

type RequestMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

class ApiClient {
  private token: string | null = null;

  constructor() {
    // Récupération initiale du token côté client uniquement
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("token");
    }
  }

  /**
   * Définit le token pour les futures requêtes (ex: après login)
   */
  setToken(token: string) {
    this.token = token;
    if (typeof window !== "undefined") {
      localStorage.setItem("token", token);
    }
  }

  /**
   * Supprime le token (ex: logout)
   */
  removeToken() {
    this.token = null;
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
    }
  }

  getToken(): string | null {
    return this.token;
  }

  /**
   * Méthode générique pour effectuer les requêtes
   * @param endpoint - le chemin de l’API après le BASE_URL (ex: "/users")
   * @param method - verbe HTTP : GET, POST, PUT, DELETE ou PATCH (GET par défaut)
   * @param body - données à envoyer (objet JS, transformé en JSON) ; optionnel
   * @returns Promise qui résout avec les données reçues (typées via <T>)
   */
  async request<T>(endpoint: string, method: RequestMethod = "GET", body?: unknown): Promise<T> {
    // 1) Prépare les headers : toujours du JSON
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    // 2) Ajoute le token d’authentification s’il existe
    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }

    // 3) Construit la configuration complète de fetch
    const config: RequestInit = {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined, // transforme l’objet en JSON
    };

    try {
      // 4) Appelle l’API
      const response = await fetch(`${BASE_URL}${endpoint}`, config);

      // 5) Si le statut n’est pas 2xx, on jette une erreur
      if (!response.ok) {
        // Tente de lire le message d’erreur renvoyé par le serveur
        const errorBody = await response.json().catch(() => ({}));
        throw new Error(errorBody.message || `Erreur HTTP ${response.status}`);
      }

      // 6) Pas de corps à retourner (204 No Content) → objet vide typé
      if (response.status === 204) return {} as T;

      // 7) Sinon, renvoie les données JSON parsées
      return await response.json();
      
    } catch (error) {
      // 8) Log et propage l’erreur pour que l’appelant puisse la gérer
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