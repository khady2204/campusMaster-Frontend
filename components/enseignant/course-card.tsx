import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type CourseCardProps = {
  title: string
  students: number
  average: string
}

export function CourseCard({ title, students, average }: CourseCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="text-sm space-y-2">
        <div>{students} étudiants</div>
        <div>Moyenne : {average}</div>
      </CardContent>
    </Card>
  )
}