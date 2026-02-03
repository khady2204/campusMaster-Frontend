"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Edit2, Trash2, View } from "lucide-react"
import { showToast } from "@/core/services/toast.service"
import { semestreService } from "@/core/services/semestre.service"
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
import { Semestre } from "@/core/model/cours/semestre"
import { useAuth } from "@/core/contexts/authContext"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import React from "react"
import { User } from "@/core/model/user/user.model"

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
function EditDialog({ semestre, onSuccess }: { semestre: Semestre; onSuccess: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!semestre.id) return;
    const formData = new FormData(event.currentTarget);

    const updatedSemestre: Semestre = {
      id: semestre.id,
      nom: formData.get("nom") as string,
      description: formData.get("description") as string,
      createdAt: semestre.createdAt,
      createdBy: typeof semestre.createdBy === 'string'
        ? semestre.createdBy
        : (semestre.createdBy as User)?.id || "",
      updatedAt: new Date(),
      updatedBy: user?.id || "n/a",
      annee: formData.get("annee") as string,
    };

    console.log("Données semestre avant mis à jour: ", updatedSemestre);

    try {
      await semestreService.updateSemestre(semestre.id, updatedSemestre);
      showToast("success", { message: "Semestre mis à jour" });
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
            Modifier le semestre
          </DialogTitle>
          <DialogDescription>
            Veuillez mettre à jour les informations de du semestre
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">

          <div className="space-y-2">
            <label className="block">
              <span className="block text-sm font-medium mb-2">Nom</span>
              <Input
                id="nom"
                type="text"
                name="nom"
                defaultValue={semestre.nom}
              />
            </label>
          </div>

          <div className="">
            <label className="block">
              <span className="block text-sm font-medium mb-2">Description du semeste</span>
              <Textarea
                name="description"
                rows={4}
                required
                placeholder="Ex: Description du semestre 1"
                defaultValue={semestre.description}
              />
            </label>
          </div>

          <div className="space-x-3 w-full">
            <label className="block text-sm font-medium mb-2">Année</label>
            <Select
              name="annee"
              required
              disabled={isSubmitting}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Ex: 2026" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Année</SelectLabel>
                  {[...Array(5)].map((_, yearIndex) => {
                    const year = new Date().getFullYear() - yearIndex;
                    const yearString = `${year}`;
                    return (
                      <SelectItem key={yearString} value={yearString}>
                        {yearString}
                      </SelectItem>
                    );
                  })}
                </SelectGroup>
              </SelectContent>
            </Select>
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
function DeleteDialog({ semestre, onSuccess }: { semestre: Semestre; onSuccess: () => void }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = async () => {
    if (!semestre.id) return;
    try {
      await semestreService.deleteSemestre(semestre.id);
      showToast("success", { message: "Semestre supprimé avec succès" });
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
          <DialogTitle className="text-red-600">Supprimer du semestre</DialogTitle>
          <DialogDescription>
            Êtes-vous sûr de vouloir supprimer {semestre.nom} ? Cette action est irréversible.
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

export const createColumns = (onRefresh: () => void): ColumnDef<Semestre>[] => [
  {
    accessorKey: "nom",
    header: "Nom",
  },
  {
    accessorKey: "createdAt",
    header: "Créé le",
    cell: ({ row }) => formatDate(row.original.createdAt),
  },
  {
    accessorKey: "annee",
    header: "Année",
    cell: ({ row }) => formatDate(row.original.annee),
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
      const semestre = row.original

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
                <DialogTitle className="text-[#0A3282] dark:text-white">Détails du semestre</DialogTitle>
                <DialogDescription>
                  Les informations sur le semestre
                </DialogDescription>
              </DialogHeader>
              <div className="my-2">
                <div className="grid ">
                  <div>
                    <div className="flex space-x-3">
                      <p className="font-light text-[#0A3282]/80 dark:text-white">Nom:</p>
                      <p className="font-extralight dark:text-white">{semestre.nom}</p>
                    </div>
                    <div className="flex space-x-3">
                      <p className="font-light text-[#0A3282]/80 dark:text-white">Créé le:</p>
                      <p className="font-extralight dark:text-white">{formatDate(semestre.createdAt)}</p>
                    </div>
                    <div className="flex space-x-3">
                      <p className="font-light text-[#0A3282]/80 dark:text-white">Mis à jour le:</p>
                      <p className="font-extralight dark:text-white">{formatDate(semestre.updatedAt)}</p>
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

          <EditDialog semestre={semestre} onSuccess={onRefresh} />
          <DeleteDialog semestre={semestre} onSuccess={onRefresh} />
        </div>
      )
    },
  },
]