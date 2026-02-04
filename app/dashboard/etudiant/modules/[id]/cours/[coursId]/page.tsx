"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { coursService } from "@/core/services/cours.service";
import { Cours } from "@/core/model/cours/cours";
import { Module } from "@/core/model/cours/module";
import { moduleService } from "@/core/services/module.service";
import Image from "next/image";
import ImageCoursBanner from "../../../../../../../public/images/cr-banner.jpg";
import { Mail, Megaphone, Phone, User } from "lucide-react";
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
                console.log("cours data: ", coursData)
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
                <h1 className="text-2xl font-semibold text-[#0A3282]/80 dark:text-white">{cours.titreCours}</h1>
            </div>

            <hr className="border-t border-blue-600"/>

            <div className="grid md:grid-cols-12 gap-6">
                <div className="md:col-span-9">
                    <Tabs defaultValue="descriptionCours" className="w-full space-y-4">
                        <TabsList className="w-full bg-[#0A3282]/90 dark:bg-gray-800 rounded-md p-1">
                            <TabsTrigger value="descriptionCours">Information</TabsTrigger>
                            <TabsTrigger value="supports">Support</TabsTrigger>
                            <TabsTrigger value="devoirs">Devoirs</TabsTrigger>
                            <TabsTrigger value="remises">Remises</TabsTrigger>
                            <TabsTrigger value="notes">Notes</TabsTrigger>
                            <TabsTrigger value="forum">Forum</TabsTrigger>
                        </TabsList>
                        <TabsContent value="descriptionCours">
                            <Card className="p-3 relative border-0">
                                <Image
                                    src={ImageCoursBanner}
                                    alt="Cours Banner"
                                    height={400}
                                    className="rounded-md w-full h-60 object-cover mb-4"
                                />
                                <div className="absolute top-6 left-6 bg-white/70 dark:bg-gray-800/70 p-2 rounded-md">
                                    <h4>{cours.titreCours}</h4>
                                    <p className="text-sm font-light text-gray-500 text-jut">{cours.description}</p>
                                </div>
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                        </TabsContent>
                        <TabsContent value="supports">
                            <div className="space-y-4">
                                {cours.supports && cours.supports.length > 0 ? (
                                    cours.supports.map((support) => (
                                        <div key={support.id}>
                                            <p className="font-semibold">{support.nomFichier}</p>
                                            <p>{support.cheminFichier}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p>Aucun support disponible.</p>
                                )}
                            </div>
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
                        <TabsContent value="remises">
                            <div>
                                <p className="font-semibold">Liste des remises</p>
                                <p>liste de mes remises</p>
                            </div>
                        </TabsContent>
                        <TabsContent value="notes">
                            <div>
                                <p className="font-semibold">Mes notes</p>
                                <p>liste de mes notes</p>
                            </div>
                        </TabsContent>
                        <TabsContent value="forum">
                            <p className="">forum</p>
                        </TabsContent>
                    </Tabs>
                </div>
                <div className="md:col-span-3 space-y-3">
                    <Card className="p-4 space-y-2 border-0">
                        <h3 className="text-lg font-semibold">Infos du prof</h3>
                        <div className="flex flex-col space-y-2">
                            <div className="flex">
                                <User className="w-4 h-4 text-blue-600"/>
                                <span className="ml-2 text-sm font-light">Enseignant nom</span>
                            </div>
                            <div className="flex">
                                <Mail className="w-4 h-4 text-blue-600"/>
                                <span className="ml-2 text-sm font-light">Email</span>
                            </div>
                            <div className="flex">
                                <Phone className="w-4 h-4 text-blue-600"/>
                                <span className="ml-2 text-sm font-light">Telephone</span>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-4 space-y-2 border-0">
                        <div className="flex">
                            <Megaphone className="w-4 h-4 text-blue-600"/>
                            <span className="ml-2 text-sm font-light">Annonces</span>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
