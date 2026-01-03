"use client"

import { useMemo } from "react"
import { useRouter } from "next/navigation"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "./ui/modeToggle"
import { useAuth } from "@/core/hooks/useAuth"

export function NavbarDash() {
    const { user, logout } = useAuth()
    const router = useRouter()

    const displayName = useMemo(() => {
        if (!user) return "Utilisateur"
        if (user.prenom || user.nom) {
            return `${user.prenom ?? ""} ${user.nom ?? ""}`.trim()
        }
        return user.username ?? "Utilisateur"
    }, [user])

    const email = user?.email ?? ""

    const initials = useMemo(() => {
        if (!displayName) return "U"
        return displayName
            .split(" ")
            .filter(Boolean)
            .map((n) => n[0])
            .join("")
            .toUpperCase()
    }, [displayName])

    const handleProfileClick = () => {
        router.push("/dashboard/profile")
    }

    const handleLogoutClick = async () => {
        await logout()
        router.push("/auth/login")
    }

    return (
        <div className="flex items-center gap-4">
            <ModeToggle />
            {/* Bouton Notifications */}
            <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-600" />
            </Button>

            {/* Dropdown User */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                        <Avatar className="h-10 w-10">
                            {/* <AvatarImage src={user.avatar} alt={user.name} /> */}
                            <AvatarFallback>{initials}</AvatarFallback>
                        </Avatar>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">{displayName}</p>
                            <p className="text-xs leading-none text-muted-foreground">
                                {email}
                            </p>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleProfileClick}>
                        Profil
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        Paramètres
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        Facturation
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600" onClick={handleLogoutClick}>
                        Se déconnecter
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}
