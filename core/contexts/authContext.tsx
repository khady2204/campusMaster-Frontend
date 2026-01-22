"use client"

import React, { createContext, useEffect, useState, useContext } from 'react'
import { authService } from '@/core/services/auth.service'
import { User } from '@/core/model/user/user.model'
import { Loader2 } from 'lucide-react'

// Définition de la forme du contexte
interface AuthContextType {
  user: User | null
  isLoggedIn: boolean
  login: (email: string, password: string) => Promise<User>
  logout: () => Promise<void>
}

// **Exporter AuthContext**
export const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Provider simple
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const init = async () => {
      try {
        const currentUser = await authService.me()
        setUser(currentUser)
      } catch {
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [])

  const login = async (email: string, password: string) => {
    await authService.login({ email, password })
    // On récupère l'utilisateur courant via /auth/me (cookie envoyé automatiquement)
    const currentUser = await authService.me()
    setUser(currentUser)
    return currentUser
  }

  const logout = async () => {
    try {
      await authService.logout()
    } catch (error) {
      console.error("Erreur lors de la déconnexion API:", error)
    } finally {
      setUser(null)
    }
  }

  const value: AuthContextType = {
    user,
    isLoggedIn: !!user,
    login,
    logout,
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-40 w-40 animate-spin text-muted-foreground" />
      </div>

    )
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Hook pour accéder au contexte
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth doit être utilisé dans AuthProvider')
  return context
}
