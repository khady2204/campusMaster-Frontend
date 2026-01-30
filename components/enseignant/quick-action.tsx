
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

type QuickActionProps = {
  title: string
  description: string
  Icon: React.ElementType
  onClick?: () => void

}

export function QuickAction({ title, description, Icon, onClick
}: QuickActionProps ) {
  return (
    <Card onClick={onClick}
    className=" relative hover:bg-muted/40 transition cursor-pointer ">
      <CardHeader className="p-3">
        <div className="flex items-center justify-between">
          
          <div className="space-y-0.1">
            <CardTitle className="text-sm leading-tight">
              {title}
            </CardTitle>
            <p className="text-xs leading-tight text-muted-foreground">
              {description}
            </p>
          </div>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 shrink-0 bg-[#0A3282] text-white dark:bg-gray-700 p-2 rounded"
            onClick={onClick}
          >
            <Icon className="h-4 w-4" />
          </Button> 

        </div>
      </CardHeader>
    </Card>
  )
}