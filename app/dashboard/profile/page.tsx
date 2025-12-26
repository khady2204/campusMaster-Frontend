/* eslint-disable react/no-unescaped-entities */
'use client'

import { useAuth } from "@/hooks/use-auth"

export default function ProfilePage() {
  const { user } = useAuth()

  if (!user) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-4">Profil</h1>
        <p>Utilisateur non connecté.</p>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Profil</h1>
      <div className="space-y-2">
        <p><span className="font-medium">Nom complet :</span> {user.prenom} {user.nom}</p>
        <p><span className="font-medium">Nom d'utilisateur :</span> {user.username}</p>
        <p><span className="font-medium">Email :</span> {user.email}</p>
        <p><span className="font-medium">Téléphone :</span> {user.telephone}</p>
        <p><span className="font-medium">Adresse :</span> {user.adresse}</p>
        <p><span className="font-medium">Rôle :</span> {user.role}</p>
      </div>
    </div>
  )
}

