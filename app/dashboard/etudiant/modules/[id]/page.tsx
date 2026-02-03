"use client";
import { useEffect, useState } from "react";
import type { Module } from "@/core/model/cours/module";
import { moduleService } from "@/core/services/module.service";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { coursService } from "@/core/services/cours.service";
import { Cours } from "@/core/model/cours/cours";
import { useAuth } from "@/core/contexts/authContext";
import ImageCoursBanner from "../../../../../public/images/cr-banner.jpg";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
// import error from "next/error";

export default function DetailsModulePage() {
    const params = useParams();
    const id = params.id as string;
    const [module, setModule] = useState<Module | null>(null);
    const [cours, setCours] = useState<Cours[]>([]);
    const [filteredCours, setFilteredCours] = useState<Cours[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const { user } = useAuth();
    const navigate = useRouter();

    // Récupère le module et les cours de l'étudiant
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await moduleService.getModuleById(id);
                setModule(data);
                if (!user?.id) {
                    setCours([]);
                    setFilteredCours([]);
                    return;
                }
                const coursData = await coursService.getAllCoursByEtudiant(user.id);
                // On ne garde que les cours du module courant
                const coursModule = coursData.filter((c: Cours) => c.moduleId === id);
                setCours(coursModule);
                setFilteredCours(coursModule);
            } catch (e) {
                setError("Erreur lors du chargement du module ou des cours.");
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchData();
    }, [id, user?.id]);

    // Filtrage par recherche
    useEffect(() => {
        if (!searchQuery) {
            setFilteredCours(cours);
        } else {
            setFilteredCours(
                cours.filter((c) =>
                    c.titreCours.toLowerCase().includes(searchQuery.toLowerCase())
                )
            );
        }
    }, [searchQuery, cours]);

    if (loading) return <p>Chargement du module...</p>;
    if (!module) return <p>Module introuvable</p>;

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-semibold text-[#0A3282]/80 dark:text-white">{module.titreModule}</h1>
                    <p className="text-sm text-muted-foreground">Liste des cours du module</p>
                </div>
                <div className="flex gap-4 w-[50%]">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Rechercher un cours..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </div>
            </div>

            {loading && (
                <div className="flex justify-center items-center h-40">
                    <p className="text-muted-foreground">Chargement des cours...</p>
                </div>
            )}
            {error && (
                <div className="flex justify-center items-center h-40">
                    <p className="text-red-500">Erreur : {error}</p>
                </div>
            )}

            {!loading && !error && (
                <>
                    {filteredCours.length === 0 ? (
                        <div className="flex justify-center items-center h-40">
                            <p className="text-muted-foreground">
                                {searchQuery ? "Aucun cours trouvé" : "Aucun cours disponible pour ce module"}
                            </p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
                            {filteredCours.map((cours) => (
                                <CoursCard
                                    key={cours.id}
                                    cours={cours}
                                    onNavigate={() => navigate.push(`/dashboard/etudiant/modules/${id}/cours/${cours.id}`)}
                                />
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}


// Composant pour chaque carte de cours
function CoursCard({
    cours,
    onNavigate
}: {
    cours: Cours;
    onNavigate: () => void;
}) {
    return (
        <div className="border rounded-md shadow-sm hover:shadow-md transition-shadow duration-200 relative group">
            <div onClick={onNavigate} className="cursor-pointer">
                <Image
                    src={ImageCoursBanner}
                    alt={cours.titreCours || "Cours Banner"}
                    width={400}
                    height={200}
                    className="w-full h-40 object-cover rounded-t-md"
                />
                <div className="p-4">
                    <h2 className="text-lg font-semibold text-[#0A3282]/80 dark:text-white">
                        {cours.titreCours}
                    </h2>
                    <p className="text-sm font-light text-muted-foreground line-clamp-2">
                        Ordre : {cours.ordre}
                    </p>
                </div>
            </div>
        </div>
    );
}

