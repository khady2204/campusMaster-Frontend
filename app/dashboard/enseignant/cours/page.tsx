"use client";
  
import { useEffect, useState } from "react";
import Image from "next/image";
import CrBanner from "../../../../public/images/cr-banner.jpg";
import type { Cours } from "@/core/model/cours/cours";
import type { Module } from "@/core/model/cours/module";
import { coursService } from "@/core/services/cours.service";
import { getModulesApi } from "@/core/api/module.api";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog,DialogClose,DialogContent,DialogDescription,DialogHeader,DialogTitle,DialogTrigger,
} from "@/components/ui/dialog";
import {Select,SelectContent,SelectItem,SelectTrigger,SelectValue,} from "@/components/ui/select";
import { Plus, Edit2, Trash2, Search, Filter } from "lucide-react";
import { showToast } from "@/core/services/toast.service";
import { Textarea } from "@/components/ui/textarea";
import { AddCourseModal } from "@/components/enseignant/add-course-modal";
import { semestreService } from "@/core/services/semestre.service";
import { Semestre } from "@/core/model/cours/semestre";
import { AddSupportModal } from "@/components/enseignant/add-support-modal";
import { Support } from "@/core/model/cours/support";

export default function PageCours() {
    
    const [cours, setCours] = useState<Cours[]>([]);
    const [modules, setModules] = useState<Module[]>([]);
    const [semestres, setSemestres] = useState<Semestre[]>([]);
    const [filteredCours, setFilteredCours] = useState<Cours[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedModule, setSelectedModule] = useState<string>("all");
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useRouter();
    const [isAddSupportDialogOpen, setIsAddSupportDialogOpen] = useState(false); // pour ajouter un support
    const [isSubmittingSupport, setIsSubmittingSupport] = useState(false);

    // Chargement des cours et modules
    const fetchCours = async () => {
        try {
            setLoading(true);
            setError(null);
            const [coursData, modulesData] = await Promise.all([
                coursService.getAllCours(),
                getModulesApi(),
            ]);
            setCours(coursData);
            setModules(modulesData);
            setFilteredCours(coursData);
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
    const fetchSemestres = async () => {
    try {
        const data = await semestreService.getSemestres();
        setSemestres(data);
    } catch (error) {
        console.error("Erreur lors du chargement des semestres:", error);
    }
   };

   // Fonction pour ajouter un support
    const handleAddSupport = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmittingSupport(true);

    const formData = new FormData(event.currentTarget);
    const newSupport = {
        nom: formData.get("nom") as string,
        url: formData.get("url") as string,
        coursId: formData.get("coursId") as string, // lier au cours concerné
    };

    try {
        // Ici tu appelles ton service pour créer le support
        // await supportService.createSupport(newSupport);

        showToast("success", { message: "Support ajouté avec succès" });
        setIsAddSupportDialogOpen(false);
        // éventuellement recharger les supports du cours
    } catch (error) {
        console.error("Erreur lors de l'ajout du support :", error);
        showToast("error", { message: "Erreur lors de l'ajout du support" });
    } finally {
        setIsSubmittingSupport(false);
        event.currentTarget.reset();
    }
    };

    useEffect(() => {
        fetchCours();
        fetchSemestres();
    }, []);

    // Filtrage par recherche et module
    useEffect(() => {
        let filtered = cours;

        // Filtre par recherche
        if (searchQuery) {
            filtered = filtered.filter(
                (c) =>
                    c.titreCours.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    c.contenuTextuel?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Filtre par module
        if (selectedModule !== "all") {
            filtered = filtered.filter((c) => c.moduleId === selectedModule);
        }

        setFilteredCours(filtered);
    }, [searchQuery, selectedModule, cours]);

    // Ajout d'un cours
    const handleAddCours = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData(event.currentTarget);

        const newCours = {
            moduleId: formData.get("moduleId") as string,
            semestreId: formData.get("semestreId") as string,
            titreCours: formData.get("titreCours") as string,
            description: formData.get("description") as string,

            // champs requis par le backend
            contenuTextuel: formData.get("description") as string, // temporaire
            ordre: 1,
            typeCours: "CLASSIQUE",
            createdBy: "3fa85f64-5717-4562-b3fc-2c963f66afa6", // plus tard depuis auth
        };

        try {
            await coursService.createCours(newCours);

            showToast("success", { message: "Cours ajouté avec succès" });
            setIsAddDialogOpen(false);
            await fetchCours();
        } catch (error) {
            console.error("Erreur lors de l'ajout :", error);
            showToast("error", { message: "Erreur lors de l'ajout du cours" });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-semibold text-[#0A3282]/80 dark:text-white">
                    Cours
                </h1>
                <p className="text-sm text-muted-foreground">
                    Liste des cours de la plateforme.
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
                            <SelectContent>
                                <SelectItem value="all">Tous les modules</SelectItem>
                                {/* {modules.map((module) => (
                                    <SelectItem key={module.id} value={module.id}>
                                        {module.titre}
                                    </SelectItem>
                                ))} */}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Bouton d'ajout */}
                <div className="flex flex-row gap-2 justify-end">
                    <Button
                        size="sm"
                        className="flex items-center gap-1 bg-[#0A3282] text-white hover:bg-[#0A3282]/90 w-full md:w-auto"
                        onClick={() => setIsAddDialogOpen(true)}>
                        <Plus className="h-4 w-4" />
                        Ajouter un cours
                    </Button>
                    <AddCourseModal
                        open={isAddDialogOpen}
                        onOpenChange={setIsAddDialogOpen}
                        modules={modules}          
                        semestres={semestres}             
                        handleAddCours={handleAddCours}
                        isSubmitting={isSubmitting}
                        />

                    <Button
                        size="sm"
                        className="flex items-center gap-1 bg-[#0A3282] text-white hover:bg-[#0A3282]/90 w-full md:w-auto"
                        onClick={() => setIsAddSupportDialogOpen(true)}>
                        <Plus className="h-4 w-4" />
                        Ajouter un support
                        </Button>
                    <AddSupportModal
                        open={isAddSupportDialogOpen}
                        onOpenChange={setIsAddSupportDialogOpen}
                        cours={cours} 
                        isSubmitting={isSubmittingSupport} 
                        handleAddSupport={async (support: Support) => {
                        setIsSubmittingSupport(true);
                        try {
                                        // Ici tu appelleras plus tard ton service
                        // await supportService.createSupport(support);

                        console.log("Support à ajouter:", support); // pour l'instant juste log
                        showToast("success", { message: "Support ajouté (simulation)" });
                        } catch (error) {
                            console.error(error);
                            showToast("error", { message: "Erreur lors de l'ajout du support" });
                        } finally {
                            setIsSubmittingSupport(false);
                        }
                    }}
                    />
                                    
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
                            <div className="text-sm text-muted-foreground">
                                {filteredCours.length} cours trouvé{filteredCours.length > 1 ? "s" : ""}
                                {selectedModule !== "all" && (
                                    <span>
                                        {" "}
                                        dans le module &quot;
                                        {modules.find((m) => m.id === selectedModule)?.titreModule}
                                        &quot;
                                    </span>
                                )}
                            </div>
                        
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {filteredCours.map((cours) => (
                                    <CoursCard
                                        key={cours.id}
                                        cours={cours}
                                        modules={modules}
                                        onUpdate={fetchCours}
                                        onNavigate={() =>
                                            navigate.push(`/dashboard/enseignant/cours/${cours.id}`)
                                        }
                                    />
                                ))}
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
    onUpdate,
    onNavigate,
}: {
    cours: Cours;
    modules: Module[];
    onUpdate: () => void;
    onNavigate: () => void;
}) {
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Trouver le module associé
    const moduleAssociated = modules.find((m) => m.id === cours.moduleId);

    // Modification
    const handleEdit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData(event.currentTarget);
        const updatedCours = {
            id: cours.id,
            titre: formData.get("titre") as string,
            description: formData.get("description") as string,
            moduleId: formData.get("moduleId") as string,
            contenuTextuel: formData.get("contenuTextuel") as string,
            
        };

        try {
            // await coursService.updateCours(cours.id!, updatedCours);
            showToast("success", { message: "Cours modifié avec succès" });
            setIsEditDialogOpen(false);
            onUpdate();
        } catch (error) {
            console.error("Erreur lors de la modification :", error);
            showToast("error", { message: "Erreur lors de la modification" });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Suppression
    const handleDelete = async () => {
        setIsSubmitting(true);
        try {
            await coursService.deleteCours(cours.id!);
            showToast("success", { message: "Cours supprimé avec succès" });
            setIsDeleteDialogOpen(false);
            onUpdate();
        } catch (error) {
            console.error("Erreur lors de la suppression :", error);
            showToast("error", { message: "Erreur lors de la suppression" });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="border rounded-md shadow-sm hover:shadow-md transition-shadow duration-200 relative group">
            {/* Actions overlay */}
            <div className="absolute top-2 right-2 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                    <DialogTrigger asChild>
                        <Button
                            variant="secondary"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Edit2 className="h-4 w-4" />
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl" onClick={(e) => e.stopPropagation()}>
                        <DialogHeader>
                            <DialogTitle className="text-[#0A3282] dark:text-white">
                                Modifier le cours
                            </DialogTitle>
                            <DialogDescription>Modifiez les informations du cours</DialogDescription>
                        </DialogHeader>

                        <form onSubmit={handleEdit}>
                            <div className="space-y-4">
                                <label className="block">
                                    <span className="block text-sm font-medium mb-2">Titre</span>
                                    <Input
                                        type="text"
                                        name="titre"
                                        required
                                        defaultValue={cours.titreCours}
                                        disabled={isSubmitting}
                                    />
                                </label>

                                <label className="block">
                                    <span className="block text-sm font-medium mb-2">Description</span>
                                    <Textarea
                                        name="description"
                                        required
                                        defaultValue={cours.contenuTextuel}
                                        disabled={isSubmitting}
                                        rows={4}
                                    />
                                </label>

                                <div className="grid md:grid-cols-3 gap-4">
                                    <label className="block">
                                        <span className="block text-sm font-medium mb-2">Module</span>
                                        <Select
                                            name="moduleId"
                                            required
                                            disabled={isSubmitting}
                                            defaultValue={cours.moduleId}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {/* {modules.map((module) => (
                                                    <SelectItem key={module.id} value={module.id}>
                                                        {module.titre}
                                                    </SelectItem>
                                                ))} */}
                                            </SelectContent>
                                        </Select>
                                    </label>

                                </div>
                            </div>

                            <div className="mt-6 flex justify-end space-x-3">
                                <DialogClose asChild>
                                    <Button
                                        variant="outline"
                                        type="button"
                                        size="sm"
                                        disabled={isSubmitting}
                                    >
                                        Annuler
                                    </Button>
                                </DialogClose>
                                <Button
                                    type="submit"
                                    size="sm"
                                    className="bg-[#0A3282] text-white hover:bg-[#0A3282]/80"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? "Enregistrement..." : "Enregistrer"}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>

                <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                    <DialogTrigger asChild>
                        <Button
                            variant="destructive"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </DialogTrigger>
                    <DialogContent onClick={(e) => e.stopPropagation()}>
                        <DialogHeader>
                            <DialogTitle className="text-red-600">Supprimer le cours</DialogTitle>
                            <DialogDescription>
                                Êtes-vous sûr de vouloir supprimer le cours &quot;{cours.titreCours}&quot; ?
                                Cette action est irréversible.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="mt-6 flex justify-end space-x-3">
                            <DialogClose asChild>
                                <Button
                                    variant="outline"
                                    type="button"
                                    size="sm"
                                    disabled={isSubmitting}
                                >
                                    Annuler
                                </Button>
                            </DialogClose>
                            <Button
                                onClick={handleDelete}
                                size="sm"
                                className="bg-red-600 text-white hover:bg-red-700"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Suppression..." : "Supprimer"}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

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

                    <p className="text-sm font-light text-muted-foreground line-clamp-2">
                        {cours.contenuTextuel}
                    </p>

                </div>
            </div>
        </div> 
        
    );
}

















