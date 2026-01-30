import { Button } from "../ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"

interface AnnonceModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AnnonceModal({
  open,
  onOpenChange,
}: AnnonceModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nouvelle annonce</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <Input placeholder="Titre de l’annonce" />
          <Textarea placeholder="Message de l’annonce" />
          <Button className="w-full">Publier</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
