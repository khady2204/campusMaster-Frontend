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
   */
  async request<T>(endpoint: string, method: RequestMethod = "GET", body?: unknown): Promise<T> {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }

    const config: RequestInit = {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    };

    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, config);

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        throw new Error(errorBody.message || `Erreur HTTP ${response.status}`);
      }

      if (response.status === 204) return {} as T;

      return await response.json();
    } catch (error) {
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