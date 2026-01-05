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
  BookmarkIcon,
} from "lucide-react"

export type UserRole = "Administrateur" | "Etudiant" | "Enseignant"

export function mapUserRole(rawRole?: string | null): UserRole | null {
  
  if (!rawRole) return null
  const role = rawRole.toLowerCase()
  
  switch (role) {
    case "administrateur":
    case "admin":
      return "Administrateur"
    case "etudiant":
    case "student":
      return "Etudiant"
    case "enseignant":
    case "professeur":
    case "teacher":
      return "Enseignant"
    default:
      return null
  }
  
}

export const menuConfig = {
  Administrateur: {
    navMain: [
      {
        title: "Tableau de bord",
        url: "/dashboard/admin", 
        icon: LayoutDashboard,
        isActive: true,
      },
      {
        title: "Utilisateurs",
        url: "/dashboard/admin/utilisateurs",
        icon: Users,
        items: [
          {
            title: "Étudiants",
            url: "/dashboard/admin/utilisateurs/etudiants",
          },
          {
            title: "Enseignants",
            url: "/dashboard/admin/utilisateurs/enseignants",
          },
          {
            title: "Administrateurs",
            url: "/dashboard/admin/utilisateurs/admins",
          },
        ],
      },
      {
        title: "Modules",
        url: "/dashboard/admin/modules",
        icon: BookmarkIcon,
        items: [
          {
            title: "Liste des modules",
            url: "/dashboard/admin/modules",
          },
          {
            title: "Créer un module",
            url: "/dashboard/admin/modules/create",
          },
        ],
      },
      {
        title: "Cours",
        url: "/dashboard/admin/cours",
        icon: BookOpen,
        items: [
          {
            title: "Liste des cours",
            url: "/dashboard/admin/cours",
          },
          {
            title: "Créer un cours",
            url: "/dashboard/admin/cours/create",
          },
        ],
      },
      {
        title: "Statistiques",
        url: "/dashboard/admin/statistiques",
        icon: BarChart,
      },
      {
        title: "Paramètres",
        url: "/dashboard/parametres",
        icon: Settings,
      },
    ],
  },
  Enseignant: {
    navMain: [
      {
        title: "Tableau de bord",
        url: "/dashboard/enseignant",
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
  Etudiant: {
    navMain: [
      {
        title: "Tableau de bord",
        url: "/dashboard/etudiant",
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
