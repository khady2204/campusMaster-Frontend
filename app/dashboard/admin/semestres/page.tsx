"use client"
import { DataTable } from "./data-table";
import { createColumns } from "./columns";
import { semestreService } from "@/core/services/semestre.service";
import { useEffect, useState } from "react";
import { Semestre } from "@/core/model/cours/semestre";

export default function SemestresPage() {
  
  const [ListSemestres, setSemestres] = useState<Semestre[]>([]);
  const [isLoading, setIsLoading] = useState(true);

   // 
  const fetchSemestres = async () => {
    setIsLoading(true)
    try {
      const semestres = await semestreService.getSemestres()

      setSemestres(semestres)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  // 
  useEffect(() => {
    (async () => {
      await fetchSemestres()
    })()
  }, [])

  const columns = createColumns(fetchSemestres);

  return (
    <div className="container mx-auto space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-[#0A3282]/80">Liste des semestres de la plateforme</h1>
        <p className="text-sm text-muted-foreground">
          Gestion des semestres de la plateforme.
        </p>
      </div>

      <DataTable columns={columns} data={ListSemestres} onRefresh={fetchSemestres} isLoading={isLoading} />
    </div>
  )

}




// import { semestreService } from "@/core/services/semestre.service";
// import { DataTable } from "./data-table";
// import { columns } from "./columns";

// export default async function SemestresPage() {

//   const semestresData = await semestreService.getSemestres()
//   const semestres = JSON.parse(JSON.stringify(semestresData))

//   return (
//     <div className="container mx-auto space-y-8">
//       <div>
//         <h1 className="text-2xl font-semibold">Semestres</h1>
//         <p className="text-sm text-muted-foreground">
//           Gestion des semestres de la plateforme.
//         </p>
//       </div>
//       <DataTable columns={columns} data={semestres} />
//     </div>
//   )

// }