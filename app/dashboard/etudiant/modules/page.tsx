"use client";
import { moduleService } from "@/core/services/module.service";
import { Module } from "@/core/model/cours/module";
import { useEffect, useState } from "react";
import Image from "next/image";
import ImageModuleBanner from "../../../../public/images/module-banner.jpg";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useAuth } from "@/core/contexts/authContext";

export default function Modules() {
    const [modules, setModules] = useState<Module[]>([]);
    const [filteredModules, setFilteredModules] = useState<Module[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useRouter();
    const { user } = useAuth();

    // Chargement des modules
    const fetchModules = async () => {
        try {
            setLoading(true);
            setError(null);

            if (!user?.id) {
                setModules([]);
                return;
            }

            const modules = await moduleService.getAllModulesByEtudiant(user?.id);
            setModules(modules);
            setFilteredModules(modules);
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

    useEffect(() => {
        fetchModules();
    }, []);

    // Recherche
    useEffect(() => {
        const filtered = modules.filter((module) =>
            module.titreModule.toLowerCase().includes(searchQuery.toLowerCase()) ||
            module.description?.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredModules(filtered);
    }, [searchQuery, modules]);


    return (
        <div className="space-y-8">
            <div className="flex justify-between align-items-center">
                <div>
                    <h1 className="text-2xl font-semibold text-[#0A3282]/80 dark:text-white">Mes modules et Cours</h1>
                    <p className="text-sm text-muted-foreground">
                        Mes cours et modules disponibles
                    </p>
                </div>

                {/* Barre de recherche et bouton d'ajout */}
                <div className="flex justify-between items-center gap-4 w-[50%]">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Rechercher un module..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </div>
            </div>

            {/* États de chargement et erreur */}
            {loading && (
                <div className="flex justify-center items-center h-40">
                    <p className="text-muted-foreground">Chargement des modules...</p>
                </div>
            )}
            
            {error && (
                <div className="flex justify-center items-center h-40">
                    <p className="text-red-500">Erreur : {error}</p>
                </div>
            )}

            {/* Liste des modules */}
            {!loading && !error && (
                <>
                    {filteredModules.length === 0 ? (
                        <div className="flex justify-center items-center h-40">
                            <p className="text-muted-foreground">
                                {searchQuery ? "Aucun module trouvé" : "Aucun module disponible"}
                            </p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredModules.map((module) => (
                                <ModuleCard 
                                    key={module.id} 
                                    module={module} 
                                    onUpdate={fetchModules}
                                    onNavigate={() => navigate.push(`/dashboard/etudiant/modules/${module.id}`)}
                                />
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

// Composant pour chaque carte de module
function ModuleCard({ 
    module, 
    onNavigate 
}: { 
    module: Module; 
    onUpdate: () => void;
    onNavigate: () => void;
}) {

    return (
        <div className="border rounded-md shadow-sm hover:shadow-md transition-shadow duration-200 relative group">
            
            {/* Contenu de la carte */}
            <div onClick={onNavigate} className="cursor-pointer">
                <Image
                    src={ImageModuleBanner}
                    alt={module.titreModule || "Module Banner"} 
                    width={400}
                    height={200}
                    className="w-full h-40 object-cover rounded-t-md"
                />
                <div className="p-4">
                    <h2 className="text-lg font-semibold text-[#0A3282]/80 dark:text-white">
                        {module.titreModule}
                    </h2>
                    <p className="text-sm font-light text-muted-foreground line-clamp-2">
                        {module.description}
                    </p>
                </div>
            </div>
        </div>
    );
}

