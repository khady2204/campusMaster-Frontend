'use client'

import { UserRole } from "@/lib/menu-config"
import { AdminDashboard } from "@/components/dashboards/admin-dashboard"
import { EnseignantDashboard } from "@/components/dashboards/enseignant-dashboard"
import { EtudiantDashboard } from "@/components/dashboards/etudiant-dashboard"
import { mapUserRole } from "@/lib/menu-config"
import { useAuth } from "@/core/hooks/useAuth"

export default function DashboardPage() {
  const { user } = useAuth()
  const userRole = mapUserRole(user?.role) as UserRole | null

  // if (loading) {
  //   return (
  //     <div className="p-6">
  //       <p>Chargement du tableau de bord...</p>
  //     </div>
  //   )
  // }

  if (!userRole) {
    return (
      <div className="p-6">
        <p>Erreur : rôle utilisateur non reconnu</p>
      </div>
    )
  }

  if (userRole === "Administrateur") {
    return <AdminDashboard />
  }
  
  if (userRole === "Enseignant") {
    return <EnseignantDashboard />
  }
  
  if (userRole === "Etudiant") {
    return <EtudiantDashboard />
  }
  
  return (
    <div className="p-6">
      <p>Erreur : rôle utilisateur non reconnu</p>
    </div>
  )
}
