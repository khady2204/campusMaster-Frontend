import {
  LayoutDashboard,
  BookOpen,
  Users,
  GraduationCap,
  FileText,
  Calendar,
  Settings,
  BarChart,
  ClipboardList,
  Video,
} from "lucide-react"

export type UserRole = "admin" | "etudiant" | "enseignant"

export const menuConfig = {
  admin: {
    navMain: [
      {
        title: "Tableau de bord",
        url: "/dashboard", 
        icon: LayoutDashboard,
        isActive: true,
      },
      {
        title: "Utilisateurs",
        url: "/dashboard/utilisateurs",
        icon: Users,
        items: [
          {
            title: "Étudiants",
            url: "/dashboard/utilisateurs/etudiants",
          },
          {
            title: "Enseignants",
            url: "/dashboard/utilisateurs/enseignants",
          },
          {
            title: "Administrateurs",
            url: "/dashboard/utilisateurs/admins",
          },
        ],
      },
      {
        title: "Cours",
        url: "/dashboard/cours",
        icon: BookOpen,
        items: [
          {
            title: "Liste des cours",
            url: "/dashboard/cours",
          },
          {
            title: "Créer un cours",
            url: "/dashboard/cours/create",
          },
        ],
      },
      {
        title: "Statistiques",
        url: "/dashboard/statistiques",  // ← Corrigé (enlevé /admin)
        icon: BarChart,
      },
      {
        title: "Paramètres",
        url: "/dashboard/parametres",
        icon: Settings,
      },
    ],
  },
  enseignant: {
    navMain: [
      {
        title: "Tableau de bord",
        url: "/dashboard",  // ← OK
        icon: LayoutDashboard,
        isActive: true,
      },
      {
        title: "Mes cours",
        url: "/dashboard/cours",
        icon: BookOpen,
        items: [
          {
            title: "Liste des cours",
            url: "/dashboard/cours",
          },
          {
            title: "Créer un cours",
            url: "/dashboard/cours/create",
          },
        ],
      },
      {
        title: "Étudiants",
        url: "/dashboard",
        icon: GraduationCap,
      },
      {
        title: "Devoirs",
        url: "/dashboard/devoirs",
        icon: ClipboardList,
        items: [
          {
            title: "Tous les devoirs",
            url: "/dashboard/devoirs",
          },
          {
            title: "Créer un devoir",
            url: "/dashboard/devoirs/create",
          },
          {
            title: "Corrections",
            url: "/dashboard/devoirs/corrections",
          },
        ],
      },
      {
        title: "Planning",
        url: "/dashboard/planning",
        icon: Calendar,
      },
    ],
  },
  etudiant: {
    navMain: [
      {
        title: "Tableau de bord",
        url: "/dashboard/etudiant",  // ← OK
        icon: LayoutDashboard,
        isActive: true,
      },
      {
        title: "Mes cours",
        url: "/dashboard/cours",
        icon: BookOpen,
      },
      {
        title: "Devoirs",
        url: "/dashboard/devoirs",
        icon: ClipboardList,
        items: [
          {
            title: "À faire",
            url: "/dashboard/devoirs/a-faire",
          },
          {
            title: "Rendus",
            url: "/dashboard/devoirs/rendus",
          },
        ],
      },
      {
        title: "Mes notes",
        url: "/dashboard/notes",
        icon: FileText,
      },
      {
        title: "Planning",
        url: "/dashboard/planning",
        icon: Calendar,
      },
      {
        title: "Ressources",
        url: "/dashboard/ressources",
        icon: Video,
      },
    ],
  },
}