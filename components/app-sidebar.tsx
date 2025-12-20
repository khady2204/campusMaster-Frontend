"use client"

import * as React from "react"
import {
  GalleryVerticalEnd,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"
import { menuConfig, UserRole } from "@/lib/menu-config"

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  userRole: UserRole
}

export function AppSidebar({ userRole, ...props }: AppSidebarProps) {
  const { state } = useSidebar()

  // Récupère le menu selon le rôle
  const menuData = menuConfig[userRole]

  // Données utilisateur (à remplacer par tes vraies données)
  const userData = {
    name: "John Doe",
    email: "john@example.com",
    avatar: "/avatars/user.jpg",
    role: userRole,
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-4">
          <GalleryVerticalEnd className="h-6 w-6" />
          {state !== "collapsed" && (
            <span className="font-semibold text-lg">CampusMaster</span>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={menuData.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
