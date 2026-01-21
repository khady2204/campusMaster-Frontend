"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { coursService } from "@/core/services/cours.service";
import type { Cours } from "@/core/model/cours/cours";
import Image from "next/image";
import ImgBl1 from "../../../../../public/images/img-bl-1.jpg";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"


export default function DetailsCoursPage() {

    const { id } = useParams(); // récupère l'id depuis l'URL
    const [cours, setCours] = useState<Cours | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCours = async () => {
            try {
            const data = await coursService.getCoursById(id as string);
            setCours(data);
        } catch (error) {
            console.error("Erreur lors du chargement du cours :", error);
        } finally {
            setLoading(false);
        }
        };

        if (id) fetchCours();
    }, [id]);

    if (loading) return <p>Chargement du cours...</p>;
    if (!cours) return <p>Cours introuvable</p>;

    return (
        <div className="space-y-8">
            <div className="py-4 bg-light/50 dark:bg-dark/50 border rounded-md px-4 shadow space-y-4 flex justify-between items-center">
                <div className="space-y-2">
                    <h1 className="text-2xl font-semibold">{cours.titre}</h1>
                    <p className="text-sm text-muted-foreground">
                        Détails du cours
                    </p>
                </div>
                <div className="">
                    <Image
                        src={ImgBl1}
                        alt={cours.titre}
                        width={800}
                        height={400}
                        className="w-full h-30 object-cover rounded-md"
                    />
                </div>
            </div>

            <Tabs defaultValue="descriptionCours" className="w-full space-y-4">
                <TabsList className="w-full">
                    <TabsTrigger value="descriptionCours">Description cours</TabsTrigger>
                    <TabsTrigger value="module">Module</TabsTrigger>
                    <TabsTrigger value="enseignant">Enseignant</TabsTrigger>
                    <TabsTrigger value="supports">Supports</TabsTrigger>
                </TabsList>
                <TabsContent value="descriptionCours">
                    <div>
                        <p className="font-semibold">ID</p>
                        <p>{cours.id}</p>
                    </div>
                    <div>
                        <p className="font-semibold">Titre</p>
                        <p>{cours.titre}</p>
                    </div>
                    <div>
                        <p className="font-semibold">Contenu</p>
                        <p>{cours.contenuTextuel}</p>
                    </div>
                    <div>
                        <p className="font-semibold">Ordre</p>
                        <p>{cours.ordre}</p>
                    </div>
                </TabsContent>
                <TabsContent value="module">
                    <div>
                        <p className="font-semibold">Module</p>
                        <p>{cours.module.titre}</p>
                    </div>
                    <div>
                        <p className="font-semibold">Description</p>
                        <p>{cours.module.description}</p>
                    </div>
                </TabsContent>
                <TabsContent value="enseignant">
                    <div>
                        <p className="font-semibold">Enseignant</p>
                        <p>{cours.enseignant.username}</p>
                    </div>
                    <div>
                        <p className="font-semibold">Email</p>
                        <p>{cours.enseignant.email}</p>
                    </div>
                    <div>
                        <p className="font-semibold">Role</p>
                        <p>{cours.enseignant.role}</p>
                    </div>
                </TabsContent>
                <TabsContent value="supports">
                    <div className="space-y-4">
                        {cours.supports && cours.supports.length > 0 ? (
                            cours.supports.map((support) => (
                                <div key={support.id}>
                                    <p className="font-semibold">{support.nom}</p>
                                    <p>{support.url}</p>
                                </div>
                            ))
                        ) : (
                            <p>Aucun support disponible.</p>
                        )}
                    </div>
                </TabsContent>
            </Tabs>

            {/* <div className="grid grid-cols-2 gap-4">
                <div>
                    <p className="font-semibold">ID</p>
                    <p>{cours.id}</p>
                </div>
                <div>
                    <p className="font-semibold">Titre</p>
                    <p>{cours.titre}</p>
                </div>
                <div>
                    <p className="font-semibold">Contenu</p>
                    <p>{cours.contenuTextuel}</p>
                </div>
                <div>
                    <p className="font-semibold">Ordre</p>
                    <p>{cours.ordre}</p>
                </div>
                <div>
                    <p className="font-semibold">Module</p>
                    <p>{cours.module.titre}</p>
                </div>
                <div>
                    <p className="font-semibold">Enseignant</p>
                    <p>{cours.enseignant.username}</p>
                </div>
            </div> */}
        </div>
    );
}