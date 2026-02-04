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
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import React from "react";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Semestre } from "@/core/model/cours/semestre";
import { semestreService } from "@/core/services/semestre.service";
import { showToast } from "@/core/services/toast.service";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectLabel, SelectItem } from "@/components/ui/select";
import { X, Upload, FileText, File } from "lucide-react";

export default function DetailsModulePage() {
    const params = useParams();
    const id = params.id as string;
    const [module, setModule] = useState<Module | null>(null);
    const [cours, setCours] = useState<Cours[]>([]);
    const [listModules, setListModules] = useState<Module[]>([]);
    const [ListeSemestre, setListSemestre] = useState<Semestre[]>([]);
    const [filteredCours, setFilteredCours] = useState<Cours[]>([]);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const { user } = useAuth();
    const navigate = useRouter();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);


    // Fonction pour charger les cours (extraite du useEffect)
    const fetchCours = async () => {
        try {
            if (!user?.id) {
                setCours([]);
                setFilteredCours([]);
                return;
            }
            const coursData = await coursService.getAllCoursByEnseignant(user.id);
            // On ne garde que les cours du module courant
            const coursModule = coursData.filter((c: Cours) => c.moduleId === id);
            setCours(coursModule);
            setFilteredCours(coursModule);
        } catch (e) {
            console.error("Erreur lors du chargement des cours:", e);
        }
    };

    // Récupère les cours créés par l'enseignant
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await moduleService.getModuleById(id);
                setModule(data);
                const dataSemestres = await semestreService.getSemestres();
                setListSemestre(dataSemestres);
                const dataModules = await moduleService.getAllModulesByResponsable(user?.id || "");
                setListModules(dataModules);

                await fetchCours(); // ✅ Utiliser la fonction

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

    const handleAddCours = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData(event.currentTarget);

        const supports = selectedFiles.map((file) => {
            const extension = file.name.split('.').pop()?.toLowerCase() || '';

            const getTypeSupport = (ext: string): string => {
                if (['pdf'].includes(ext)) return 'PDF';
                if (['doc', 'docx'].includes(ext)) return 'DOCUMENT';
                if (['ppt', 'pptx'].includes(ext)) return 'PRESENTATION';
                if (['xls', 'xlsx'].includes(ext)) return 'TABLEUR';
                if (['jpg', 'jpeg', 'png', 'gif'].includes(ext)) return 'IMAGE';
                if (['mp4', 'avi', 'mov'].includes(ext)) return 'VIDEO';
                return 'AUTRE';
            };

            return {
                nomFichier: file.name,
                cheminFichier: `/uploads/cours/${file.name}`,
                description: `Support de cours - ${file.name}`,
                typeSupport: getTypeSupport(extension),
                formatSupport: extension.toUpperCase(),
                createdBy: user?.id || "n/a"
            };
        });

        const newCours: Cours = {
            titreCours: formData.get("titreCours") as string,
            description: formData.get("description") as string,
            typeCours: formData.get("typeCours") as string,
            moduleId: id,
            ordre: cours.length + 1,
            semestreId: formData.get("semestre") as string,
            createdBy: user?.id || "n/a",
            createdAt: new Date(),
            updatedAt: new Date(),
            updatedBy: user?.id || "n/a",
            supports: supports
        };

        console.log("Fichiers à uploader: ", selectedFiles);
        console.log("Données du cours: ", newCours);

        try {
            await coursService.createCours(newCours);

            showToast("success", { message: "Cours ajouté avec succès" });

            if (formRef.current) {
                formRef.current.reset();
            }

            setSelectedFiles([]);
            setIsDialogOpen(false);

            // ✅ Rafraîchir la liste des cours
            await fetchCours();

        } catch (error) {
            console.error("Erreur lors de l'ajout :", error);
            showToast("error", { message: "Erreur lors de l'ajout du cours" });
        } finally {
            setIsSubmitting(false);
        }
    };

    const formRef = React.useRef<HTMLFormElement>(null);

    if (loading) return <p>Chargement des cours...</p>;
    if (!module) return <p>Cours introuvables</p>;



    // Gestion de l'ajout de fichiers
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            setSelectedFiles(prev => [...prev, ...newFiles]);
            e.target.value = ''; // Reset input pour permettre le même fichier
        }
    };

    // Suppression d'un fichier
    const removeFile = (index: number) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    };

    // Formater la taille du fichier
    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };

    // Obtenir l'icône selon le type de fichier
    const getFileIcon = (fileName: string) => {
        const extension = fileName.split('.').pop()?.toLowerCase();
        if (['pdf'].includes(extension || '')) return <FileText className="h-5 w-5 text-red-500" />;
        if (['doc', 'docx'].includes(extension || '')) return <FileText className="h-5 w-5 text-blue-500" />;
        if (['xls', 'xlsx'].includes(extension || '')) return <FileText className="h-5 w-5 text-green-500" />;
        if (['ppt', 'pptx'].includes(extension || '')) return <FileText className="h-5 w-5 text-orange-500" />;
        if (['jpg', 'jpeg', 'png', 'gif'].includes(extension || '')) return <FileText className="h-5 w-5 text-purple-500" />;
        if (['txt'].includes(extension || '')) return <FileText className="h-5 w-5 text-gray-500" />;
        if (['mp4', 'avi', 'mov'].includes(extension || '')) return <FileText className="h-5 w-5 text-yellow-500" />;
        return <File className="h-5 w-5 text-gray-500" />;
    };

    return (
        <div className="space-y-4">
            <div>
                <h1 className="text-2xl font-semibold text-[#0A3282]/80 dark:text-white">{module.titreModule}</h1>
                <p className="text-sm text-muted-foreground">Liste des cours du module</p>
            </div>

            <div className="flex justify-between items-center">
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
                <div>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button size="sm" className="flex items-center gap-1 bg-[#0A3282] text-white h-10 hover:bg-[#0A3282]/90">
                                <Plus className="mr-1" />
                                Ajouter un cours
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-lg max-w-4xl">
                            <DialogHeader>
                                <DialogTitle className="text-[#0A3282] dark:text-white">
                                    Ajouter un nouveau cours
                                </DialogTitle>
                                <DialogDescription>
                                    Veuillez remplir les informations du cours
                                </DialogDescription>
                            </DialogHeader>

                            <form ref={formRef} onSubmit={handleAddCours} className="space-y-4 no-scrollbar -mx-4 max-h-[70vh] overflow-y-auto p-3">
                                
                                <div className="flex flex-col space-y-3">
                                    <div className="space-y-3">
                                        <div className="">
                                            <label className="block">
                                                <span className="block text-sm font-medium mb-2">Titre du cours</span>
                                                <Input
                                                    type="text"
                                                    name="titreCours"
                                                    required
                                                    placeholder="Ex: Semestre 1"
                                                    disabled={isSubmitting}
                                                />
                                            </label>
                                        </div>

                                        <div className="">
                                            <label className="block">
                                                <span className="block text-sm font-medium mb-2">Description du cours</span>
                                                <Textarea
                                                    name="description"
                                                    rows={4}
                                                    required
                                                    placeholder="Ex: Description du semestre 1"
                                                    disabled={isSubmitting}
                                                />
                                            </label>
                                        </div>

                                        <div className="space-x-3 w-full">
                                            <label className="block text-sm font-medium mb-2">Semestre du cours</label>
                                            <Select
                                                name="semestre"
                                                required
                                                disabled={isSubmitting}
                                                defaultValue={ListeSemestre[0].id!}
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Ex: Semestre 1" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectLabel>Semestre</SelectLabel>
                                                        {ListeSemestre.map((semestre) => (
                                                            <SelectItem key={semestre.id} value={semestre.id!}>
                                                                {semestre.nom}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-x-3 w-full">
                                            <label className="block text-sm font-medium mb-2">Type de cours</label>
                                            <Select
                                                name="typeCours"
                                                required
                                                disabled={isSubmitting}
                                                defaultValue="TP"
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Ex: TP" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectLabel>Type de cours</SelectLabel>
                                                        <SelectItem value="CM">Cours Magistral (CM)</SelectItem>
                                                        <SelectItem value="TD">Travaux Dirigés (TD)</SelectItem>
                                                        <SelectItem value="TP">Travaux Pratiques (TP)</SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="space-y-3">
                                            <label className="block text-sm font-medium">
                                                Documents du cours
                                            </label>

                                            {/* Zone de drop */}
                                            <div className="relative">
                                                <input
                                                    type="file"
                                                    id="file-upload"
                                                    multiple
                                                    onChange={handleFileChange}
                                                    disabled={isSubmitting}
                                                    className="hidden"
                                                    accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.jpg,.jpeg,.png"
                                                />
                                                <label
                                                    htmlFor="file-upload"
                                                    className={`
                                    flex flex-col items-center justify-center w-full h-32 
                                    border-2 border-dashed rounded-lg cursor-pointer 
                                    bg-gray-50 dark:bg-gray-800 
                                    hover:bg-gray-100 dark:hover:bg-gray-700
                                    border-gray-300 dark:border-gray-600
                                    transition-colors
                                    ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}
                                `}
                                                >
                                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                        <Upload className="w-10 h-10 mb-3 text-gray-400" />
                                                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                                            <span className="font-semibold">Cliquez pour télécharger</span> ou glissez-déposez
                                                        </p>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                                            PDF, DOC, PPT, XLS, Images, Videos (MAX. 10MB par fichier)
                                                        </p>
                                                    </div>
                                                </label>
                                            </div>

                                            {/* Liste des fichiers sélectionnés */}
                                            {selectedFiles.length > 0 && (
                                                <div className="space-y-2">
                                                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                        Fichiers sélectionnés ({selectedFiles.length})
                                                    </p>
                                                    <div className="space-y-2 max-h-48 overflow-y-auto">
                                                        {selectedFiles.map((file, index) => (
                                                            <div
                                                                key={index}
                                                                className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg group hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
                                                            >
                                                                <div className="flex items-center space-x-3 flex-1 min-w-0">
                                                                    {getFileIcon(file.name)}
                                                                    <div className="flex-1 min-w-0">
                                                                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                                                            {file.name}
                                                                        </p>
                                                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                                                            {formatFileSize(file.size)}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                                <Button
                                                                    type="button"
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => removeFile(index)}
                                                                    disabled={isSubmitting}
                                                                    className="ml-2 h-8 w-8 p-0 hover:bg-red-50 dark:hover:bg-red-900/20"
                                                                >
                                                                    <X className="h-4 w-4 text-red-500" />
                                                                </Button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="mt-8 flex justify-end space-x-3">
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
                                    </div>
                                </div>
                                
                            </form>

                        </DialogContent>
                    </Dialog>
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
                                    onNavigate={() => navigate.push(`/dashboard/enseignant/modules/${id}/cours/${cours.id}`)}
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
