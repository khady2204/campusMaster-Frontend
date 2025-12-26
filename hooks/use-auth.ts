"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authService, LoginCredentials, User } from "@/services/auth.service";

export function useAuth() {
    
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const loadUser = () => {
            const currentUser = authService.getCurrentUser();
            setUser(currentUser);
            setLoading(false);
        };
        loadUser();
    }, []);

    const login = async (credentials: LoginCredentials) => {
        try {
            const response = await authService.login(credentials);
            setUser(response.user);

            // --- LOGIQUE DE REDIRECTION CENTRALISÉE ---
            const role = response.user.role;
            
            console.log("Connexion réussie. Rôle détecté:", role);

            
            switch (role?.toLowerCase()) {
                case "administrateur":
                case "admin": // Sécurité au cas où le back change
                    router.push("/dashboard");
                    break;
                case "etudiant":
                case "student":
                    router.push("/dashboard");
                    break;
                case "professeur":
                case "teacher":
                    router.push("/dashboard");
                    break;
                default:
                    // Fallback pour les rôles inconnus ou l'utilisateur standard
                    router.push("/dashboard");
                    break;
            }

            return response;
        } catch (error) {
            console.error("Erreur de connexion:", error);
            throw error;
        }
    };

    const logout = () => {
        authService.logout();
        setUser(null);
        router.push("/login");
    };

    return {
        user,
        loading,
        isAuthenticated: !!user,
        login,
        logout,
    };
}