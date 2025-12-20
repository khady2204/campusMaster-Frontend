'use client'

import { UserRole } from "@/lib/menu-config"
import { AdminDashboard } from "@/components/dashboards/admin-dashboard"
import { EnseignantDashboard } from "@/components/dashboards/enseignant-dashboard"
import { EtudiantDashboard } from "@/components/dashboards/etudiant-dashboard"

export default function DashboardPage() {
  
  // Récupère le vrai rôle depuis ton auth
  const userRole: UserRole = "admin"
  
  // Affiche le dashboard selon le rôle
  if (userRole === "admin") {
    return <AdminDashboard />
  }
  
  if (userRole === "enseignant") {
    return <EnseignantDashboard />
  }
  
  if (userRole === "etudiant") {
    return <EtudiantDashboard />
  }
  
  return (
    <div className="p-6">
      <p>Erreur : rôle utilisateur non reconnu</p>
    </div>
  )
}