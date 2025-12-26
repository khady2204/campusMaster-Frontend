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
import { useAuth } from "@/hooks/use-auth"

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  userRole: UserRole
}

export function AppSidebar({ userRole, ...props }: AppSidebarProps) {
  const { state } = useSidebar()
  const { user, logout } = useAuth()

  const menuData = menuConfig[userRole]

  const displayName = (() => {
    if (!user) return "Utilisateur"
    if (user.prenom || user.nom) {
      return `${user.prenom ?? ""} ${user.nom ?? ""}`.trim()
    }
    return user.username ?? "Utilisateur"
  })()

  const email = user?.email ?? ""

  const userData = {
    name: displayName,
    email,
    avatar: "/avatars/user.jpg",
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
        <NavUser user={userData} onLogout={logout} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
