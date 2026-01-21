'use client'

import { AppSidebar } from "@/components/app-sidebar"
import { NavbarDash } from "@/components/navbar-dash"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { mapUserRole, UserRole } from "@/lib/menu-config"
import { useAuth } from "@/core/hooks/useAuth"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user } = useAuth()
  const userRole = mapUserRole(user?.role) as UserRole | null

  // if (loading) {
  //   return (
  //     <div className="flex h-screen items-center justify-center">
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
  
  return (
    <SidebarProvider>
      <AppSidebar userRole={userRole} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 justify-between border-b px-4 dark:bg-[#090C13]">
          {/* Gauche */}
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="h-4" />
          </div>
          {/* Droite */}
          <NavbarDash />
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4 bg-white dark:bg-[#090C13]">
          {children}
        </div>

      </SidebarInset>
    </SidebarProvider>
  )
}
