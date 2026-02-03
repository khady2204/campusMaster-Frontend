"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Edit2, Trash2, View } from "lucide-react"
import { showToast } from "@/core/services/toast.service"
import { enrollementService } from "@/core/services/enrollement.service"
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
import { useAuth } from "@/core/contexts/authContext"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import React from "react"
import { User } from "@/core/model/user/user.model"
import { Enrollement } from "@/core/model/cours/enrollement"
import { Module } from "@/core/model/cours/module"

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
function EditDialog({ enrollement, onSuccess }: { enrollement: Enrollement; onSuccess: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [listModules, setListModules] = React.useState<Array<Module>>([]);
  const [listEtudiants, setListEtudiants] = React.useState<Array<User>>([]);
  const [selectedEtudiant, setSelectedEtudiant] = React.useState<string>(enrollement.etudiantId ?? "");
  const [selectedModule, setSelectedModule] = React.useState<string>(enrollement.moduleId ?? "");

  React.useEffect(() => {
      setSelectedEtudiant(enrollement.etudiantId ?? "");
      setSelectedModule(enrollement.moduleId ?? "");
    const fetchData = async () => {
      try {
        const modules = await import("@/core/services/module.service").then(m => m.moduleService.getAllModules());
        setListModules(modules);
        const users = await import("@/core/services/user.service").then(u => u.userService.getAllUsers());
        const etudiants = users.filter((u: User) => u.role === "ETUDIANT");
        setListEtudiants(etudiants);
      } catch (error) {
        console.error("Erreur lors du chargement des données :", error);
      }
    };
    fetchData();
  }, [enrollement]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!enrollement.id) return;
    setIsSubmitting(true);
    const updatedEnrollement: Enrollement = {
      id: enrollement.id,
      etudiantId: selectedEtudiant,
      moduleId: selectedModule,
      createdBy: typeof enrollement.createdBy === 'string'
        ? enrollement.createdBy
        : (enrollement.createdBy as User)?.id || "",
      updatedAt: new Date(),
      updatedBy: user?.id || "n/a",
    };

    try {
      await enrollementService.updateEnrollement(enrollement.id, updatedEnrollement);
      showToast("success", { message: "Enrollement mis à jour" });
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
            Modifier l&apos;enrollement
          </DialogTitle>
          <DialogDescription>
            Veuillez mettre à jour les informations de l&apos;enrollement
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-x-3 w-full">
            <label className="block text-sm font-medium mb-2">Etudiant</label>
            <Select
              name="etudiantId"
              required
              disabled={isSubmitting}
              value={selectedEtudiant}
              onValueChange={setSelectedEtudiant}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sélectionner un étudiant" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Etudiants</SelectLabel>
                  {listEtudiants.map((etudiant) => (
                    <SelectItem key={etudiant.id ?? ''} value={etudiant.id ?? ''}>
                      {etudiant.nom} {etudiant.prenom}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="space-x-3 w-full">
            <label className="block text-sm font-medium mb-2">Module</label>
            <Select
              name="moduleId"
              required
              disabled={isSubmitting}
              value={selectedModule}
              onValueChange={setSelectedModule}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sélectionner un module" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Modules</SelectLabel>
                  {listModules.map((module) => (
                    <SelectItem key={module.id ?? ''} value={module.id ?? ''}>
                      {module.titreModule}
                    </SelectItem>
                  ))}
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
              disabled={isSubmitting}
            >
              {isSubmitting ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Composant pour la suppression
function DeleteDialog({ enrollement, onSuccess }: { enrollement: Enrollement; onSuccess: () => void }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = async () => {
    if (!enrollement.id) return;
    try {
      await enrollementService.deleteEnrollement(enrollement.id);
      showToast("success", { message: "Enrollement supprimé avec succès" });
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
          <DialogTitle className="text-red-600">Supprimer de l&apos;enrollement</DialogTitle>
          <DialogDescription>
            Êtes-vous sûr de vouloir supprimer {enrollement?.etudiant?.prenom} {enrollement?.etudiant?.nom}? Cette action est irréversible.
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

export const createColumns = (onRefresh: () => void): ColumnDef<Enrollement>[] => [
  {
    accessorKey: "etudiant",
    header: "Etudiant",
    cell: ({ row }) => row.original.etudiant?.prenom + ' ' + row.original.etudiant?.nom,
  },
  {
    accessorKey: "module",
    header: "Module",
    cell: ({ row }) => row.original.module?.titreModule,
  },
  {
    accessorKey: "createdBy",
    header: "Enrollé par",
    cell: ({ row }) => {
      const createdBy = row.original.createdBy
      return (
        <span>{typeof createdBy === 'string' ? createdBy : (createdBy as User)?.prenom + ' ' + (createdBy as User)?.nom}</span>
      )
    }
  },
  {
    accessorKey: "dateCreation",
    header: "Enrolé le",
    cell: ({ row }) => formatDate(row.original.dateCreation!),
  },
  {
    accessorKey: "updatedAt",
    header: "Mis à jour le",
    cell: ({ row }) => formatDate(row.original.updatedAt!),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const enrollement = row.original

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
                <DialogTitle className="text-[#0A3282] dark:text-white">Détails de l&apos;enrollement</DialogTitle>
                <DialogDescription>
                  Les informations sur l&apos;enrollement de {enrollement?.etudiant?.prenom} {enrollement?.etudiant?.nom} 
                </DialogDescription>
              </DialogHeader>
              <div className="my-2">
                <div className="grid ">
                  
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

          <EditDialog enrollement={enrollement} onSuccess={onRefresh} />
          <DeleteDialog enrollement={enrollement} onSuccess={onRefresh} />
        </div>
      )
    },
  },
]