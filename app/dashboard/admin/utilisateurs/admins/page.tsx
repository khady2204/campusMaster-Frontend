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
import { BadgeCheck, Edit2, Trash2, UserCircle2 } from "lucide-react";

// Clés de tri possibles pour la liste d'administrateurs
type SortKey = "nom" | "email" | "createdAt" | "lastLoginAt";

type SortDirection = "asc" | "desc";

export default function Admins() {
  // Liste des administrateurs récupérés depuis l'API
  const [admins, setAdmins] = useState<User[]>([]);
  // Gestion du chargement initial
  const [loading, setLoading] = useState(true);
  // Message d'erreur éventuel
  const [error, setError] = useState<string | null>(null);
  // Valeur du champ de recherche (nom, prénom, email, username)
  const [search, setSearch] = useState("");
  // Clé de tri actuellement sélectionnée
  const [sortKey, setSortKey] = useState<SortKey>("nom");
  // Direction du tri (ascendant / descendant)
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  // Administrateur actuellement sélectionné pour l'affichage des détails
  const [selectedAdmin, setSelectedAdmin] = useState<User | null>(null);

  // Chargement des utilisateurs au montage du composant
  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        setLoading(true);
        setError(null);

        // Appel de l'endpoint générique des utilisateurs
        const users = await apiClient.get<User[]>("/users");

        // On ne garde que les utilisateurs ayant le rôle "Administrateur"
        const adminsOnly = users.filter(
          (user) => mapUserRole(user.role) === "Administrateur"
        );

        setAdmins(adminsOnly);

        // Par défaut, on sélectionne le premier admin pour la fiche détail
        if (adminsOnly.length > 0) {
          setSelectedAdmin(adminsOnly[0]);
        }
      } catch (e) {
        const message =
          e instanceof Error
            ? e.message
            : "Impossible de charger les administrateurs";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchAdmins();
  }, []);

  // Applique la recherche + le tri sur la liste d'administrateurs
  const filteredAndSortedAdmins = useMemo(() => {
    // Filtrage par texte
    const term = search.trim().toLowerCase();
    let list = admins;

    if (term) {
      list = admins.filter((admin) => {
        const fullName = `${admin.prenom ?? ""} ${admin.nom ?? ""}`.trim();
        return (
          fullName.toLowerCase().includes(term) ||
          (admin.username ?? "").toLowerCase().includes(term) ||
          (admin.email ?? "").toLowerCase().includes(term)
        );
      });
    }

    // Tri en fonction de la clé choisie
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
        if (sortKey === "lastLoginAt") {
          return user.lastLoginAt ?? "";
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
  }, [admins, search, sortKey, sortDirection]);

  // Change la clé/direction de tri lorsque l'utilisateur clique sur un en-tête
  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      // Si on reclique sur la même colonne, on inverse la direction
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      // Sinon, on change de colonne et on repart en ascendant
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  // Sélection d'un administrateur pour la fiche détail
  const handleSelectAdmin = (admin: User) => {
    setSelectedAdmin(admin);
  };

  // Suppression d'un administrateur
  const handleDeleteAdmin = async (admin: User) => {
    // Petit garde-fou côté UI pour éviter les clics accidentels
    const confirmed = window.confirm(
      `Supprimer définitivement l'administrateur ${admin.prenom} ${admin.nom} ?`
    );
    if (!confirmed) return;

    try {
      setError(null);
      // Ici on suppose une API REST classique : DELETE /users/{id}
      await apiClient.delete(`/users/${admin.id}`);

      // On met à jour la liste localement sans refaire un GET complet
      setAdmins((current) => current.filter((u) => u.id !== admin.id));

      // Si on vient de supprimer l'admin sélectionné, on en choisit un autre
      setSelectedAdmin((current) => {
        if (!current || current.id !== admin.id) return current;
        const remaining = admins.filter((u) => u.id !== admin.id);
        return remaining[0] ?? null;
      });
    } catch (e) {
      const message =
        e instanceof Error
          ? e.message
          : "Erreur lors de la suppression de l'administrateur";
      setError(message);
    }
  };

  // Ajout d'un administrateur via POST /users
  const handleAddAdmin = async (event: React.FormEvent<HTMLFormElement>) => {
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
      // Rôle forcé à "administrateur" et compte actif par défaut
      const payload: Record<string, unknown> = {
        prenom,
        nom,
        email,
        username,
        telephone,
        adresse,
        role: "administrateur",
        active: true,
      };

      if (password) {
        payload.password = password;
      }

      const created = await apiClient.post<User>("/users", payload);

      if (mapUserRole(created.role) === "Administrateur") {
        setAdmins((current) => [...current, created]);
        setSelectedAdmin((current) => current ?? created);
      }

      form.reset();
    } catch (e) {
      const message =
        e instanceof Error
          ? e.message
          : "Erreur lors de la création de l'administrateur";
      setError(message);
    }
  };

  // Edition d'un administrateur via PUT /users/{id}
  const handleEditAdmin = (
    event: React.FormEvent<HTMLFormElement>,
    admin: User
  ) => {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);

    const prenom = (formData.get("prenom") as string | null)?.trim() || "";
    const nom = (formData.get("nom") as string | null)?.trim() || "";
    const email = (formData.get("email") as string | null)?.trim() || "";
    const username = (formData.get("username") as string | null)?.trim() || "";
    const telephone =
      (formData.get("telephone") as string | null)?.trim() || "";
    const adresse = (formData.get("adresse") as string | null)?.trim() || "";
    const password = (formData.get("password") as string | null)?.trim() || "";
    const active = formData.get("active") !== null;

    const updateAdmin = async () => {
      try {
        const payload: Record<string, unknown> = {
          prenom,
          nom,
          email,
          username,
          telephone,
          adresse,
          role: admin.role,
          active,
        };

        if (password) {
          payload.password = password;
        }

        const updated = await apiClient.put<User>(
          `/users/${admin.id}`,
          payload
        );

        setAdmins((current) =>
          current.map((a) => (a.id === admin.id ? updated : a))
        );

        setSelectedAdmin((current) =>
          current && current.id === admin.id ? updated : current
        );
      } catch (e) {
        const message =
          e instanceof Error
            ? e.message
            : "Erreur lors de la modification de l'administrateur";
        setError(message);
      }
    };

    void updateAdmin();
  };

  return (
    <div className="space-y-6">
      {/* En-tête de la page */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Administrateurs</h1>
          <p className="text-sm text-muted-foreground">
            Gestion des comptes administrateurs de la plateforme.
          </p>
        </div>

        {/* Dialog d'ajout d'un administrateur */}
        <Dialog>
          <DialogTrigger asChild>
            <Button>+ Ajouter un administrateur</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Ajouter un administrateur</DialogTitle>
              <DialogDescription>
                Renseigne les informations de base de l&apos;administrateur.
              </DialogDescription>
            </DialogHeader>
            <form className="space-y-4" onSubmit={handleAddAdmin}>
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
                  <Label htmlFor="add-username">Identifiant</Label>
                  <Input id="add-username" name="username" required />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
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
                <Label htmlFor="add-telephone">Téléphone</Label>
                <Input id="add-telephone" name="telephone" />
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

      {/* Zone de recherche et d'informations */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <div>
            <CardTitle>Liste des administrateurs</CardTitle>
            <CardDescription>
              Recherche, tri et actions sur les comptes administrateurs.
            </CardDescription>
          </div>

          <div className="w-full max-w-xs">
            <Label htmlFor="search-admins" className="mb-1 block text-xs">
              Rechercher (nom, prénom, email, identifiant)
            </Label>
            <Input
              id="search-admins"
              placeholder="Ex : Dupont, admin@campusmaster.com..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Affichage du chargement ou d'une erreur si besoin */}
          {loading && (
            <p className="text-sm text-muted-foreground">
              Chargement des administrateurs...
            </p>
          )}

          {error && (
            <div className="rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Tableau principal des administrateurs */}
          {!loading && !error && (
            <div className="overflow-x-auto rounded-md border">
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
                      Identifiant
                    </th>
                    <th
                      className="cursor-pointer px-3 py-2 text-left font-medium"
                      onClick={() => handleSort("lastLoginAt")}
                    >
                      Dernière connexion{" "}
                      {sortKey === "lastLoginAt" && (
                        <span className="text-xs text-muted-foreground">
                          ({sortDirection === "asc" ? "↑" : "↓"})
                        </span>
                      )}
                    </th>
                    <th className="px-3 py-2 text-left font-medium">Statut</th>
                    <th className="px-3 py-2 text-right font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAndSortedAdmins.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-3 py-4 text-center text-sm text-muted-foreground"
                      >
                        Aucun administrateur trouvé.
                      </td>
                    </tr>
                  )}

                  {filteredAndSortedAdmins.map((admin) => {
                    const fullName = `${admin.prenom ?? ""} ${
                      admin.nom ?? ""
                    }`.trim();

                    return (
                      <tr
                        key={admin.id}
                        className={`border-b transition-colors hover:bg-muted/40 ${
                          selectedAdmin?.id === admin.id
                            ? "bg-muted/40"
                            : "bg-background"
                        }`}
                        onClick={() => handleSelectAdmin(admin)}
                      >
                        <td className="px-3 py-2 align-middle">
                          <div className="flex items-center gap-2">
                            <UserCircle2 className="h-4 w-4 text-muted-foreground" />
                            <span>{fullName || admin.username}</span>
                          </div>
                        </td>
                        <td className="px-3 py-2 align-middle">
                          {admin.email || "-"}
                        </td>
                        <td className="px-3 py-2 align-middle">
                          {admin.username || "-"}
                        </td>
                        <td className="px-3 py-2 align-middle text-xs text-muted-foreground">
                          {admin.lastLoginAt
                            ? new Date(admin.lastLoginAt).toLocaleString()
                            : "Jamais connecté"}
                        </td>
                        <td className="px-3 py-2 align-middle">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs ${
                              admin.active
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : "bg-zinc-100 text-zinc-600 border border-zinc-200"
                            }`}
                          >
                            {admin.active ? (
                              <BadgeCheck className="h-3 w-3" />
                            ) : null}
                            {admin.active ? "Actif" : "Inactif"}
                          </span>
                        </td>
                        <td className="px-3 py-2 align-middle text-right space-x-2">
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-8 w-8"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectAdmin(admin);
                            }}
                            title="Voir les détails"
                          >
                            <UserCircle2 className="h-4 w-4" />
                          </Button>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                size="icon"
                                variant="outline"
                                className="h-8 w-8"
                                onClick={(e) => {
                                  e.stopPropagation();
                                }}
                                title="Modifier"
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-lg">
                              <DialogHeader>
                                <DialogTitle>
                                  Modifier l&apos;administrateur
                                </DialogTitle>
                                <DialogDescription>
                                  Mets à jour les informations de cet administrateur.
                                </DialogDescription>
                              </DialogHeader>
                              <form
                                className="space-y-4"
                                onSubmit={(event) =>
                                  handleEditAdmin(event, admin)
                                }
                              >
                                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                  <div className="grid gap-2">
                                    <Label htmlFor={`edit-prenom-${admin.id}`}>
                                      Prénom
                                    </Label>
                                    <Input
                                      id={`edit-prenom-${admin.id}`}
                                      name="prenom"
                                      defaultValue={admin.prenom}
                                    />
                                  </div>
                                  <div className="grid gap-2">
                                    <Label htmlFor={`edit-nom-${admin.id}`}>
                                      Nom
                                    </Label>
                                    <Input
                                      id={`edit-nom-${admin.id}`}
                                      name="nom"
                                      defaultValue={admin.nom}
                                    />
                                  </div>
                                </div>
                                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                  <div className="grid gap-2">
                                    <Label htmlFor={`edit-email-${admin.id}`}>
                                      Email
                                    </Label>
                                    <Input
                                      id={`edit-email-${admin.id}`}
                                      name="email"
                                      type="email"
                                      defaultValue={admin.email}
                                    />
                                  </div>
                                  <div className="grid gap-2">
                                    <Label htmlFor={`edit-username-${admin.id}`}>
                                      Identifiant
                                    </Label>
                                    <Input
                                      id={`edit-username-${admin.id}`}
                                      name="username"
                                      defaultValue={admin.username}
                                    />
                                  </div>
                                </div>
                                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                  <div className="grid gap-2">
                                    <Label htmlFor={`edit-password-${admin.id}`}>
                                      Mot de passe
                                    </Label>
                                    <Input
                                      id={`edit-password-${admin.id}`}
                                      name="password"
                                      type="password"
                                      placeholder="Laisser vide pour ne pas changer"
                                    />
                                  </div>
                                  <div className="flex items-center gap-2 pt-6">
                                    <input
                                      id={`edit-active-${admin.id}`}
                                      name="active"
                                      type="checkbox"
                                      defaultChecked={admin.active}
                                      className="h-4 w-4 rounded border border-input"
                                    />
                                    <Label
                                      htmlFor={`edit-active-${admin.id}`}
                                      className="text-sm font-medium"
                                    >
                                      Compte actif
                                    </Label>
                                  </div>
                                </div>
                                <div className="grid gap-2">
                                  <Label htmlFor={`edit-telephone-${admin.id}`}>
                                    Téléphone
                                  </Label>
                                  <Input
                                    id={`edit-telephone-${admin.id}`}
                                    name="telephone"
                                    defaultValue={admin.telephone}
                                  />
                                </div>
                                <div className="grid gap-2">
                                  <Label htmlFor={`edit-adresse-${admin.id}`}>
                                    Adresse
                                  </Label>
                                  <Input
                                    id={`edit-adresse-${admin.id}`}
                                    name="adresse"
                                    defaultValue={admin.adresse}
                                  />
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
                          <Button
                            size="icon"
                            variant="destructive"
                            className="h-8 w-8"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteAdmin(admin);
                            }}
                            title="Supprimer"
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
          )}
        </CardContent>
      </Card>

      {/* Fiche détaillée de l'administrateur sélectionné */}
      {selectedAdmin && (
        <Card>
          <CardHeader>
            <CardTitle>
              Détails de l&apos;administrateur
            </CardTitle>
            <CardDescription>
              Informations complètes pour{" "}
              <span className="font-semibold">
                {selectedAdmin.prenom} {selectedAdmin.nom}
              </span>
              .
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1 text-sm">
              <p>
                <span className="font-medium">Nom complet : </span>
                {selectedAdmin.prenom} {selectedAdmin.nom}
              </p>
              <p>
                <span className="font-medium">Nom d&apos;utilisateur : </span>
                {selectedAdmin.username}
              </p>
              <p>
                <span className="font-medium">Email : </span>
                {selectedAdmin.email}
              </p>
              <p>
                <span className="font-medium">Téléphone : </span>
                {selectedAdmin.telephone || "Non renseigné"}
              </p>
              <p>
                <span className="font-medium">Adresse : </span>
                {selectedAdmin.adresse || "Non renseignée"}
              </p>
            </div>

            <div className="space-y-1 text-sm">
              <p>
                <span className="font-medium">Rôle : </span>
                {mapUserRole(selectedAdmin.role)}
              </p>
              <p>
                <span className="font-medium">Créé le : </span>
                {selectedAdmin.createdAt
                  ? new Date(selectedAdmin.createdAt).toLocaleString()
                  : "Inconnu"}
              </p>
              <p>
                <span className="font-medium">Dernière mise à jour : </span>
                {selectedAdmin.updatedAt
                  ? new Date(selectedAdmin.updatedAt).toLocaleString()
                  : "Inconnue"}
              </p>
              <p>
                <span className="font-medium">Dernière connexion : </span>
                {selectedAdmin.lastLoginAt
                  ? new Date(selectedAdmin.lastLoginAt).toLocaleString()
                  : "Jamais connecté"}
              </p>
              <p>
                <span className="font-medium">Email vérifié : </span>
                {selectedAdmin.emailVerified ? "Oui" : "Non"}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
