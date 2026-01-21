"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import ImageCoursBanner from "../../../../public/images/cour-banner.jpg";
import type { Cours } from "@/core/model/cours/cours";
import { coursService } from "@/core/services/cours.service"; 
import { useRouter } from "next/navigation";

export default function Cours() {

    const [cours, setCours] = useState<Cours[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useRouter();

    // Chargement des modules au montage du composant
    useEffect(() => {
        const fetchModules = async () => {
            try {
                setLoading(true);
                setError(null);

                // Appel au service pour récupérer les cours
                const cours = await coursService.getAllCours();
                console.log("liste des cours: ", cours);
                setCours(cours);
            } catch (e) {
                const message =
                    e instanceof Error
                        ? e.message
                        : "Impossible de charger les cours.";
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
                <h1 className="text-2xl font-semibold">Cours</h1>
                <p className="text-sm text-muted-foreground">
                    Liste des cours de la plateforme.
                </p>
            </div>

            {loading && <p>Chargement des cours...</p>}
            {error && <p className="text-red-500">Erreur : {error}</p>}
            {!loading && !error && (
                <div className="grid md:grid-cols-3 lg:grid-cols-3 gap-4">
                    {cours.map((cours) => (
                        <div
                            key={cours.id}
                            className="border cursor-pointer rounded-md shadow-sm hover:shadow-md transition-shadow duration-200"
                            onClick={() => navigate.push(`/dashboard/admin/cours/${cours.id}`)}
                        >
                            <Image
                                src={ImageCoursBanner}
                                alt={cours.titre}
                                width={400}
                                height={200}
                                className="w-full h-40"
                            />
                            <div className="p-4">
                                <h2 className="text-lg font-semibold bg">
                                    {cours.titre}
                                </h2>
                                <p>{cours.enseignant.prenom} {cours.enseignant.prenom}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}