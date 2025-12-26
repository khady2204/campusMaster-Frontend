/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo, useState } from "react";
import { apiClient } from "@/lib/api-client";
import { User } from "@/services/auth.service";
import { mapUserRole } from "@/lib/menu-config";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronLeft, ChevronRight, Edit2, Eye, Trash2 } from "lucide-react";

// Clés de tri possibles pour la liste d'enseignants
type SortKey = "nom" | "email" | "createdAt";

// Direction de tri
type SortDirection = "asc" | "desc";

export default function Enseignants() {
  // Liste complète des enseignants (récupérés depuis l'API)
  const [teachers, setTeachers] = useState<User[]>([]);
  // Gestion du chargement initial
  const [loading, setLoading] = useState(true);
  // Message d'erreur éventuel lors des appels API
  const [error, setError] = useState<string | null>(null);
  // Recherche texte (nom, prénom, email, username)
  const [search, setSearch] = useState("");
  // Filtre sur le statut (tous, actifs, inactifs)
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  // Gestion du tri (colonne + direction)
  const [sortKey, setSortKey] = useState<SortKey>("nom");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  // Pagination (page courante et taille de page)
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Chargement des enseignants au montage du composant
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        setLoading(true);
        setError(null);

        // Appel de l'endpoint générique des utilisateurs
        const users = await apiClient.get<User[]>("/users");

        // On ne conserve que les profils ayant le rôle "Enseignant"
        const enseignantsOnly = users.filter(
          (user) => mapUserRole(user.role) === "Enseignant"
        );

        setTeachers(enseignantsOnly);
      } catch (e) {
        const message =
          e instanceof Error
            ? e.message
            : "Impossible de charger les enseignants";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchTeachers();
  }, []);

  // Applique les filtres (recherche + statut) puis le tri
  const filteredAndSortedTeachers = useMemo(() => {
    const term = search.trim().toLowerCase();

    // Filtrage par recherche + statut
    const list = teachers.filter((teacher) => {
      const fullName = `${teacher.prenom ?? ""} ${teacher.nom ?? ""}`.trim();
      const matchesSearch =
        !term ||
        fullName.toLowerCase().includes(term) ||
        (teacher.username ?? "").toLowerCase().includes(term) ||
        (teacher.email ?? "").toLowerCase().includes(term);

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && teacher.active) ||
        (statusFilter === "inactive" && !teacher.active);

      return matchesSearch && matchesStatus;
    });

    // Tri selon la colonne choisie
    const sorted = [...list].sort((a, b) => {
      const getValue = (user: User) => {
        if (sortKey === "nom") {
          return `${user.nom ?? ""} ${user.prenom ?? ""}`.toLowerCase();
        }
        if (sortKey === "email") {
          return (user.email ?? "").toLowerCase();
        }
        if (sortKey === "createdAt") {
          return user.createdAt ?? "";
        }
        return "";
      };

      const aVal = getValue(a);
      const bVal = getValue(b);

      if (aVal < bVal) return -1;
      if (aVal > bVal) return 1;
      return 0;
    });

    if (sortDirection === "desc") {
      sorted.reverse();
    }

    return sorted;
  }, [teachers, search, statusFilter, sortKey, sortDirection]);

  // Calcul des informations de pagination (nb total, nb de pages, etc.)
  const totalItems = filteredAndSortedTeachers.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedTeachers = filteredAndSortedTeachers.slice(startIndex, endIndex);

  // Gestion du changement de tri lorsqu'on clique sur un en-tête de colonne
  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  // Changement de page (précédente / suivante)
  const handleChangePage = (direction: "prev" | "next") => {
    setPage((prev) => {
      if (direction === "prev") {
        return Math.max(1, prev - 1);
      }
      return Math.min(totalPages, prev + 1);
    });
  };

  // Suppression d'un enseignant (à adapter selon ton API si besoin)
  const handleDeleteTeacher = async (teacher: User) => {
    const confirmed = window.confirm(
      `Supprimer définitivement l'enseignant ${teacher.prenom} ${teacher.nom} ?`
    );
    if (!confirmed) return;

    try {
      setError(null);
      // On suppose un endpoint REST classique DELETE /users/{id}
      await apiClient.delete(`/users/${teacher.id}`);
      setTeachers((current) => current.filter((u) => u.id !== teacher.id));
    } catch (e: any) {
      const message =
        e instanceof Error
          ? e.message
          : "Erreur lors de la suppression de l'enseignant";
      setError(message);
    }
  };

  // Soumission du formulaire d'ajout : création réelle via POST /users
  const handleAddTeacher = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const form = event.currentTarget;
    const formData = new FormData(form);

    const prenom = (formData.get("prenom") as string | null)?.trim() || "";
    const nom = (formData.get("nom") as string | null)?.trim() || "";
    const email = (formData.get("email") as string | null)?.trim() || "";
    const username = (formData.get("username") as string | null)?.trim() || "";
    const telephone =
      (formData.get("telephone") as string | null)?.trim() || "";
    const adresse = (formData.get("adresse") as string | null)?.trim() || "";
    const password = (formData.get("password") as string | null)?.trim() || "";

    try {
      // Construction du payload pour la création d'un enseignant.
      // On fixe explicitement le rôle à "enseignant" côté API.
      const payload: Record<string, unknown> = {
        prenom,
        nom,
        email,
        username,
        telephone,
        adresse,
        role: "enseignant",
        active: true,
      };

      // On n'envoie le mot de passe que s'il est renseigné
      if (password) {
        payload.password = password;
      }

      // Appel POST /users qui doit renvoyer l'utilisateur créé
      const created = await apiClient.post<User>("/users", payload);

      // On ajoute localement l'utilisateur créé s'il est bien de rôle Enseignant
      if (mapUserRole(created.role) === "Enseignant") {
        setTeachers((current) => [...current, created]);
      }

      // Réinitialisation du formulaire pour le prochain ajout
      form.reset();
    } catch (e) {
      const message =
        e instanceof Error
          ? e.message
          : "Erreur lors de la création de l'enseignant";
      setError(message);
    }
  };

  // Soumission du formulaire d'édition : mise à jour via PUT /users/{id}
  const handleEditTeacher = (
    event: React.FormEvent<HTMLFormElement>,
    teacher: User
  ) => {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);

    const prenom = (formData.get("prenom") as string | null)?.trim() || "";
    const nom = (formData.get("nom") as string | null)?.trim() || "";
    const email = (formData.get("email") as string | null)?.trim() || "";
    const username = (formData.get("username") as string | null)?.trim() || "";
    const telephone =(formData.get("telephone") as string | null)?.trim() || "";
    const adresse = (formData.get("adresse") as string | null)?.trim() || "";
    const password = (formData.get("password") as string | null)?.trim() || "";
    const active = formData.get("active") !== null;

    const updateTeacher = async () => {
      try {
        // Payload de mise à jour : on modifie les champs principaux
        // et on conserve le rôle/active existants.
        const payload: Record<string, unknown> = {
          prenom,
          nom,
          email,
          username,
          telephone,
          adresse,
          role: teacher.role,
          active,
        };

        // On envoie un nouveau mot de passe uniquement si renseigné
        if (password) {
          payload.password = password;
        }

        // Appel PUT /users/{id} qui doit renvoyer l'utilisateur mis à jour
        const updated = await apiClient.put<User>(
          `/users/${teacher.id}`,
          payload
        );

        // Mise à jour locale de la liste des enseignants
        setTeachers((current) =>
          current.map((t) => (t.id === teacher.id ? updated : t))
        );
      } catch (e) {
        const message =
          e instanceof Error
            ? e.message
            : "Erreur lors de la modification de l'enseignant";
        setError(message);
      }
    };

    void updateTeacher();
  };

  return (
    <div className="space-y-6">
      {/* En-tête de la page : titre + stats simples */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Enseignants</h1>
          <p className="text-sm text-muted-foreground">
            Gestion des comptes enseignants de la plateforme.
          </p>
        </div>

        {/* Dialog d'ajout d'un enseignant */}
        <Dialog>
          <DialogTrigger asChild>
            <Button>+ Ajouter un enseignant</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Ajouter un enseignant</DialogTitle>
              <DialogDescription>
                Renseigne les informations de base de l&apos;enseignant.
              </DialogDescription>
            </DialogHeader>
            <form className="space-y-4" onSubmit={handleAddTeacher}>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="add-prenom">Prénom</Label>
                  <Input id="add-prenom" name="prenom" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="add-nom">Nom</Label>
                  <Input id="add-nom" name="nom" required />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="add-email">Email</Label>
                  <Input
                    id="add-email"
                    name="email"
                    type="email"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="add-username">Username</Label>
                  <Input id="add-username" name="username" required />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="add-telephone">Téléphone</Label>
                  <Input id="add-telephone" name="telephone" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="add-password">Mot de passe</Label>
                  <Input
                    id="add-password"
                    name="password"
                    type="password"
                    required
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="add-adresse">Adresse</Label>
                <Input id="add-adresse" name="adresse" />
              </div>
              <DialogFooter className="mt-4">
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    Annuler
                  </Button>
                </DialogClose>
                <Button type="submit">Enregistrer</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Bloc principal : filtres, tableau, pagination */}
      <Card className="">
        
        <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle>Liste des enseignants</CardTitle>
            <CardDescription>
              Recherche, tri, filtres et actions sur les enseignants.
            </CardDescription>
          </div>

          {/* Filtres rapides : recherche + statut */}
          <div className="flex w-full flex-col gap-3 md:w-auto md:flex-row md:items-center">
            <div className="w-full md:w-64">
              <Label
                htmlFor="search-teachers"
                className="mb-1 block text-xs text-muted-foreground"
              >
                Rechercher (nom, prénom, email, identifiant)
              </Label>
              <Input
                id="search-teachers"
                placeholder="Ex : Dupont, prof@campusmaster.com..."
                value={search}
                onChange={(e) => {
                  setPage(1);
                  setSearch(e.target.value);
                }}
              />
            </div>

            <div className="w-full md:w-40">
              <Label
                htmlFor="status-filter"
                className="mb-1 block text-xs text-muted-foreground"
              >
                Statut
              </Label>
              <select
                id="status-filter"
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-xs outline-none"
                value={statusFilter}
                onChange={(e) => {
                  setPage(1);
                  setStatusFilter(e.target.value as "all" | "active" | "inactive");
                }}
              >
                <option value="all">Tous</option>
                <option value="active">Actifs</option>
                <option value="inactive">Inactifs</option>
              </select>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* États de chargement et d'erreur */}
          {loading && (
            <p className="text-sm text-muted-foreground">
              Chargement des enseignants...
            </p>
          )}

          {error && (
            <div className="rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Tableau paginé des enseignants */}
          {!loading && !error && (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr className="border-b">
                      <th
                        className="cursor-pointer px-3 py-2 text-left font-medium"
                        onClick={() => handleSort("nom")}
                      >
                        Nom complet{" "}
                        {sortKey === "nom" && (
                          <span className="text-xs text-muted-foreground">
                            ({sortDirection === "asc" ? "↑" : "↓"})
                          </span>
                        )}
                      </th>
                      <th
                        className="cursor-pointer px-3 py-2 text-left font-medium"
                        onClick={() => handleSort("email")}
                      >
                        Email{" "}
                        {sortKey === "email" && (
                          <span className="text-xs text-muted-foreground">
                            ({sortDirection === "asc" ? "↑" : "↓"})
                          </span>
                        )}
                      </th>
                      <th className="px-3 py-2 text-left font-medium">
                        Username
                      </th>
                      <th
                        className="cursor-pointer px-3 py-2 text-left font-medium"
                        onClick={() => handleSort("createdAt")}
                      >
                        Créé le{" "}
                        {sortKey === "createdAt" && (
                          <span className="text-xs text-muted-foreground">
                            ({sortDirection === "asc" ? "↑" : "↓"})
                          </span>
                        )}
                      </th>
                      <th className="px-3 py-2 text-left font-medium">
                        Statut
                      </th>
                      <th className="px-3 py-2 text-center font-medium">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedTeachers.length === 0 && (
                      <tr>
                        <td
                          colSpan={6}
                          className="px-3 py-4 text-center text-sm text-muted-foreground"
                        >
                          Aucun enseignant trouvé.
                        </td>
                      </tr>
                    )}

                    {paginatedTeachers.map((teacher) => {
                      const fullName = `${teacher.prenom ?? ""} ${
                        teacher.nom ?? ""
                      }`.trim();

                      return (
                        <tr
                          key={teacher.id}
                          className="border-b bg-background transition-colors hover:bg-muted/40"
                        >
                          <td className="px-3 py-2 align-middle">
                            {fullName || teacher.username}
                          </td>
                          <td className="px-3 py-2 align-middle">
                            {teacher.email || "-"}
                          </td>
                          <td className="px-3 py-2 align-middle">
                            {teacher.username || "-"}
                          </td>
                          <td className="px-3 py-2 align-middle text-xs text-muted-foreground">
                            {teacher.createdAt
                              ? new Date(teacher.createdAt).toLocaleDateString()
                              : "Inconnu"}
                          </td>
                          <td className="px-3 py-2 align-middle">
                            <span
                              className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs ${
                                teacher.active
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                  : "bg-zinc-100 text-zinc-600 border border-zinc-200"
                              }`}
                            >
                              {teacher.active ? "Actif" : "Inactif"}
                            </span>
                          </td>
                          
                          <td className="px-3 py-2 align-middle text-right space-x-2">
                            
                            {/* Dialog de détails */}
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  size="icon"
                                  variant="outline"
                                  className="h-8 w-8"
                                  title="Voir les détails"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-lg">
                                <DialogHeader>
                                  <DialogTitle>Détails de l&apos;enseignant</DialogTitle>
                                  <DialogDescription>
                                    Informations complètes sur cet enseignant.
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-3 text-sm md:grid-cols-2">
                                  <div className="space-y-1">
                                    <p>
                                      <span className="font-medium">Nom complet : </span>
                                      {teacher.prenom} {teacher.nom}
                                    </p>
                                    <p>
                                      <span className="font-medium">
                                        Nom d&apos;utilisateur :{" "}
                                      </span>
                                      {teacher.username}
                                    </p>
                                    <p>
                                      <span className="font-medium">Email : </span>
                                      {teacher.email}
                                    </p>
                                    <p>
                                      <span className="font-medium">Téléphone : </span>
                                      {teacher.telephone || "Non renseigné"}
                                    </p>
                                  </div>
                                  <div className="space-y-1">
                                    <p>
                                      <span className="font-medium">Adresse : </span>
                                      {teacher.adresse || "Non renseignée"}
                                    </p>
                                    <p>
                                      <span className="font-medium">Rôle : </span>
                                      {mapUserRole(teacher.role)}
                                    </p>
                                    <p>
                                      <span className="font-medium">Créé le : </span>
                                      {teacher.createdAt
                                        ? new Date(
                                            teacher.createdAt
                                          ).toLocaleString()
                                        : "Inconnu"}
                                    </p>
                                    <p>
                                      <span className="font-medium">
                                        Dernière connexion :{" "}
                                      </span>
                                      {teacher.lastLoginAt
                                        ? new Date(
                                            teacher.lastLoginAt
                                          ).toLocaleString()
                                        : "Jamais connecté"}
                                    </p>
                                  </div>
                                </div>
                                <DialogFooter className="mt-4">
                                  <DialogClose asChild>
                                    <Button variant="outline">Fermer</Button>
                                  </DialogClose>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>

                            {/* Dialog d'édition */}
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  size="icon"
                                  variant="outline"
                                  className="h-8 w-8"
                                  title="Modifier"
                                >
                                  <Edit2 className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-lg">
                                <DialogHeader>
                                  <DialogTitle>
                                    Modifier l&apos;enseignant
                                  </DialogTitle>
                                  <DialogDescription>
                                    Mets à jour les informations de cet enseignant.
                                  </DialogDescription>
                                </DialogHeader>
                                <form
                                  className="space-y-4"
                                  onSubmit={(event) =>
                                    handleEditTeacher(event, teacher)
                                  }
                                >
                                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                    <div className="grid gap-2">
                                      <Label htmlFor={`edit-prenom-${teacher.id}`}>
                                        Prénom
                                      </Label>
                                      <Input
                                        id={`edit-prenom-${teacher.id}`}
                                        name="prenom"
                                        defaultValue={teacher.prenom}
                                      />
                                    </div>
                                    <div className="grid gap-2">
                                      <Label htmlFor={`edit-nom-${teacher.id}`}>
                                        Nom
                                      </Label>
                                      <Input
                                        id={`edit-nom-${teacher.id}`}
                                        name="nom"
                                        defaultValue={teacher.nom}
                                      />
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                    <div className="grid gap-2">
                                      <Label htmlFor={`edit-email-${teacher.id}`}>
                                        Email
                                      </Label>
                                      <Input
                                        id={`edit-email-${teacher.id}`}
                                        name="email"
                                        type="email"
                                        defaultValue={teacher.email}
                                      />
                                    </div>
                                    <div className="grid gap-2">
                                      <Label
                                        htmlFor={`edit-username-${teacher.id}`}
                                      >
                                        Identifiant
                                      </Label>
                                      <Input
                                        id={`edit-username-${teacher.id}`}
                                        name="username"
                                        defaultValue={teacher.username}
                                      />
                                    </div>
                                  </div>
                                  
                                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                    <div className="grid gap-2">
                                      <Label htmlFor={`edit-adresse-${teacher.id}`}>
                                        Adresse
                                      </Label>
                                      <Input
                                        id={`edit-adresse-${teacher.id}`}
                                        name="adresse"
                                        defaultValue={teacher.adresse}
                                      />
                                    </div>
                                    <div className="grid gap-2">
                                      <Label htmlFor={`edit-telephone-${teacher.id}`}>
                                        Téléphone
                                      </Label>
                                      <Input
                                        id={`edit-telephone-${teacher.id}`}
                                        name="telephone"
                                        defaultValue={teacher.telephone}
                                      />
                                    </div>
                                  </div>

                                  <div className="grid gap-2">
                                    <Label htmlFor={`edit-password-${teacher.id}`}>
                                      Mot de passe
                                    </Label>
                                    <Input
                                      id={`edit-password-${teacher.id}`}
                                      name="password"
                                      type="password"
                                      placeholder="Laisser vide pour ne pas changer"
                                    />
                                  </div>
                                  
                                  <div className="flex items-center gap-2 my-2">
                                    <input
                                      id={`edit-active-${teacher.id}`}
                                      name="active"
                                      type="checkbox"
                                      defaultChecked={teacher.active}
                                      className="h-4 w-4 rounded border border-input"
                                    />
                                    <Label
                                      htmlFor={`edit-active-${teacher.id}`}
                                      className="text-sm font-medium"
                                    >
                                      Compte actif
                                    </Label>
                                  </div>
                                  <DialogFooter className="mt-4">
                                    <DialogClose asChild>
                                      <Button type="button" variant="outline">
                                        Annuler
                                      </Button>
                                    </DialogClose>
                                    <DialogClose asChild>
                                      <Button type="submit">Enregistrer</Button>
                                    </DialogClose>
                                  </DialogFooter>
                                </form>
                              </DialogContent>
                            </Dialog>

                            {/* Suppression */}
                            <Button
                              size="icon"
                              variant="destructive"
                              className="h-8 w-8"
                              title="Supprimer"
                              onClick={() => handleDeleteTeacher(teacher)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>

                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Contrôles de pagination */}
              <div className="flex items-center justify-between gap-4 text-xs text-muted-foreground">
                <div>
                  {totalItems > 0 ? (
                    <span>
                      Affichage{" "}
                      <span className="font-medium">
                        {startIndex + 1}-{Math.min(endIndex, totalItems)}
                      </span>{" "}
                      sur{" "}
                      <span className="font-medium">{totalItems}</span>{" "}
                      enseignants
                    </span>
                  ) : (
                    <span>Aucun résultat</span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleChangePage("prev")}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span>
                    Page{" "}
                    <span className="font-medium">{currentPage}</span> /{" "}
                    <span className="font-medium">{totalPages}</span>
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleChangePage("next")}
                    disabled={currentPage === totalPages || totalItems === 0}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>

            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
