"use client"
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Textarea } from "../ui/textarea";
import { useState } from "react";

interface AddCourseModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  moduleId: number 
}

 export function AddCourseModal({ open, onOpenChange }: AddCourseModalProps) {
  const [file, setFile] = useState<File | null>(null);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter un cours</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <Input placeholder="Nom du cours" />
          <Textarea placeholder="Description" />
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full border rounded p-2"
          />
          {file && (
            <p className="text-sm text-gray-600">
              Fichier : {file.name}
            </p>
          )}
          <Button className="w-full bg-blue-900 hover:bg-blue-800 text-white">Enregistrer</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}