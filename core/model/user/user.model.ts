// Enum des rôles d'utilisateur
export enum Role {
    USER = "USER",
    ETUDIANT = "ETUDIANT",
    ENSEIGNANT = "ENSEIGNANT",
    ADMIN = "ADMINISTRATEUR",
}


// Modèle de l'utilisateur
export interface User {
  id?: string;
  username: string;
  email: string;
  password?: string;
  prenom: string;
  nom: string;
  telephone: string;
  adresse: string;
  role: Role;
  is_emailVerified?: boolean;
  is_active: boolean;
  createdAt: Date;        
  updatedAt: Date;
  lastLoginAt?: Date | null; 
}