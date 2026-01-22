"use client";
import { getModulesApi } from "@/core/api/module.api";
import { Module } from "@/core/model/cours/module";
import { useEffect, useState } from "react";
import Image from "next/image";
import ImageModuleBanner from "../../../../public/images/module-banner.jpg";
import { useRouter } from "next/navigation";

export default function Modules() {

    const [modules, setModules] = useState<Module[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useRouter();

    // Chargement des modules au montage du composant
    useEffect(() => {
        const fetchModules = async () => {
            try {
                setLoading(true);
                setError(null);

                // Appel de l'endpoint générique des modules
                const modules = await getModulesApi();

                setModules(modules);
            } catch (e) {
                const message =
                    e instanceof Error
                        ? e.message
                        : "Impossible de charger les modules";
                setError(message);
            } finally {
                setLoading(false);
            }
        };

        fetchModules();
    }, []);
    
    return (
        <div className="space-y-8">
            
            <div>
                <h1 className="text-2xl font-semibold">Modules</h1>
                <p className="text-sm text-muted-foreground">
                    Gestion des modules de la plateforme.
                </p>
            </div>

            {loading && <p>Chargement des modules...</p>}
            {error && <p className="text-red-500">Erreur : {error}</p>}
            {!loading && !error && (
                <div className="grid md:grid-cols-3 lg:grid-cols-3 gap-4">
                    {modules.map((module) => (
                        <div
                            key={module.id}
                            className="border rounded-md shadow-sm hover:shadow-md transition-shadow duration-200"
                            onClick={()=>navigate.push(`/dashboard/admin/modules/${module.id}`)}
                        >
                            <Image
                                src={ImageModuleBanner}
                                alt={module.titre}
                                width={400}
                                height={200}
                                className="w-full h-40 object-cover"
                            />
                            <div className="p-4 ">
                                <h2 className="text-lg font-semibold">
                                    {module.titre}
                                </h2>
                                <p>{module.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}