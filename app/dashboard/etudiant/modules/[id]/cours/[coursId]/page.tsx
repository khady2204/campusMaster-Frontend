"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { coursService } from "@/core/services/cours.service";
import { Cours } from "@/core/model/cours/cours";
import { Module } from "@/core/model/cours/module";
import { moduleService } from "@/core/services/module.service";
import Image from "next/image";
import ImageCoursBanner from "../../../../../../../public/images/cr-banner.jpg";
import { User } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function DetailsCoursPage() {
    const params = useParams();
    const moduleId = params.id as string;
    const coursId = params.coursId as string;
    const [cours, setCours] = useState<Cours | null>(null);
    const [module, setModule] = useState<Module | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                const coursData = await coursService.getCoursById(coursId);
                setCours(coursData);
                const moduleData = await moduleService.getModuleById(moduleId);
                setModule(moduleData);
            } catch (e) {
                setError("Erreur lors du chargement du cours ou du module.");
            } finally {
                setLoading(false);
            }
        };
        if (moduleId && coursId) fetchData();
    }, [moduleId, coursId]);

    if (loading) return <p>Chargement du cours...</p>;
    if (error) return <p className="text-red-500">{error}</p>;
    if (!cours) return <p>Cours introuvable</p>;

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <div className="space-y-3">
                    <h1 className="text-2xl font-semibold text-[#0A3282]/80 dark:text-white">{cours.titreCours}</h1>
                    <div className="flex space-x-3 align-items-center">
                        <User className="w-6 h-6"/>
                        <strong className="">
                            Enseignant
                        </strong>
                    </div>
                </div>
            </div>

            <hr className="border-t border-blue-600"/>

            <div className="grid md:grid-cols-12 gap-6">
                <div className="md:col-span-3">
                    <Card className="p-3">
                        <Image
                            src={ImageCoursBanner}
                            alt="Cours Banner"
                            className="rounded-md"
                        />
                        <div className="">
                            <div className="flex flex-col">
                                <h4 className="">Module</h4>
                                <p className="font-semibold">{module?.titreModule}</p>
                            </div>
                            <div className="flex flex-col">
                                <h4 className="">Semestre</h4>
                                <p className="font-semibold">{cours.semestre?.nom}</p>
                            </div>
                            <div className="flex flex-col">
                                <h4 className="">Ordre du cours</h4>
                                <p className="font-semibold">Ordre {cours.ordre}</p>
                            </div>
                            <div className="flex flex-col">
                                <h4 className="">Type de cours</h4>
                                <p className="font-semibold">{cours.typeCours}</p>
                            </div>
                            <div className="flex flex-col">
                                <h4 className="">Crée le</h4>
                                <p className="font-semibold">{new Date(cours.createdAt).toLocaleDateString()}</p>
                            </div>
                        </div>
                    </Card>
                </div>
                <div className="md:col-span-9">
                    <Tabs defaultValue="descriptionCours" className="w-full space-y-4">
                        <TabsList className="w-full">
                            <TabsTrigger value="descriptionCours">Information</TabsTrigger>
                            <TabsTrigger value="support">Support</TabsTrigger>
                            <TabsTrigger value="devoirs">Devoirs</TabsTrigger>
                            <TabsTrigger value="supports">Forum</TabsTrigger>
                        </TabsList>
                        <TabsContent value="descriptionCours">
                            <div>
                                <p className="font-semibold">ID</p>
                                <p>{cours.id}</p>
                            </div>
                            <div>
                                <p className="font-semibold">Titre</p>
                                <p>{cours.titreCours}</p>
                            </div>
                            <div>
                                <p className="font-semibold">Ordre</p>
                                <p>{cours.ordre}</p>
                            </div>
                        </TabsContent>
                        <TabsContent value="supports">
                            {/* <div className="space-y-4">
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
                            </div> */}
                        </TabsContent>
                        <TabsContent value="devoirs">
                            <div>
                                <p className="font-semibold">Module</p>
                                <p>{cours.module?.titreModule}</p>
                            </div>
                            <div>
                                <p className="font-semibold">Description</p>
                                <p>{cours.module?.description}</p>
                            </div>
                        </TabsContent>
                        <TabsContent value="Forum">
                            <p className="">forum</p>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    );
}
