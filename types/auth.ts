// Définition de l'utilisateur basée sur la réponse API
export interface User {
  id: string;
  username: string;
  email: string;
  prenom: string;
  nom: string;
  telephone: string;
  adresse: string;
  role: string; // Ex: 'ETUDIANT'
  createdAt: string;
  updatedAt: string;
  lastLoginAt: string | null; // Peut être null selon le JSON
  emailVerified: boolean;
  active: boolean;
}

// Réponse de l'API lors du login
export interface AuthResponse {
  accessToken: string;
  tokenType: string;
  user: User;
  refreshToken?: string; // Optionnel car absent de votre réponse backend actuelle
}

export interface LoginCredentials {
  username: string;
  password: string;
}