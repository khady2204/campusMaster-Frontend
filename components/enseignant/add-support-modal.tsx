"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { showToast } from "@/core/services/toast.service";
import { Support } from "@/core/model/cours/support";
import { Cours } from "@/core/model/cours/cours";

interface AddSupportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cours: Cours[];
  isSubmitting: boolean;
  handleAddSupport: (support: Support) => Promise<void>;
}

export function AddSupportModal({ open, onOpenChange, cours, isSubmitting, handleAddSupport }: AddSupportModalProps) {
  const [selectedCoursId, setSelectedCoursId] = useState<string>("");
  const [nom, setNom] = useState("");
  const [url, setUrl] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedCoursId || !nom || !url) return;

    try {
      const newSupport: Support = {
        id: "", // généré par la base
        nom,
        url,
        coursId: selectedCoursId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      await handleAddSupport(newSupport);
      showToast("success", { message: "Support ajouté avec succès" });
      onOpenChange(false);
      setNom("");
      setUrl("");
      setSelectedCoursId("");
    } catch (error) {
      console.error(error);
      showToast("error", { message: "Erreur lors de l'ajout du support" });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Ajouter un support</DialogTitle>
          <DialogDescription>Ajoutez un fichier ou lien pour un cours existant</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="text-sm font-medium mb-1">Cours</span>
            <select
              className="w-full border rounded p-2"
              value={selectedCoursId}
              onChange={(e) => setSelectedCoursId(e.target.value)}
              required
            >
              <option value="">Sélectionnez un cours</option>
              {cours.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.titreCours}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-medium mb-1">Nom du support</span>
            <Input
              type="text"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              required
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium mb-1">URL / Fichier</span>
            <Input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://..."
              required
            />
          </label>

          <div className="flex justify-end gap-2 mt-4">
            <DialogClose asChild>
              <Button variant="outline"
                type="button"
                size="sm" disabled={isSubmitting}>Annuler</Button>
            </DialogClose>
            <Button type="submit" 
              size="sm"
              className="bg-[#0A3282] text-white hover:bg-[#0A3282]/80"
              disabled={isSubmitting}>
              {isSubmitting ? "Ajout en cours..." : "Ajouter"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}