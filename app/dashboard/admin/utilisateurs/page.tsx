"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { mapUserRole } from "@/lib/menu-config";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Pie,
  PieChart,
  Cell,
} from "recharts";
import { getusersApi } from "@/core/api/user.api";

// Structure des statistiques calculées à partir de la liste des utilisateurs
type UserStats = {
  total: number;
  etudiants: number;
  enseignants: number;
  administrateurs: number;
  actifs: number;
  inactifs: number;
};

// Valeurs initiales avant le chargement réel depuis l'API
const initialStats: UserStats = {
  total: 0,
  etudiants: 0,
  enseignants: 0,
  administrateurs: 0,
  actifs: 0,
  inactifs: 0,
};

// Configuration des graphiques
const roleChartConfig: ChartConfig = {
  etudiants: {
    label: "Étudiants",
    color: "hsl(var(--chart-1))",
  },
  enseignants: {
    label: "Enseignants",
    color: "hsl(var(--chart-2))",
  },
  administrateurs: {
    label: "Administrateurs",
    color: "hsl(var(--chart-3))",
  },
};

const statusChartConfig: ChartConfig = {
  actifs: {
    label: "Actifs",
    color: "hsl(var(--chart-4))",
  },
  inactifs: {
    label: "Inactifs",
    color: "hsl(var(--chart-5))",
  },
};

export default function Utilisateurs() {

  // Contient les statistiques calculées
  const [stats, setStats] = useState<UserStats>(initialStats);
  // Indique si on est en cours de chargement
  const [loading, setLoading] = useState(true);
  // Message d'erreur éventuel lors de l'appel API
  const [error, setError] = useState<string | null>(null);

  // Données des graphiques
  const roleData = [
    {
      roleKey: "etudiants",
      role: "Étudiants",
      value: stats.etudiants,
    },
    {
      roleKey: "enseignants",
      role: "Enseignants",
      value: stats.enseignants,
    },
    {
      roleKey: "administrateurs",
      role: "Administrateurs",
      value: stats.administrateurs,
    },
  ];

  // Données des graphiques
  const statusData = [
    {
      statusKey: "actifs",
      status: "Actifs",
      value: stats.actifs,
    },
    {
      statusKey: "inactifs",
      status: "Inactifs",
      value: stats.inactifs,
    },
  ];

  useEffect(() => {
    // Fonction qui récupère la liste des utilisateurs et calcule les stats
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);

        // Appel GET /api/users via apiClient
        const users = await getusersApi();

        // On repart de zéro pour recalculer les compteurs
        const nextStats: UserStats = { ...initialStats };
        nextStats.total = users.length;

        // Parcours de tous les utilisateurs pour alimenter les statistiques
        for (const user of users) {
          // Normalisation du rôle avec mapUserRole pour gérer admin/Administrateur/etc.
          const mappedRole = mapUserRole(user.role);
          if (mappedRole === "Etudiant") {
            nextStats.etudiants += 1;
          } else if (mappedRole === "Enseignant") {
            nextStats.enseignants += 1;
          } else if (mappedRole === "Administrateur") {
            nextStats.administrateurs += 1;
          }

          // Comptage des comptes actifs / inactifs
          if (user.isActive) {
            nextStats.actifs += 1;
          } else {
            nextStats.inactifs += 1;
          }
        }

        // Mise à jour de l'état avec les nouvelles stats
        setStats(nextStats);
      } catch (e) {
        // Gestion d'erreur simple avec un message lisible
        const message =
          e instanceof Error
            ? e.message
            : "Impossible de charger les statistiques";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    // On déclenche le chargement au montage du composant
    fetchStats();
  }, []);

  return (
    <div className="space-y-4">

      {/* Indicateur de chargement */}
      {loading && (
        <p className="text-sm text-muted-foreground">
          Chargement des statistiques...
        </p>
      )}

      {/* Affichage d'une erreur éventuelle */}
      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Répartition par rôle avec liens vers les pages détaillées */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-transparent dark:bg-[#090C13]/10 p-3">
          <CardHeader className="p-0 mb-0">
            <CardTitle className="text-[#0A3282] dark:text-gray-100">Utilisateurs</CardTitle>
            <CardDescription className="text-xs">
              Tous les comptes créés sur CampusMaster.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-between p-0">
            <p className="text-2xl font-semibold">{stats.total}</p>
          </CardContent>
        </Card>

        <Card className="bg-transparent dark:bg-[#090C13]/10 p-3">
          <CardHeader className="p-0 mb-0">
            <CardTitle className="text-[#0A3282] dark:text-gray-100">Étudiants</CardTitle>
            <CardDescription className="text-xs">
              Nombre total d&apos;étudiants inscrits.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-between p-0">
            <p className="text-2xl font-semibold">{stats.etudiants}</p>
            <Link href="/dashboard/admin/utilisateurs/etudiants">
              <Button size="sm" className="bg-[#0A3282] dark:bg-white">Voir</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="bg-transparent dark:bg-[#090C13]/10 p-3">
          <CardHeader className="p-0 mb-0">
            <CardTitle className="text-[#0A3282] dark:text-gray-100">Enseignants</CardTitle>
            <CardDescription className="text-xs">
              Nombre total d&apos;enseignants.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-between p-0">
            <p className="text-2xl font-semibold">{stats.enseignants}</p>
            <Link href="/dashboard/admin/utilisateurs/enseignants">
              <Button size="sm" className="bg-[#0A3282] dark:bg-white">Voir</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="bg-transparent dark:bg-[#090C13]/10 p-3">
          <CardHeader className="p-0 mb-0">
            <CardTitle className="text-[#0A3282] dark:text-gray-100">Administrateurs</CardTitle>
            <CardDescription className="text-xs">
              Nombre total d&apos;administrateurs.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-between p-0">
            <p className="text-2xl font-semibold">
              {stats.administrateurs}
            </p>
            <Link href="/dashboard/admin/utilisateurs/admins">
              <Button size="sm" className="bg-[#0A3282] dark:bg-white">Voir</Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Affichage des cartes uniquement si pas de chargement ni d'erreur */}
      {!loading && !error && (
        <>

          <div className="grid gap-x-4 md:grid-cols-2">
            <Card className="bg-transparent dark:bg-[#090C13]/10">
              <CardHeader className="pb-0">
                <CardTitle className="text-[#0A3282] dark:text-gray-100">Répartition par rôle</CardTitle>
                <CardDescription>
                  Nombre d&apos;utilisateurs par type de profil.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={roleChartConfig} className="p-0">
                  <BarChart data={roleData} className="w-full">
                    <CartesianGrid vertical={false} strokeDasharray="3 3" className="p-0" />
                    <XAxis dataKey="role" tickLine={false} axisLine={false} padding={{ right: 0 }} />
                    <YAxis allowDecimals={false} />
                    <ChartTooltip
                      cursor={{ fill: "transparent" }}
                      content={
                        <ChartTooltipContent
                          labelKey="roleKey"
                          nameKey="roleKey"
                        />
                      }
                    />
                    <ChartLegend
                      verticalAlign="bottom"
                      content={<ChartLegendContent nameKey="roleKey" />}
                    />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                      {roleData.map((entry) => (
                        <Cell
                          key={entry.roleKey}
                          // fill={`var(--color-${entry.roleKey})`}
                          fill="#0A3282"
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card className="bg-transparent dark:bg-[#090C13]/10">
              <CardHeader>
                <CardTitle className="text-[#0A3282] dark:text-gray-100">Actifs vs inactifs</CardTitle>
                <CardDescription>État des comptes utilisateurs.</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={statusChartConfig}>
                  <PieChart className="">
                    <ChartTooltip
                      cursor={{ fill: "transparent" }}
                      content={
                        <ChartTooltipContent
                          labelKey="statusKey"
                          nameKey="statusKey"
                        />
                      }
                    />
                    <ChartLegend
                      verticalAlign="bottom"
                      content={<ChartLegendContent nameKey="statusKey" />}
                    />
                    <Pie
                      data={statusData}
                      dataKey="value"
                      nameKey="status"
                      innerRadius={70}
                      outerRadius={100}
                      paddingAngle={4}
                      strokeWidth={0}
                      fill="#0A3282"
                    >
                      {statusData.map((entry) => (
                        <Cell
                          key={entry.statusKey}
                          fill="#0A3282"
                        />
                      ))}
                    </Pie>
                  </PieChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>


        </>
      )}
    </div>
  );
}
