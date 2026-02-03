"use client";
import { moduleService } from "@/core/services/module.service";
import { userService } from "@/core/services/user.service";
import { Module } from "@/core/model/cours/module";
import { useEffect, useState } from "react";
import Image from "next/image";
import ImageModuleBanner from "../../../../public/images/module-banner.jpg";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/core/hooks/useAuth"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
    Dialog, 
    DialogClose, 
    DialogContent, 
    DialogDescription, 
    DialogHeader, 
    DialogTitle, 
    DialogTrigger 
} from "@/components/ui/dialog";
import { Plus, Edit2, Trash2, Search } from "lucide-react";
import { showToast } from "@/core/services/toast.service";
import { Textarea } from "@/components/ui/textarea";
import { User } from "@/core/model/user/user.model";


export default function Modules() {
    const { user } = useAuth();
    const [modules, setModules] = useState<Module[]>([]);
    const [enseignants, setEnseignants] = useState<User[]>([]);
    const [filteredModules, setFilteredModules] = useState<Module[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useRouter();

    // Chargement des modules
    const fetchModules = async () => {
        try {
            setLoading(true);
            setError(null);
            const modules = await moduleService.getAllModules();
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


    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError(null);
            const listUsers = await userService.getAllUsers();
            const EnseignantsOnly = listUsers.filter(user => user.role === 'ENSEIGNANT');
            setEnseignants(EnseignantsOnly);
        } catch (e) {
            const message =
                e instanceof Error
                    ? e.message
                    : "Impossible de charger les enseignants";
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchModules();
        fetchUsers();
    }, []);

    // Recherche
    useEffect(() => {
        const filtered = modules.filter((module) =>
            module.titreModule.toLowerCase().includes(searchQuery.toLowerCase()) ||
            module.description?.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredModules(filtered);
    }, [searchQuery, modules]);

    // Ajout d'un module
    const handleAddModule = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsSubmitting(false);

        const formData = new FormData(event.currentTarget);
        const newModule: Module = {
            codeModule: "MOD" + Date.now() + Math.floor(Math.random() * 1000),
            titreModule: formData.get("titre") as string,
            description: formData.get("description") as string,
            responsable: formData.get("responsable") as string,
            createdBy: user?.id || "",
            updatedBy: user?.id || "",
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        console.log("Nouveau module: ", newModule);

        try {
            await moduleService.createModule(newModule);
            showToast("success", { message: "Module ajouté avec succès" });
            setIsAddDialogOpen(false);
            await fetchModules();
        } catch (error) {
            console.error("Erreur lors de l'ajout :", error);
            showToast("error", { message: "Erreur lors de l'ajout du module" });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-semibold text-[#0A3282]/80 dark:text-white">Modules</h1>
                <p className="text-sm text-muted-foreground">
                    Gestion des modules de la plateforme.
                </p>
            </div>

            {/* Barre de recherche et bouton d'ajout */}
            <div className="flex justify-between items-center gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Rechercher un module..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>

                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                        <Button 
                            size="sm" 
                            className="flex items-center gap-1 bg-[#0A3282] text-white hover:bg-[#0A3282]/90"
                        >
                            <Plus className="h-4 w-4" />
                            Ajouter un module
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle className="text-[#0A3282] dark:text-white">
                                Ajouter un module
                            </DialogTitle>
                            <DialogDescription>
                                Veuillez remplir les informations du module
                            </DialogDescription>
                        </DialogHeader>

                        <form onSubmit={handleAddModule}>
                            <div className="space-y-4">
                                <label className="block">
                                    <span className="block text-sm font-medium mb-2">Titre</span>
                                    <Input
                                        type="text"
                                        name="titre"
                                        required
                                        placeholder="Ex: Introduction à React"
                                        disabled={isSubmitting}
                                    />
                                </label>

                                <label className="block">
                                    <span className="block text-sm font-medium mb-2">Description</span>
                                    <Textarea
                                        name="description"
                                        required
                                        placeholder="Description du module..."
                                        disabled={isSubmitting}
                                        rows={4}
                                    />
                                </label>

                                <label className="block">
                                    <span className="block text-sm font-medium mb-2">Responsable du module</span>
                                    <Select name="responsable">
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Choisir un responsable" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {enseignants.map((user) => (
                                                <SelectItem key={user.id} value={user.id!}>
                                                    {user.prenom} {user.nom}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    
                                </label>

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
                                    onNavigate={() => navigate.push(`/dashboard/admin/modules/${module.id}`)}
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
    onUpdate,
    onNavigate 
}: { 
    module: Module; 
    onUpdate: () => void;
    onNavigate: () => void;
}) {
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [enseignants, setEnseignants] = useState<User[]>([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const listUsers = await userService.getUsers();
                const EnseignantsOnly = listUsers.filter(user => user.role === 'ENSEIGNANT');
                setEnseignants(EnseignantsOnly);
            } catch (e) {
                console.error("Impossible de charger les enseignants");
            }
        };
        fetchUsers();
    }, []);

    // Modification
    const handleEdit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData(event.currentTarget);
        const updatedModule: Module = {
            id: module.id,
            codeModule: formData.get("code") as string,
            titreModule: formData.get("titre") as string,
            description: formData.get("description") as string,
            createdBy: formData.get("createdBy") as string,
            updatedBy: formData.get("updatedBy") as string,
            responsable: formData.get("responsableModule") as string,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        try {
            await moduleService.updateModule( module.id!, updatedModule);
            showToast("success", { message: "Module modifié avec succès" });
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
            await moduleService.deleteModule(module.id!);
            showToast("success", { message: "Module supprimé avec succès" });
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
                    <DialogContent onClick={(e) => e.stopPropagation()}>
                        <DialogHeader>
                            <DialogTitle className="text-[#0A3282] dark:text-white">
                                Modifier le module
                            </DialogTitle>
                            <DialogDescription>
                                Modifiez les informations du module
                            </DialogDescription>
                        </DialogHeader>

                        <form onSubmit={handleEdit}>
                            <div className="space-y-4">
                                <label className="block">
                                    <span className="block text-sm font-medium mb-2">Titre</span>
                                    <Input
                                        type="text"
                                        name="titre"
                                        required
                                        defaultValue={module.titreModule}
                                        disabled={isSubmitting}
                                    />
                                </label>

                                <label className="block">
                                    <span className="block text-sm font-medium mb-2">Description</span>
                                    <Textarea
                                        name="description"
                                        required
                                        defaultValue={module.description}
                                        disabled={isSubmitting}
                                        rows={4}
                                    />
                                </label>

                                <label className="block">
                                    <span className="block text-sm font-medium mb-2">Responsable du module</span>
                                    <Select
                                        name="responsable" 
                                        defaultValue={module.responsable}
                                        disabled={isSubmitting}
                                        value={module.responsable}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            {enseignants.map((user) => (
                                                <SelectItem key={user.id} value={user.id!}>
                                                    {user.prenom} {user.nom}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                
                                </label>

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
                            <DialogTitle className="text-red-600">
                                Supprimer le module
                            </DialogTitle>
                            <DialogDescription>
                                Êtes-vous sûr de vouloir supprimer le module &quot;{module.titreModule}&quot; ? Cette action est irréversible.
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

