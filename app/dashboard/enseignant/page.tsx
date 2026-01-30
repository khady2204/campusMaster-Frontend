"use client"
import { QuickAction } from "@/components/enseignant/quick-action"
import { CourseCard } from "@/components/enseignant/course-card"
import { Badge } from "@/components/ui/badge"
import { CorrectionsEnAttente } from "@/components/enseignant/correctionenattente";
import { PlusIcon } from "@heroicons/react/16/solid";
import { Database, Megaphone, Package, UserPlus } from "lucide-react";
import { useState } from "react";
import { AddCourseModal } from "@/components/enseignant/add-course-modal"
import { AnnonceModal } from "@/components/enseignant/annonce-modal"
import { DevoirModal } from "@/components/enseignant/devoir-modal"


export default function page() {
  const [openCourse, setOpenCourse] = useState(false)
  const [openAnnonce, setOpenAnnonce] = useState(false)
  const [openDevoir, setOpenDevoir] = useState(false)
  return (
    <main className="flex-1 p-6 bg-background">
      <div className="space-y-8">
        {/* ACTIONS RAPIDES */}
        <div>
          <h2 className="mb-3 text-lg font-semibold">Actions Rapides</h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 ">
            <QuickAction title="Créer un devoir" 
            description="Configurer une nouvelle tâche" 
            Icon={PlusIcon}
            onClick={() => setOpenDevoir(true)}
            />
            <QuickAction title="Faire une annonce" 
            description="Notifier tous les étudiants"
            Icon={Megaphone}
            onClick={() => setOpenAnnonce(true)}/>
            <QuickAction title="Ajouter un cours"
            description="Notifier tous les étudiants"
            Icon={PlusIcon} 
            onClick={() => setOpenCourse(true)}/>
            
          </div>

             {/* MODALS */}
            <AddCourseModal open={openCourse} onOpenChange={setOpenCourse} />
            <AnnonceModal open={openAnnonce} onOpenChange={setOpenAnnonce} />
            <DevoirModal open={openDevoir} onOpenChange={setOpenDevoir} />

        </div>
        
        <div className="">
                <div className="grid md:grid-cols-12 lg:grid-cols-12 gap-4">
                  <CorrectionsEnAttente />

                  <div className="card h-96 shadow border rounded-2xl col-span-4 p-5 space-y-5">
                    <h2 className="font-semibold">Cours actifs</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
                      <CourseCard
                        title="Projet Opérationnel"
                        description=""
                        image="/images/cours-banner.jpg"
                      />
                      <CourseCard
                        title="Tech Web"
                        description=""
                        image="/images/cours-banner.jpg"
                      />
                      <CourseCard
                        title="Algo Avancée"
                        description=""
                        image="/images/cours-banner.jpg"
                      />
                      <CourseCard
                        title="Base de données"
                        description=""
                        image="/images/cours-banner.jpg"
                      />
                    </div>
                  </div>
                </div>
            </div>

      </div>
    </main>
    
  );

}
