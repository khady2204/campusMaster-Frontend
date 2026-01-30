import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type CourseCardProps = {
  title: string
  description: string
  image: string
  onClick?: () => void

}

export function CourseCard({ title,description, image, onClick  }: CourseCardProps) {
  return (
    <div className="p-3 rounded-2xl space-y-3 h-40 border flex flex-col justify-center items-center text-center hover:bg-muted/40 transition cursor-pointer">
      
      {/* IMAGE */}
      <div className="h-14 w-14 rounded-full overflow-hidden">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover"
        />
      </div>
                                                                                     
      {/* TEXTE */}
      <div className="space-y-1">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs font-extralight text-muted-foreground line-clamp-2">
          {description}
        </p>
      </div>

    </div>
  )
}