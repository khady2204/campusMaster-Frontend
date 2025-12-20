'use client'

import { AppSidebar } from "@/components/app-sidebar"
import { NavbarDash } from "@/components/navbar-dash"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { UserRole } from "@/lib/menu-config"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {

  // Rôle de l'utilisateur
  const userRole: UserRole = "admin" // ou "admin" ou "enseignant"
  
  return (
    <SidebarProvider>
      <AppSidebar userRole={userRole} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 justify-between border-b px-4">
          {/* Gauche */}
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="h-4" />
          </div>

          {/* Droite */}
          <NavbarDash />
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}