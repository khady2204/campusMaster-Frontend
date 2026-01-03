// Enum des rôles d'utilisateur
export enum Role {
    USER = "USER",
    ETUDIANT = "ETUDIANT",
    ENSEIGNANT = "ENSEIGNANT",
    ADMIN = "ADMINISTRATEUR",
}


// Modèle de l'utilisateur
export interface User {
  id: string
  username: string
  email: string
  prenom: string
  nom: string
  telephone: string
  adresse: string
  role: Role
  createdAt: string
  updatedAt: string
  lastLoginAt: string | null
  emailVerified: boolean
  active: boolean
}