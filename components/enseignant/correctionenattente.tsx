import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

type Correction = {
  id: number
  title: string
  course: string
  submitted: number
  dueDate: string
  status?: "late" | "today" | "normal"
}

const corrections: Correction[] = [
  {
    id: 1,
    title: "Proposition Projet Final",
    course: "Algo Avancé",
    submitted: 6,
    dueDate: "23 Oct",
    status: "late",
  },
  {
    id: 2,
    title: "Révision Examen Mi-semestre",
    course: "Arch. Log.",
    submitted: 3,
    dueDate: "Aujourd’hui",
    status: "today",
  },
  {
    id: 3,
    title: "Doc de Conception Système",
    course: "Arch. Log.",
    submitted: 1,
    dueDate: "26 Oct",
    status: "normal",
  },
]

export function CorrectionsEnAttente() {
  return (
    <Card>

      <CardContent className="p-0">
        <table className="w-full text-sm">
          <thead className="border-b text-muted-foreground">
            <tr>
              <th className="px-4 py-3 text-left">Nom du devoir</th>
              <th className="px-4 py-3 text-left">Cours</th>
              <th className="px-4 py-3 text-left">Remis</th>
              <th className="px-4 py-3 text-left">Échéance</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>

          <tbody>
            {corrections.map((item) => (
              <tr
                key={item.id}
                className="border-b last:border-0 hover:bg-muted/50 transition"
              >
                {/* Nom */}
                <td className="px-4 py-4 font-medium">
                  {item.title}
                </td>

                {/* Cours */}
                <td className="px-4 py-4 text-muted-foreground">
                  {item.course}
                </td>

                {/* Remis */}
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src="/avatar.png" />
                      <AvatarFallback>ET</AvatarFallback>
                    </Avatar>
                    {item.submitted > 1 && (
                      <span className="text-xs text-muted-foreground">
                        +{item.submitted - 1}
                      </span>
                    )}
                  </div>
                </td>

                {/* Échéance */}
                <td className="px-4 py-4">
                  <span
                    className={
                      item.status === "late"
                        ? "text-red-500"
                        : item.status === "today"
                        ? "text-orange-500"
                        : "text-muted-foreground"
                    }
                  >
                    {item.dueDate}
                    {item.status === "late" && " (en retard)"}
                  </span>
                </td>

                {/* Action */}
                <td className="px-4 py-4 text-right">
                  <Button variant="link" className="px-0">
                    Noter
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="p-4 text-center text-sm text-muted-foreground hover:underline cursor-pointer">
          Voir les 12 éléments en attente
        </div>
      </CardContent>
    </Card>
  )
}