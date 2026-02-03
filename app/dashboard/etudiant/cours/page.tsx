"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import CrBanner from "../../../../public/images/cr-banner.jpg";
import type { Cours } from "@/core/model/cours/cours";
import type { Module } from "@/core/model/cours/module";
import { coursService } from "@/core/services/cours.service";
import { moduleService } from "@/core/services/module.service";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Search, Filter } from "lucide-react";
import { useAuth } from "@/core/contexts/authContext";

export default function PageCours() {
     const { user } = useAuth()
    
    const [cours, setCours] = useState<Cours[]>([]);
    const [filteredCours, setFilteredCours] = useState<Cours[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedModule, setSelectedModule] = useState<string>("all");
    const navigate = useRouter();

    // Chargement des cours et modules
    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);
            if (!user?.id) {
                setCours([]);
                return;
            }
            const coursData: Cours[] = await coursService.getAllCoursByEtudiant(user.id);
            setCours(coursData);
        } catch (e) {
            const message =
                e instanceof Error
                    ? e.message
                    : "Impossible de charger les données.";
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Filtrage par recherche et module
    useEffect(() => {
        let filtered = cours;

        // Filtre par recherche
        if (searchQuery) {
            filtered = filtered.filter(
                (c) =>
                    c.titreCours.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Filtre par module
        if (selectedModule !== "all") {
            filtered = filtered.filter((c) => c.moduleId === selectedModule);
        }

        setFilteredCours(filtered);
    }, [searchQuery, selectedModule, cours]);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-semibold text-[#0A3282]/80 dark:text-white">
                    Cours
                </h1>
                <p className="text-sm text-muted-foreground">
                    Liste de mes cours disponibles
                </p>
            </div>

            {/* Barre de recherche, filtre et bouton d'ajout */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex flex-col md:flex-row gap-3 flex-1 w-full md:w-auto">
                    {/* Recherche */}
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Rechercher un cours..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    {/* Filtre par module */}
                    <div className="relative w-full md:w-64">
                        <Select value={selectedModule} onValueChange={setSelectedModule}>
                            <SelectTrigger>
                                <div className="flex items-center gap-2">
                                    <Filter className="h-4 w-4" />
                                    <SelectValue placeholder="Tous les modules" />
                                </div>
                            </SelectTrigger>
                            {/* <SelectContent>
                                <SelectItem value="all">Tous les modules</SelectItem>
                                {modules.map((module) => (
                                    <SelectItem key={module.id} value={module.id!}>
                                        {module.titreModule}
                                    </SelectItem>
                                ))}
                            </SelectContent> */}
                        </Select>
                    </div>
                </div>
            </div>

            {/* États de chargement et erreur */}
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

            {/* Liste des cours */}
            {!loading && !error && (
                <>
                    {filteredCours.length === 0 ? (
                        <div className="flex flex-col justify-center items-center h-40 space-y-2">
                            <p className="text-muted-foreground">
                                {searchQuery || selectedModule !== "all"
                                    ? "Aucun cours trouvé avec ces filtres"
                                    : "Aucun cours disponible"}
                            </p>
                            {(searchQuery || selectedModule !== "all") && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        setSearchQuery("");
                                        setSelectedModule("all");
                                    }}
                                >
                                    Réinitialiser les filtres
                                </Button>
                            )}
                        </div>
                    ) : (
                        <>
                            {/* Affichage du nombre de résultats */}
                            {/* <div className="text-sm text-muted-foreground">
                                {filteredCours.length} cours trouvé{filteredCours.length > 1 ? "s" : ""}
                                {selectedModule !== "all" && (
                                    <span>
                                        {" "}
                                        dans le module &quot;
                                        {modules.find((m) => m.id === selectedModule)?.titreModule}
                                        &quot;
                                    </span>
                                )}
                            </div> */}

                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {/* {filteredCours.map((cours) => (
                                    <CoursCard
                                        key={cours.id}
                                        cours={cours}
                                        modules={modules}
                                        onUpdate={fetchData}
                                        onNavigate={() =>
                                            navigate.push(`/dashboard/admin/cours/${cours.id}`)
                                        }
                                    />
                                ))} */}
                            </div>
                        </>
                    )}
                </>
            )}
        </div>
    );
}

// Composant pour chaque carte de cours
function CoursCard({
    cours,
    modules,
    onNavigate,
}: {
    cours: Cours;
    modules: Module[];
    onUpdate: () => void;
    onNavigate: () => void;
}) {
    
    // Trouver le module associé
    const moduleAssociated = modules.find((m) => m.id === cours.moduleId);

    return (
        <div className="border rounded-md shadow-sm hover:shadow-md transition-shadow duration-200 relative group">

            {/* Contenu de la carte */}
            <div onClick={onNavigate} className="cursor-pointer">
                <Image
                    src={CrBanner}
                    alt={cours.titreCours || "Cours Banner" }
                    width={400}
                    height={200}
                    className="w-full h-40 object-cover rounded-t-md"
                />
                <div className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-2">
                        <h2 className="text-lg font-semibold text-[#0A3282]/80 dark:text-white line-clamp-1">
                            {cours.titreCours}
                        </h2>
                    </div>

                    {moduleAssociated && (
                        <p className="text-xs text-blue-600 dark:text-blue-400 mb-2">
                            📚 {moduleAssociated.titreModule}
                        </p>
                    )}

                </div>
            </div>
 
        </div>
    );
}
