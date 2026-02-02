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
import { semestreService } from "@/core/services/semestre.service"
import { Semestre } from "@/core/model/cours/semestre"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

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

  const handleAddSemestre = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    
    const formData = new FormData(event.currentTarget)
    
    const newSemestre: Semestre = {
      nom: formData.get("nom") as string,
      description: formData.get("description") as string,
      annee: formData.get("annee") as string,
      createdBy: formData.get("createdBy") as string,
    }

    

    try {
      await semestreService.createSemestre(newSemestre);
      showToast("success", { message: "Semestre ajouté avec succès" });
      
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
      showToast("error", { message: "Erreur lors de l'ajout du semestre" });
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
            value={(table.getColumn("nom")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("nom")?.setFilterValue(event.target.value)
            }
            className="min-w-md"
          />
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="flex items-center gap-1 bg-[#0A3282] text-white h-10 hover:bg-[#0A3282]/90">
              <Plus className="mr-1" />
              Ajouter un semestre
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-[#0A3282] dark:text-white">
                Ajouter un semestre
              </DialogTitle>
              <DialogDescription>
                Veuillez remplir les informations du semestre
              </DialogDescription>
            </DialogHeader>
            
            <form ref={formRef} onSubmit={handleAddSemestre} className="space-y-4">
              <div className="">
                <label className="block">
                  <span className="block text-sm font-medium mb-2">Nom du semestre</span>
                  <Input
                    type="text"
                    name="nom"
                    required
                    placeholder="Ex: Semestre 1"
                    disabled={isSubmitting}
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
                    disabled={isSubmitting}
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
                        const yearString = `${year}-${year + 1}`;
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













// "use client"

// import {
//   ColumnDef,
//   flexRender,
//   getCoreRowModel,
//   useReactTable,
// } from "@tanstack/react-table"

// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table"

// interface DataTableProps<TData, TValue> {
//   columns: ColumnDef<TData, TValue>[]
//   data: TData[]
// }

// export function DataTable<TData, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
//   // eslint-disable-next-line react-hooks/incompatible-library
//   const table = useReactTable({
//     data,
//     columns,
//     getCoreRowModel: getCoreRowModel(),
//   })

//   return (
//     <div className="overflow-hidden border rounded-0">
//       <Table>
//         <TableHeader className="bg-gray-50 dark:bg-black">
//           {table.getHeaderGroups().map((headerGroup) => (
//             <TableRow key={headerGroup.id}>
//               {headerGroup.headers.map((header) => (
//                 <TableHead key={header.id}>
//                   {header.isPlaceholder
//                     ? null
//                     : flexRender(header.column.columnDef.header, header.getContext())}
//                 </TableHead>
//               ))}
//             </TableRow>
//           ))}
//         </TableHeader>
//         <TableBody>
//           {table.getRowModel().rows?.length ? (
//             table.getRowModel().rows.map((row) => (
//               <TableRow key={row.id}>
//                 {row.getVisibleCells().map((cell) => (
//                   <TableCell key={cell.id}>
//                     {flexRender(cell.column.columnDef.cell, cell.getContext())}
//                   </TableCell>
//                 ))}
//               </TableRow>
//             ))
//           ) : (
//             <TableRow>
//               <TableCell colSpan={columns.length} className="h-24 text-center">
//                 Aucun résultat.
//               </TableCell>
//             </TableRow>
//           )}
//         </TableBody>
//       </Table>
//     </div>
//   )
// }