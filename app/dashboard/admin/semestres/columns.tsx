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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!semestre.id) return;
    const formData = new FormData(event.currentTarget);

    const updatedSemestre = {
      id: semestre.id,
      nom: formData.get("nom") as string,
      createdAt: semestre.createdAt,
      updatedAt: new Date(),
      annee: semestre.annee,
    };

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

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">

            <div className="grid">
              
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
            </div>

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















// "use client"

// import { ColumnDef } from "@tanstack/react-table"
// import type { Semestre } from "@/core/model/cours/semestre"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Edit2, Trash2 } from "lucide-react"
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog"

// // Formatage des dates
// function formatDate(date: Date | string) {
//     const d = new Date(date)
//     return d.toLocaleDateString("fr-FR", {
//         year: "numeric",
//         month: "2-digit",
//         day: "2-digit",
//         hour: "2-digit",
//         minute: "2-digit",
//     })
// }


// export const columns: ColumnDef<Semestre>[] = [
//     {
//         accessorKey: "nom",
//         header: "Nom",
//     },
//     {
//         accessorKey: "createdAt",
//         header: "Créé le",
//         cell: ({ row }) => formatDate(row.original.createdAt),
//     },
//     {
//         accessorKey: "updatedAt",
//         header: "Mis à jour le",
//         cell: ({ row }) => formatDate(row.original.updatedAt),
//     },
//     {
//         id: "actions",
//         header: "Actions",
//         cell: ({ row }) => {
//             // eslint-disable-next-line @typescript-eslint/no-unused-vars
//             const semestre = row.original
//             return (
//                 <div className="flex gap-2">
//                     <Dialog>
//                         <DialogTrigger asChild>
//                             <Button variant="outline" size="sm" className="flex items-center gap-1">
//                                 <Edit2 className="mr-1" />
//                             </Button>
//                         </DialogTrigger>
//                         <DialogContent>
//                             <DialogHeader>
//                                 <DialogTitle>Modification du semestre</DialogTitle>
//                                 <DialogDescription>
//                                     Veuillez modifier les informations du semestre
//                                 </DialogDescription>
//                             </DialogHeader>
//                             <form onSubmit={(event) => {
//                                 event.preventDefault()
//                                 const formData = new FormData(event.currentTarget)
//                                 const nom = formData.get("nom") as string
//                                 // apiClient.put<Semestre>(`/semestres/${semestre.id}`, { nom })
//                             }}>
//                                 <label className="block">
//                                     <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Nom</span>
//                                     <Input type="text" name="nom" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" defaultValue={semestre.nom} />
//                                 </label>
//                                 <div className="mt-10 flex justify-end">
//                                     <Button type="submit"  size="sm">
//                                         Enregistrer
//                                     </Button>
//                                 </div>
//                             </form>
//                         </DialogContent>
//                     </Dialog>
//                     <Button variant="outline" size="sm" className="flex items-center gap-1 border-red-600 text-red-600 hover:bg-red-600 hover:text-white">
//                         <Trash2 className="mr-1" />
//                     </Button>
//                 </div>
//             )
//         },
//     },

// ]