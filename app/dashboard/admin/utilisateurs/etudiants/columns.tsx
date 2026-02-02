"use client"

import { ColumnDef } from "@tanstack/react-table"
import type { User } from "@/core/model/user/user.model"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Edit2, Trash2, View } from "lucide-react"
import { showToast } from "@/core/services/toast.service"
import { userService } from "@/core/services/user.service"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useState } from "react"

function formatDate(date: Date | string) {
    const d = new Date(date)
    return d.toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    })
}

// Composant pour gérer l'état du dialog de modification
function EditDialog({ etudiant, onSuccess }: { etudiant: User; onSuccess: () => void }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!etudiant.id) return;
    const formData = new FormData(event.currentTarget);

    const updatedUser = {
      id: etudiant.id,
      username: formData.get("username") as string,
      prenom: formData.get("prenom") as string,
      nom: formData.get("nom") as string,
      email: formData.get("email") as string,
      telephone: formData.get("telephone") as string,
      adresse: formData.get("adresse") as string,
      role: etudiant.role,
      createdAt: etudiant.createdAt,
      updatedAt: new Date(),
      is_emailVerified: etudiant.is_emailVerified,
      is_active: etudiant.is_active,
      lastLoginAt: etudiant.lastLoginAt
    };

    try {
      await userService.updateUser(etudiant.id, updatedUser);
      showToast("success", { message: "Etudiant mis à jour" });
      setIsOpen(false);
      onSuccess();
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);
      showToast("error", { message: "Erreur lors de la mise à jour" });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <Edit2 className="mr-1" />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-[#0A3282] dark:text-white">
            Modifier l&apos;étudiant
          </DialogTitle>
          <DialogDescription>
            Veuillez mettre à jour les informations de l&apos;étudiant
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <label className="block">
              <span className="block text-sm font-medium mb-2">Username</span>
              <Input
                id="username"
                type="text"
                name="username"
                defaultValue={etudiant.username}
              />
            </label>

            <div className="grid md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="block">
                  <span className="block text-sm font-medium mb-2">Prénom</span>
                  <Input
                    id="prenom"
                    type="text"
                    name="prenom"
                    defaultValue={etudiant.prenom}
                  />
                </label>
                <label className="block">
                  <span className="block text-sm font-medium mb-2">Email</span>
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    defaultValue={etudiant.email}
                  />
                </label>
              </div>

              <div className="space-y-2">
                <label className="block">
                  <span className="block text-sm font-medium mb-2">Nom</span>
                  <Input
                    id="nom"
                    type="text"
                    name="nom"
                    defaultValue={etudiant.nom}
                  />
                </label>
                <label className="block">
                  <span className="block text-sm font-medium mb-2">Téléphone</span>
                  <Input
                    id="telephone"
                    type="tel"
                    name="telephone"
                    defaultValue={etudiant.telephone}
                  />
                </label>
              </div>
            </div>

            <label className="block">
              <span className="block text-sm font-medium mb-2">Adresse</span>
              <Input
                id="adresse"
                type="text"
                name="adresse"
                defaultValue={etudiant.adresse}
              />
            </label>
          </div>

          <div className="mt-8 flex justify-end space-x-3">
            <DialogClose asChild>
              <Button variant="outline" type="button" size="sm">
                Annuler
              </Button>
            </DialogClose>
            <Button
              type="submit"
              size="sm"
              className="bg-[#0A3282] text-white hover:bg-[#0A3282]/80"
            >
              Enregistrer
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Composant pour la suppression
function DeleteDialog({ etudiant, onSuccess }: { etudiant: User; onSuccess: () => void }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = async () => {
    if (!etudiant.id) return;
    try {
      await userService.deleteUser(etudiant.id);
      showToast("success", { message: "Étudiant supprimé avec succès" });
      setIsOpen(false);
      onSuccess();
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
      showToast("error", { message: "Erreur lors de la suppression" });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-1 border-red-600 text-red-600 hover:bg-red-600 hover:text-white">
          <Trash2 className="mr-1" />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-red-600">Supprimer l&apos;étudiant</DialogTitle>
          <DialogDescription>
            Êtes-vous sûr de vouloir supprimer {etudiant.prenom} {etudiant.nom} ? Cette action est irréversible.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6 flex justify-end space-x-3">
          <DialogClose asChild>
            <Button variant="outline" type="button" size="sm">
              Annuler
            </Button>
          </DialogClose>
          <Button
            onClick={handleDelete}
            size="sm"
            className="bg-red-600 text-white hover:bg-red-700"
          >
            Supprimer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export const createColumns = (onRefresh: () => void): ColumnDef<User>[] => [
    {
        accessorKey: "prenom",
        header: "Prenom",
    },
    {
        accessorKey: "nom",
        header: "Nom",
    },
    {
        accessorKey: "email",
        header: "Email"
    },
    {
        accessorKey: "telephone",
        header: "Telephone",
    },
    {
        accessorKey: "active",
        header: "Etat",
        cell: ({ row }) => {
            const etudiant = row.original
            return (
                <span className={etudiant.is_active ? "text-green-500 font-medium" : "text-red-500"}>
                    {etudiant.is_active ? "Actif" : "Inactif"}
                </span>
            )
        },
    },
    {
        accessorKey: "createdAt",
        header: "Créé le",
        cell: ({ row }) => formatDate(row.original.createdAt),
    },
    {
        accessorKey: "updatedAt",
        header: "Mis à jour le",
        cell: ({ row }) => formatDate(row.original.updatedAt),
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            const etudiant = row.original
            
            return (
                <div className="flex gap-2">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline" size="sm" className="flex text-[#0A3282] items-center gap-1">
                                <View className="mr-1" />
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle className="text-[#0A3282] dark:text-white">Détails de l&apos;etudiant</DialogTitle>
                                <DialogDescription>
                                    Les informations sur l&apos;étudiant
                                </DialogDescription>
                            </DialogHeader>
                            <div className="my-2">
                                <div className="grid md:grid-cols-2 gap-5">
                                    <div>
                                        <div className="flex space-x-3">
                                            <p className="font-light text-[#0A3282]/80 dark:text-white">Nom:</p>
                                            <p className="font-extralight dark:text-white">{etudiant.nom}</p>
                                        </div>
                                        <div className="flex space-x-3">
                                            <p className="font-light text-[#0A3282]/80 dark:text-white">Prénom:</p>
                                            <p className="font-extralight dark:text-white">{etudiant.prenom}</p>
                                        </div>
                                        <div className="flex space-x-3">
                                            <p className="font-light text-[#0A3282]/80 dark:text-white">Email:</p>
                                            <p className="font-extralight dark:text-white">{etudiant.email}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex space-x-3">
                                            <p className="font-light text-[#0A3282]/80 dark:text-white">Telephone:</p>
                                            <p className="font-extralight dark:text-white">{etudiant.telephone}</p>
                                        </div>
                                        <div className="flex space-x-3">
                                            <p className="font-light text-[#0A3282]/80 dark:text-white">Créé le:</p>
                                            <p className="font-extralight dark:text-white">{formatDate(etudiant.createdAt)}</p>
                                        </div>
                                        <div className="flex space-x-3">
                                            <p className="font-light text-[#0A3282]/80 dark:text-white">Mis à jour le:</p>
                                            <p className="font-extralight dark:text-white">{formatDate(etudiant.updatedAt)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-10 flex justify-end">
                                <DialogClose>
                                    <Button type="button" size="sm" className="bg-[#0A3282] dark:bg-white/30">
                                        Fermer
                                    </Button>
                                </DialogClose>
                            </div>
                        </DialogContent>
                    </Dialog>
                    
                    <EditDialog etudiant={etudiant} onSuccess={onRefresh} />
                    <DeleteDialog etudiant={etudiant} onSuccess={onRefresh} />
                </div>
            )
        },
    },
]