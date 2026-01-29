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
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { showToast } from "@/core/services/toast.service"
import { userService } from "@/core/services/user.service"
import { Role, User } from "@/core/model/user/user.model"

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

  const handleAddStudent = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    
    const formData = new FormData(event.currentTarget)
    
    const newStudent: User = {
      username: formData.get("username") as string,
      nom: formData.get("nom") as string,
      prenom: formData.get("prenom") as string,
      email: formData.get("email") as string,
      password: "password123",
      telephone: formData.get("telephone") as string,
      adresse: formData.get("adresse") as string,
      role: Role.ENSEIGNANT,
      active: true,
      emailVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    

    try {
      await userService.createUser(newStudent);
      showToast("success", { message: "Enseignant ajouté avec succès" });
      
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
      showToast("error", { message: "Erreur lors de l'ajout de l'enseignant" });
    } finally {
      setIsSubmitting(false);
    }
  }

  // Réinitialiser le formulaire quand le dialog se ferme
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
            value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("email")?.setFilterValue(event.target.value)
            }
            className="min-w-md"
          />
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="flex items-center gap-1 bg-[#0A3282] text-white h-10 hover:bg-[#0A3282]/90">
              <Plus className="mr-1" />
              Ajouter un enseignant
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-[#0A3282] dark:text-white">
                Ajouter un enseignant
              </DialogTitle>
              <DialogDescription>
                Veuillez remplir les informations de l&apos;enseignant
              </DialogDescription>
            </DialogHeader>
            
            <form ref={formRef} onSubmit={handleAddStudent}>
              <div className="space-y-4">
                <label className="block">
                  <span className="block text-sm font-medium mb-2">Username</span>
                  <Input
                    type="text"
                    name="username"
                    required
                    placeholder="Ex: john.doe"
                    disabled={isSubmitting}
                  />
                </label>

                <div className="grid md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="block">
                      <span className="block text-sm font-medium mb-2">Prénom</span>
                      <Input
                        type="text"
                        name="prenom"
                        required
                        placeholder="Ex: John"
                        disabled={isSubmitting}
                      />
                    </label>
                    <label className="block">
                      <span className="block text-sm font-medium mb-2">Email</span>
                      <Input
                        type="email"
                        name="email"
                        required
                        placeholder="Ex: john.doe@example.com"
                        disabled={isSubmitting}
                      />
                    </label>
                  </div>

                  <div className="space-y-2">
                    <label className="block">
                      <span className="block text-sm font-medium mb-2">Nom</span>
                      <Input
                        type="text"
                        name="nom"
                        required
                        placeholder="Ex: Doe"
                        disabled={isSubmitting}
                      />
                    </label>
                    <label className="block">
                      <span className="block text-sm font-medium mb-2">Téléphone</span>
                      <Input
                        type="tel"
                        name="telephone"
                        placeholder="Ex: +221 77 123 45 67"
                        disabled={isSubmitting}
                      />
                    </label>
                  </div>
                </div>

                <label className="block">
                  <span className="block text-sm font-medium mb-2">Adresse</span>
                  <Input
                    type="text"
                    name="adresse"
                    placeholder="Ex: Pikine, Dakar"
                    disabled={isSubmitting}
                  />
                </label>
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

      <div className="flex items-center justify-center space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
        </Button>

        {Array.from({ length: table.getPageCount() }, (_, i) => (
          <Button
            key={i}
            variant={i === table.getState().pagination.pageIndex ? "default" : "outline"}
            size="sm"
            onClick={() => table.setPageIndex(i)}
            className={cn({
              "bg-[#0A3282]/90 hover:bg-[#0A3282]/90 text-white": table.getState().pagination.pageIndex === i,
            })}
          >
            {i + 1}
          </Button>
        ))}

        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
      
    </div>
  )
}