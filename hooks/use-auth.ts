"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth.service";
import { LoginCredentials, User } from "@/types/auth";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  // Initialisation de l'authentification au chargement
  useEffect(() => {
    const initAuth = () => {
      try {
        const currentUser = authService.getCurrentUser();
        const authenticated = authService.isAuthenticated();

        if (currentUser && authenticated) {
          setUser(currentUser);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Erreur lors de l'initialisation de l'auth:", error);
        authService.logout();
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  // Gestion de la redirection basée sur le rôle
  const handleRedirect = useCallback((role: string) => {
    // Normalisation du rôle (ex: "ROLE_ETUDIANT" -> "ETUDIANT" si nécessaire, ou juste uppercase)
    const normalizedRole = role.toUpperCase().replace("ROLE_", "");
    
    console.log("Redirection pour le rôle :", normalizedRole);

    switch (normalizedRole) {
      case "ADMINISTRATEUR":
      case "ADMIN":
        router.push("/dashboard"); // Redirection vers l'espace admin
        break;
      case "ETUDIANT":
      case "STUDENT":
        router.push("/dashboard"); // Redirection vers l'espace étudiant
        break;
      case "ENSEIGNANT":
      case "PROFESSEUR":
      case "TEACHER":
        router.push("/dashboard"); // Redirection vers l'espace enseignant
        break;
      default:
        router.push("/dashboard"); // Redirection par défaut
        break;
    }
  }, [router]);

  // Fonction de connexion
  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await authService.login(credentials);
      setUser(response.user);
      setIsAuthenticated(true);
      
      // Redirection après connexion réussie
      if (response.user.role) {
        handleRedirect(response.user.role);
      } else {
        router.push("/dashboard");
      }
      
      return response;
    } catch (error) {
      console.error("Erreur de connexion:", error);
      throw error;
    }
  };

  // Fonction de déconnexion
  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
    router.push("/login");
  };

  return {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
  };
}