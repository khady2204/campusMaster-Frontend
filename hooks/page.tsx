/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";

export default function LoginPage() {
  const { login } = useAuth();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setError("");
    setIsLoading(true);

    try {
      await login({ identifier, password });
    } catch (err: any) {
      console.error("Erreur de login:", err);
      setError(err.message || "Identifiant ou mot de passe incorrect");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 bg-white dark:bg-gray-900 p-8 rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight">Connexion</h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Accédez à votre espace CampusMaster
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 rounded-md border border-red-200 dark:border-red-800">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label htmlFor="identifier" className="block text-sm font-medium mb-1">Identifiant</label>
              <input id="identifier" name="identifier" type="text" required className="w-full p-2 border rounded-md bg-transparent" placeholder="Email ou nom d'utilisateur" value={identifier} onChange={(e) => setIdentifier(e.target.value)} />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1">Mot de passe</label>
              <input id="password" name="password" type="password" required className="w-full p-2 border rounded-md bg-transparent" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
          </div>

          <button type="submit" disabled={isLoading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed">
            {isLoading ? "Connexion en cours..." : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
}
