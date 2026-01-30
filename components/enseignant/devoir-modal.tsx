import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface DevoirModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DevoirModal({
  open,
  onOpenChange,
}: DevoirModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Créer un devoir</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <Input placeholder="Titre du devoir" />
          <Input type="date" />
          <Button className="w-full">Créer</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}