"use client";

import { useEffect, useState } from "react";
import { moduleService } from "@/core/services/module.service";
import type { Module } from "@/core/model/cours/module";
import Image from "next/image";
import ImageModuleBanner from "@/public/images/module-banner.jpg";
import { useRouter } from "next/navigation";

export default function EnseignantModules() {
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchModules = async () => {
      try {
        setLoading(true);
        setError(null);
        const enseignantId = "123";
        const data = await moduleService.getAllModules(enseignantId); // Utilisation du service
        setModules(data);
      } catch (err) {
        console.error(err);
        setError("Impossible de récupérer les modules");
      } finally {
        setLoading(false); 
      }
    };

    fetchModules();
  }, []);

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