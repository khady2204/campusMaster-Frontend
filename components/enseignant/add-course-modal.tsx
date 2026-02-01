"use client"
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Textarea } from "../ui/textarea";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import type { Module } from "@/core/model/cours/module";
import type { Semestre } from "@/core/model/cours/semestre";

interface AddCourseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  modules: Module[];
  semestres: Semestre[];
  handleAddCours: (event: React.FormEvent<HTMLFormElement>) => void;
  isSubmitting: boolean;
}

export function AddCourseModal({
  open,
  onOpenChange,
  modules= [],
  semestres= [] ,
  handleAddCours,
  isSubmitting,
}: AddCourseModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-[#0A3282] dark:text-white">
            Ajouter un cours
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            Veuillez remplir les informations du cours
          </p>
        </DialogHeader>

        <form onSubmit={handleAddCours}>
          <div className="space-y-4">
            <label className="block">
              <span className="block text-sm font-medium mb-2">
                Titre <span className="text-red-500">*</span>
              </span>
              <Input
                type="text"
                name="titre"
                required
                placeholder="Ex: Introduction à JavaScript"
                disabled={isSubmitting}
              />
            </label>

            <label className="block">
              <span className="block text-sm font-medium mb-2">
                Description <span className="text-red-500">*</span>
              </span>
              <Textarea
                name="description"
                required
                placeholder="Description du cours..."
                disabled={isSubmitting}
                rows={4}
              />
            </label>

            <div className="grid md:grid-cols-2 gap-4">
              <label className="block">
                <span className="block text-sm font-medium mb-2">
                  Module <span className="text-red-500">*</span>
                </span>
                <Select name="moduleId" required disabled={isSubmitting}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un module" />
                  </SelectTrigger>
                  <SelectContent>
                    {modules.map((module) => (
                      <SelectItem key={module.id} value={String(module.id)}>
                        {module.titreModule}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </label>

              {/* Semestre */}
              <label className="block">
                <span className="block text-sm font-medium mb-2">
                  Semestre <span className="text-red-500">*</span>
                </span>
                <Select name="semestreId" required disabled={isSubmitting}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner le semestre" />
                  </SelectTrigger>
                  <SelectContent>
                    {semestres.map((semestre) => (
                      <SelectItem key={semestre.id} value={String(semestre.id)}>
                        {semestre.nom}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </label>

            </div>

            {/* Ligne 2 : Durée et Niveau */}
            <div className="grid grid-cols-2 gap-4">

              <label className="block">
                <span className="block text-sm font-medium mb-2">
                  Durée (heures)
                </span>
                <Input
                  type="number"
                  name="duree"
                  min="0"
                  placeholder="Ex: 20"
                  disabled={isSubmitting}
                />
              </label>

              <label className="block">
                <span className="block text-sm font-medium mb-2">Niveau</span>
                <Input
                  type="text"
                  name="niveau"
                  placeholder="Ex: master1"
                  disabled={isSubmitting}
                />
              </label>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <DialogClose asChild>
              <Button
                variant="outline"
                type="button"
                size="sm"
                disabled={isSubmitting}
              >
                Annuler
              </Button>
            </DialogClose>
            <Button
              type="submit"
              size="sm"
              className="bg-[#0A3282] text-white hover:bg-[#0A3282]/80"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}