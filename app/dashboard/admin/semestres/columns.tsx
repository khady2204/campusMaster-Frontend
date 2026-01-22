"use client"

import { ColumnDef } from "@tanstack/react-table"
import type { Semestre } from "@/core/model/cours/semestre"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Edit2, Trash2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

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


export const columns: ColumnDef<Semestre>[] = [
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
        accessorKey: "updatedAt",
        header: "Mis à jour le",
        cell: ({ row }) => formatDate(row.original.updatedAt),
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const semestre = row.original
            return (
                <div className="flex gap-2">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline" size="sm" className="flex items-center gap-1">
                                <Edit2 className="mr-1" />
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Modification du semestre</DialogTitle>
                                <DialogDescription>
                                    Veuillez modifier les informations du semestre
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={(event) => {
                                event.preventDefault()
                                const formData = new FormData(event.currentTarget)
                                const nom = formData.get("nom") as string
                                // apiClient.put<Semestre>(`/semestres/${semestre.id}`, { nom })
                            }}>
                                <label className="block">
                                    <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Nom</span>
                                    <Input type="text" name="nom" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" defaultValue={semestre.nom} />
                                </label>
                                <div className="mt-10 flex justify-end">
                                    <Button type="submit"  size="sm">
                                        Enregistrer
                                    </Button>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>
                    <Button variant="outline" size="sm" className="flex items-center gap-1 border-red-600 text-red-600 hover:bg-red-600 hover:text-white">
                        <Trash2 className="mr-1" />
                    </Button>
                </div>
            )
        },
    },

]