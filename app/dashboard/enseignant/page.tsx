import { QuickAction } from "@/components/enseignant/quick-action"
import { CourseCard } from "@/components/enseignant/course-card"
import { Badge } from "@/components/ui/badge"
import { CorrectionsEnAttente } from "@/components/enseignant/correctionenattente";
import { PlusIcon } from "@heroicons/react/16/solid";
import { SpeakerWaveIcon } from "@heroicons/react/20/solid";


export default function page() {
  return (
    <main className="flex-1 p-6 bg-background">
      
      {/* CONTENU PRINCIPAL */}
      <div className="space-y-8">

        {/* ACTIONS RAPIDES */}
        <div>
          <h2 className="mb-3 text-lg font-semibold">Actions Rapides</h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <QuickAction title="Créer un devoir" 
            description="Configurer une nouvelle tâche" 
            Icon={PlusIcon}/>
            <QuickAction title="Faire une annonce" 
            description="Notifier tous les étudiants"
            Icon={SpeakerWaveIcon}/>
            <QuickAction title="Ajouter un cours"
            description="Notifier tous les étudiants"
            Icon={PlusIcon} />
          </div>
        </div>

        {/*  ZONE 2 COLONNES : CONTENU + SIDEBAR */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">

          {/* COLONNE GAUCHE (2/3) */}
          <div className="lg:col-span-2 space-y-8">

            {/* COURS ACTIFS */}
            <div>
              <h2 className="mb-3 text-lg font-semibold">Cours Actifs</h2>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <CourseCard
                  title="Algorithmes Avancés"
                  students={32}
                  average="14.5 / 20"
                />
                <CourseCard
                  title="Architecture Logicielle"
                  students={45}
                  average="13.2 / 20"
                />
                <CourseCard
                  title="Architecture Logicielle"
                  students={45}
                  average="13.2 / 20"
                />
              </div>
            </div>

            {/* CORRECTIONS  */}
            <div>
              <div>
              <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold justify-between">
                Corrections en attente
                <Badge variant="destructive">Priorité Haute</Badge>
              </h2></div>

              <CorrectionsEnAttente />
            </div>
          </div>


        </div>
      </div>
    </main>
  );
}
