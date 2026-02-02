"use client"

import { ColumnDef } from "@tanstack/react-table"
import type { User } from "@/core/model/user/user.model"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Edit2, Trash2, View } from "lucide-react"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { showToast } from "@/core/services/toast.service"
import { userService } from "@/core/services/user.service"
import { useState } from "react"

// Formatage des dates
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
function EditDialog({ admin, onSuccess }: { admin: User; onSuccess: () => void }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!admin.id) return;
    const formData = new FormData(event.currentTarget);

    const updatedUser = {
      id: admin.id,
      username: formData.get("username") as string,
      prenom: formData.get("prenom") as string,
      nom: formData.get("nom") as string,
      email: formData.get("email") as string,
      telephone: formData.get("telephone") as string,
      adresse: formData.get("adresse") as string,
      role: admin.role,
      createdAt: admin.createdAt,
      updatedAt: new Date(),
      is_emailVerified: admin.is_emailVerified,
      is_active: admin.is_active,
      lastLoginAt: admin.lastLoginAt
    };

    try {
      await userService.updateUser(admin.id, updatedUser);
      showToast("success", { message: "Administrateur mis à jour" });
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
            Modifier l&apos;administrateur
          </DialogTitle>
          <DialogDescription>
            Veuillez mettre à jour les informations de l&apos;administrateur
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
                defaultValue={admin.username}
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
                    defaultValue={admin.prenom}
                  />
                </label>
                <label className="block">
                  <span className="block text-sm font-medium mb-2">Email</span>
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    defaultValue={admin.email}
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
                    defaultValue={admin.nom}
                  />
                </label>
                <label className="block">
                  <span className="block text-sm font-medium mb-2">Téléphone</span>
                  <Input
                    id="telephone"
                    type="tel"
                    name="telephone"
                    defaultValue={admin.telephone}
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
                defaultValue={admin.adresse}
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
function DeleteDialog({ admin, onSuccess }: { admin: User; onSuccess: () => void }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = async () => {
    if (!admin.id) return;
    try {
      await userService.deleteUser(admin.id);
      showToast("success", { message: "Administrateur supprimé avec succès" });
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
          <DialogTitle className="text-red-600">Supprimer l&apos;administrateur</DialogTitle>
          <DialogDescription>
            Êtes-vous sûr de vouloir supprimer {admin.prenom} {admin.nom} ? Cette action est irréversible.
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
        header: "Email",
    },
    {
        accessorKey: "telephone",
        header: "Telephone",
    },
    {
        accessorKey: "active",
        header: "Etat",
        cell: ({ row }) => {
            const admin = row.original
            return (
                <span className={admin.is_active ? "text-green-500 font-medium" : "text-red-500"}>
                    {admin.is_active ? "Actif" : "Inactif"}
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
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const administrateur = row.original
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
                                <DialogTitle className="text-[#0A3282] dark:text-white">Détails de l&apos;administrateur</DialogTitle>
                                <DialogDescription>
                                    Les informations sur l&apos;administrateur
                                </DialogDescription>
                            </DialogHeader>
                            <div className="my-2">
                                <div className="grid md:grid-cols-2 gap-5">
                                    <div>
                                        <div className="flex space-x-3">
                                            <p className="font-light text-[#0A3282]/80 dark:text-white">Nom:</p>
                                            <p className="font-extralight dark:text-white">{administrateur.nom}</p>
                                        </div>
                                        <div className="flex space-x-3">
                                            <p className="font-light text-[#0A3282]/80 dark:text-white">Prénom:</p>
                                            <p className="font-extralight dark:text-white">{administrateur.prenom}</p>
                                        </div>
                                        <div className="flex space-x-3">
                                            <p className="font-light text-[#0A3282]/80 dark:text-white">Email:</p>
                                            <p className="font-extralight dark:text-white">{administrateur.email}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex space-x-3">
                                            <p className="font-light text-[#0A3282]/80 dark:text-white">Telephone:</p>
                                            <p className="font-extralight dark:text-white">{administrateur.telephone}</p>
                                        </div>
                                        <div className="flex space-x-3">
                                            <p className="font-light text-[#0A3282]/80 dark:text-white">Créé le:</p>
                                            <p className="font-extralight dark:text-white">{formatDate(administrateur.createdAt)}</p>
                                        </div>
                                        <div className="flex space-x-3">
                                            <p className="font-light text-[#0A3282]/80 dark:text-white">Mis à jour le:</p>
                                            <p className="font-extralight dark:text-white">{formatDate(administrateur.updatedAt)}</p>
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
                    
                    <EditDialog admin={administrateur} onSuccess={onRefresh} />
                    <DeleteDialog admin={administrateur} onSuccess={onRefresh} />
                </div>
            )
        },
    },

]