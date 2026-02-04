"use client";

import { useEffect, useState } from "react";
import { moduleService } from "@/core/services/module.service";
import type { Module } from "@/core/model/cours/module";
import Image from "next/image";
import ImageModuleBanner from "@/public/images/module-banner.jpg";
import { useRouter } from "next/navigation";
import { useAuth } from "@/core/contexts/authContext";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function EnseignantModules() {
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    const fetchModules = async () => {
      // Vérifier si l'utilisateur est connecté
      if (!user) {
        console.log(" Utilisateur non connecté");
        setError("Vous devez être connecté");
        setLoading(false);
        return;
      }

      // Vérifier le rôle
      if (user.role !== "ENSEIGNANT") {
        console.log(` Rôle incorrect: ${user.role}`);
        setError(`Accès réservé aux enseignants (votre rôle: ${user.role})`);
        setLoading(false);
        return;
      }

      // Vérifier l'ID
      if (!user.id) {
        console.log(" ID utilisateur manquant", user);
        setError("ID utilisateur manquant");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        console.log(`🔍 Recherche modules pour l'enseignant ID: ${user.id}`);
        console.log(`🔍 Nom enseignant: ${user.prenom} ${user.nom}`);
        
        // Appel au service
        const data = await moduleService.getModulesByResponsable(user.id);
        
        console.log(` ${data.length} module(s) trouvé(s) pour l'enseignant`);
        
        // Vérifier la correspondance des IDs
        data.forEach((module, index) => {
          if (module.responsable?.id === user.id) {
            console.log(` Module ${index + 1}: ID responsable correspond`);
          } else {
            console.warn(` Module ${index + 1}: ID responsable ne correspond pas`);
            console.warn(`   Responsable ID: ${module.responsable?.id}`);
            console.warn(`   User ID: ${user.id}`);
          }
        });
        
        setModules(data);
        
      } catch (err) {
        console.error(" Erreur détaillée:", err);
        setError("Erreur lors du chargement des modules. Vérifiez la console pour plus de détails.");
      } finally {
        setLoading(false);
      }
    };

    // Délai pour laisser le contexte se charger
    if (user) {
      fetchModules();
    }
  }, [user]);

  // Si pas connecté
  if (!user) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Non connecté</AlertTitle>
        <AlertDescription>
          Veuillez vous connecter pour accéder à cette page.
        </AlertDescription>
      </Alert>
    );
  }

  // Si pas enseignant
  if (user.role !== "ENSEIGNANT") {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Accès non autorisé</AlertTitle>
        <AlertDescription>
          Cette page est réservée aux enseignants.
        </AlertDescription>
      </Alert>
    );
  }

  if (loading) return <p>Chargement des modules...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!modules || modules.length === 0) return <p>Aucun module disponible.</p>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Modules disponibles</h1>
        <p className="text-sm text-muted-foreground">
          Sélectionnez un module pour créer vos cours
        </p>
      </div>

      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((module) => (
          <div
            key={module.id}
            onClick={() => router.push(`/dashboard/enseignant/modules/${module.id}`)}
            className="cursor-pointer border rounded-xl hover:shadow-lg transition-all overflow-hidden"
          >
            <div className="relative w-full h-40">
              <Image
                src={ImageModuleBanner}
                alt={module.titreModule}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4 space-y-2">
              <h2 className="text-lg font-semibold">{module.titreModule}</h2>
              <p className="text-sm text-muted-foreground line-clamp-3">
                {module.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 