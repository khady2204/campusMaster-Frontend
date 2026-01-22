
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

type QuickActionProps = {
  title: string
  description: string
  Icon: React.ElementType

}

export function QuickAction({ title, description, Icon}: QuickActionProps ) {
  return (
    <Card className=" relative hover:bg-muted/40 transition cursor-pointer ">
      <Button size="icon" variant="ghost">
        <Icon className="h-4 w-4" />
      </Button>
      <CardHeader>
        <CardTitle className="text-sm">{title}</CardTitle>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardHeader>
    </Card>
  )
}