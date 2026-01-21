import { semestreService } from "@/core/services/semestre.service";
import { DataTable } from "./data-table";
import { columns } from "./columns";

export default async function SemestresPage() {

  const semestresData = await semestreService.getSemestres()
  const semestres = JSON.parse(JSON.stringify(semestresData))

  return (
    <div className="container mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Semestres</h1>
        <p className="text-sm text-muted-foreground">
          Gestion des semestres de la plateforme.
        </p>
      </div>
      <DataTable columns={columns} data={semestres} />
    </div>
  )

}