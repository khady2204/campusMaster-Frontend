"use client";
import { useEffect, useState } from "react";
import type { Module } from "@/core/model/cours/module";
import { moduleService } from "@/core/services/module.service";
import { useParams } from "next/navigation";
import Image from "next/image";
import ImgBl1 from "../../../../../public/images/img-bl-1.jpg";

export default function DetailsModulePage() {
    const { id } = useParams(); // récupère l'id depuis l'URL
        const [module, setModule] = useState<Module | null>(null);
        const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const fetchModule = async () => {
            try {
            const data = await moduleService.getModuleById(id as string);
            setModule(data);
        } catch (error) {
            console.error("Erreur lors du chargement du module :", error);
        } finally {
            setLoading(false);
        }
        };

        if (id) fetchModule();
    }, [id]);

    if (loading) return <p>Chargement du module...</p>;
    if (!module) return <p>Module introuvable</p>;
    
    return (
        <div className="space-y-4">
            <div className="py-4 bg-light/50 dark:bg-dark/50 border rounded-md px-4 shadow space-y-4 flex justify-between items-center">
                <div className="space-y-2">
                    <h1 className="text-2xl font-semibold">{module.titre}</h1>
                    <p className="text-sm text-muted-foreground">
                        Détails du module
                    </p>
                </div>
                <div className="">
                    <Image
                        src={ImgBl1}
                        alt={module.titre}
                        width={800}
                        height={400}
                        className="w-full h-30 object-cover rounded-md"
                    />
                </div>
            </div>

            <div className="">
                <h2 className="text-xl font-semibold">Code module</h2>
                <p className="text-base text-muted-foreground">
                    {module.code}
                </p>

                <h2 className="text-xl font-semibold">Description</h2>
                <p className="text-base text-muted-foreground">
                    {module.description}
                </p>

            </div>
        </div>
    );
}