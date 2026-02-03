"use client"

import * as React from "react"
import {
  ColumnDef,
  flexRender,
  SortingState,
  ColumnFiltersState,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  useReactTable,
  getSortedRowModel,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DialogClose, DialogHeader } from "@/components/ui/dialog"
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Plus } from "lucide-react"
import { showToast } from "@/core/services/toast.service"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useAuth } from "@/core/contexts/authContext"
import { Enrollement } from "@/core/model/cours/enrollement"
import { enrollementService } from "@/core/services/enrollement.service"
import { Module } from "@/core/model/cours/module"
import { User } from "@/core/model/user/user.model"
import { moduleService } from "@/core/services/module.service"
import { userService } from "@/core/services/user.service"
import { useEffect } from "react"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  onRefresh?: () => Promise<void>
  isLoading?: boolean
}

export function DataTable<TData, TValue>({
  columns,
  data,
  onRefresh,
  isLoading = false
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [listModules, setListModules] = React.useState<Array<Module>>([]);
  const [listEtudiants, setListEtudiants] = React.useState<Array<User>>([]);
  const { user } = useAuth();

  // Utiliser une ref pour le formulaire
  const formRef = React.useRef<HTMLFormElement>(null);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
      columnFilters,
      pagination,
    },
  })

  const handleAddEnrollement = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(event.currentTarget)

    const newEnrollement: Enrollement = {
      etudiantId: formData.get("etudiantId") as string,
      moduleId: formData.get("moduleId") as string,
      createdBy: user?.id || "n/a",
    }

    // console.log("Données de la nouvelle semestre: ", newSemestre);


    try {
      await enrollementService.createEnrollement(newEnrollement);
      showToast("success", { message: "Enrollement créé avec succès" });

      // Réinitialiser le formulaire avec vérification
      if (formRef.current) {
        formRef.current.reset();
      }

      // Fermer le dialog
      setIsDialogOpen(false);

      // Actualiser la liste
      if (onRefresh) {
        await onRefresh();
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout :", error);
      showToast("error", { message: "Erreur lors de l'ajout de l'enrollement" });
    } finally {
      setIsSubmitting(false);
    }
  }

  // Charger modules et étudiants en un seul useEffect
  useEffect(() => {
    const fetchData = async () => {
      try {
        const modules = await moduleService.getAllModules();
        setListModules(modules);
        const users = await userService.getAllUsers();
        const etudiants = users.filter(user => user.role === "ETUDIANT");
        setListEtudiants(etudiants);
      } catch (error) {
        console.error("Erreur lors du chargement des données :", error);
      }
    };
    fetchData();
  }, []);


  // Effacer le formulaire lorsqu'on ferme le dialog
  React.useEffect(() => {
    if (!isDialogOpen && formRef.current) {
      formRef.current.reset();
    }
  }, [isDialogOpen]);

  return (
    <div className="">

      <div className="flex justify-between items-center">
        <div className="flex items-center py-4">
          <Input
            placeholder="Rechercher ..."
            value={(table.getColumn("etudiant")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("etudiant")?.setFilterValue(event.target.value)
            }
            className="min-w-md"
          />
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="flex items-center gap-1 bg-[#0A3282] text-white h-10 hover:bg-[#0A3282]/90">
              <Plus className="mr-1" />
              Enroller un étudiant
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-[#0A3282] dark:text-white">
                Effectuer un nouvel enrollement
              </DialogTitle>
              <DialogDescription>
                Veuillez remplir les informations pour créer un nouvel enrollement
              </DialogDescription>
            </DialogHeader>

            <form ref={formRef} onSubmit={handleAddEnrollement} className="space-y-4">

              <div className="space-x-3 w-full">
                <label className="block text-sm font-medium mb-2">Etudiant</label>
                <Select
                  name="etudiantId"
                  required
                  disabled={isSubmitting}
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

      <div className="overflow-hidden rounded-0">
        <Table>
          <TableHeader className="bg-[#0A3282]/90 dark:bg-[#090C13]/80 ">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="text-white">
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Chargement...
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="border-b">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Aucun résultat.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

    </div>
  )
}