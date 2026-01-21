import { Role, User } from "./user.model"

// Données envoyé au login
export interface Login {
  email: string
  password: string
}

// Données envoyées pour le register
export interface Register {
  username: string
  prenom: string
  nom: string
  email: string
  password: string
  confirmPassword: string
  telephone: string
  adresse: string
  role: Role
}

// Réponse backend après login
export interface loginResponse {
  accessToken: string
  refreshToken: string
  tokenType: string // "Bearer"
  user: User
}

// Réponse backend après register
export interface registerResponse {
  user: User
}