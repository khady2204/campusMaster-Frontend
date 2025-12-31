/* Page de gestion des étudiants */
"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client";
import { User } from "@/types/auth";
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
import { Edit2, Trash2 } from "lucide-react";

// Cette page reste volontairement plus simple que celle des enseignants :
// - pas de tri avancé
// - pas de pagination
// - filtres basiques

export default function Etudiants() {
  // Liste des étudiants uniquement (filtrés depuis /users)
  const [students, setStudents] = useState<User[]>([]);
  // Etat de chargement
  const [loading, setLoading] = useState(true);
  // Message d'erreur éventuel
  const [error, setError] = useState<string | null>(null);
  // Recherche texte simple (nom, prénom, email, username)
  const [search, setSearch] = useState("");
  // Filtre sur le statut (tous, actifs, inactifs)
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">(
    "all"
  );

  /* Chargement initial de la liste des étudiants */
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        setError(null);

        // On récupère tous les utilisateurs
        const users = await apiClient.get<User[]>("/users");

        // On ne garde que ceux dont le rôle mappé est "Etudiant"
        const etudiantsOnly = users.filter(
          (user) => mapUserRole(user.role) === "Etudiant"
        );

        setStudents(etudiantsOnly);
      } catch (e) {
        const message =
          e instanceof Error
            ? e.message
            : "Impossible de charger les étudiants";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    void fetchStudents();
  }, []);

  /* Fonction utilitaire : applique les filtres de recherche + statut */
  const filteredStudents = students.filter((student) => {
    const term = search.trim().toLowerCase();

    // Filtre de recherche (nom complet, username, email)
    const fullName = `${student.prenom ?? ""} ${student.nom ?? ""}`.trim();
    const matchesSearch =
      !term ||
      fullName.toLowerCase().includes(term) ||
      (student.username ?? "").toLowerCase().includes(term) ||
      (student.email ?? "").toLowerCase().includes(term);

    // Filtre de statut (all / active / inactive)
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && student.active) ||
      (statusFilter === "inactive" && !student.active);

    return matchesSearch && matchesStatus;
  });

  /* Suppression d'un étudiant */
  const handleDeleteStudent = async (student: User) => {
    const confirmed = window.confirm(
      `Supprimer définitivement l'étudiant ${student.prenom} ${student.nom} ?`
    );
    if (!confirmed) return;

    try {
      setError(null);
      // Endpoint générique de suppression d'utilisateur
      await apiClient.delete(`/users/${student.id}`);
      // Mise à jour locale de la liste
      setStudents((current) => current.filter((u) => u.id !== student.id));
    } catch (e) {
      const message =
        e instanceof Error
          ? e.message
          : "Erreur lors de la suppression de l'étudiant";
      setError(message);
    }
  };

  /* Soumission du formulaire d'ajout : création via POST /users */
  const handleAddStudent = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const form = event.currentTarget;
    const formData = new FormData(form);

    // Récupération et nettoyage des champs du formulaire
    const prenom = (formData.get("prenom") as string | null)?.trim() || "";
    const nom = (formData.get("nom") as string | null)?.trim() || "";
    const email = (formData.get("email") as string | null)?.trim() || "";
    const username = (formData.get("username") as string | null)?.trim() || "";
    const telephone =
      (formData.get("telephone") as string | null)?.trim() || "";
    const adresse = (formData.get("adresse") as string | null)?.trim() || "";
    const password = (formData.get("password") as string | null)?.trim() || "";

    try {
      // Payload de création : rôle forcé à "etudiant" et compte actif par défaut
      const payload: Record<string, unknown> = {
        prenom,
        nom,
        email,
        username,
        telephone,
        adresse,
        role: "etudiant",
        active: true,
      };

      // Le mot de passe est obligatoire côté formulaire, mais on garde le check
      if (password) {
        payload.password = password;
      }

      // Appel POST /users qui doit renvoyer l'utilisateur créé
      const created = await apiClient.post<User>("/users", payload);

      // On vérifie qu'il s'agit bien d'un étudiant avant de l'ajouter à la liste
      if (mapUserRole(created.role) === "Etudiant") {
        setStudents((current) => [...current, created]);
      }

      // On réinitialise le formulaire
      form.reset();
    } catch (e) {
      const message =
        e instanceof Error
          ? e.message
          : "Erreur lors de la création de l'étudiant";
      setError(message);
    }
  };

  /* Soumission du formulaire d'édition : mise à jour via PUT /users/{id} */
  const handleEditStudent = (
    event: React.FormEvent<HTMLFormElement>,
    student: User
  ) => {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);

    // Champs éditables
    const prenom = (formData.get("prenom") as string | null)?.trim() || "";
    const nom = (formData.get("nom") as string | null)?.trim() || "";
    const email = (formData.get("email") as string | null)?.trim() || "";
    const username = (formData.get("username") as string | null)?.trim() || "";
    const telephone =
      (formData.get("telephone") as string | null)?.trim() || "";
    const adresse = (formData.get("adresse") as string | null)?.trim() || "";
    const password = (formData.get("password") as string | null)?.trim() || "";
    // La case à cocher "active" est présente dans le formulaire d'édition
    const active = formData.get("active") !== null;

    const updateStudent = async () => {
      try {
        // On conserve le rôle existant, on met à jour les autres champs
        const payload: Record<string, unknown> = {
          prenom,
          nom,
          email,
          username,
          telephone,
          adresse,
          role: student.role,
          active,
        };

        // Si un mot de passe est renseigné, on le transmet
        if (password) {
          payload.password = password;
        }

        // Appel PUT /users/{id} qui renvoie l'utilisateur mis à jour
        const updated = await apiClient.put<User>(
          `/users/${student.id}`,
          payload
        );

        // Mise à jour locale de la liste des étudiants
        setStudents((current) =>
          current.map((s) => (s.id === student.id ? updated : s))
        );
      } catch (e) {
        const message =
          e instanceof Error
            ? e.message
            : "Erreur lors de la modification de l'étudiant";
        setError(message);
      }
    };

    void updateStudent();
  };

  return (
    <div className="space-y-6">
      {/* En-tête de la page */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Étudiants</h1>
          <p className="text-sm text-muted-foreground">
            Gestion des comptes étudiants de la plateforme.
          </p>
        </div>

        {/* Dialog d'ajout d'un étudiant */}
        <Dialog>
          <DialogTrigger asChild>
            <Button>+ Ajouter un étudiant</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Ajouter un étudiant</DialogTitle>
              <DialogDescription>
                Renseigne les informations de base de l&apos;étudiant.
              </DialogDescription>
            </DialogHeader>
            <form className="space-y-4" onSubmit={handleAddStudent}>
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

      {/* Bloc principal : filtres + tableau des étudiants */}
      <Card>
        <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle>Liste des étudiants</CardTitle>
            <CardDescription>
              Recherche rapide et gestion des comptes étudiants.
            </CardDescription>
          </div>

          {/* Filtres simples : recherche + statut */}
          <div className="flex w-full flex-col gap-3 md:w-auto md:flex-row md:items-center">
            <div className="w-full md:w-64">
              <Label
                htmlFor="search-students"
                className="mb-1 block text-xs text-muted-foreground"
              >
                Rechercher (nom, prénom, email, identifiant)
              </Label>
              <Input
                id="search-students"
                placeholder="Ex : Durand, etu@campusmaster.com..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
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
                onChange={(e) =>
                  setStatusFilter(
                    e.target.value as "all" | "active" | "inactive"
                  )
                }
              >
                <option value="all">Tous</option>
                <option value="active">Actifs</option>
                <option value="inactive">Inactifs</option>
              </select>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Affichage du chargement ou d'une éventuelle erreur */}
          {loading && (
            <p className="text-sm text-muted-foreground">
              Chargement des étudiants...
            </p>
          )}

          {error && (
            <div className="rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Tableau principal des étudiants */}
          {!loading && !error && (
            <div className="overflow-x-auto rounded-md border">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr className="border-b">
                    <th className="px-3 py-2 text-left font-medium">
                      Nom complet
                    </th>
                    <th className="px-3 py-2 text-left font-medium">Email</th>
                    <th className="px-3 py-2 text-left font-medium">
                      Identifiant
                    </th>
                    <th className="px-3 py-2 text-left font-medium">Statut</th>
                    <th className="px-3 py-2 text-right font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-3 py-4 text-center text-sm text-muted-foreground"
                      >
                        Aucun étudiant trouvé.
                      </td>
                    </tr>
                  )}

                  {filteredStudents.map((student) => {
                    const fullName = `${student.prenom ?? ""} ${
                      student.nom ?? ""
                    }`.trim();

                    return (
                      <tr
                        key={student.id}
                        className="border-b bg-background transition-colors hover:bg-muted/40"
                      >
                        <td className="px-3 py-2 align-middle">
                          {fullName || student.username}
                        </td>
                        <td className="px-3 py-2 align-middle">
                          {student.email || "-"}
                        </td>
                        <td className="px-3 py-2 align-middle">
                          {student.username || "-"}
                        </td>
                        <td className="px-3 py-2 align-middle">
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs ${
                              student.active
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : "bg-zinc-100 text-zinc-600 border border-zinc-200"
                            }`}
                          >
                            {student.active ? "Actif" : "Inactif"}
                          </span>
                        </td>
                        <td className="px-3 py-2 align-middle text-right space-x-2">
                          {/* Dialog d'édition d'un étudiant */}
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
                                  Modifier l&apos;étudiant
                                </DialogTitle>
                                <DialogDescription>
                                  Mets à jour les informations de cet étudiant.
                                </DialogDescription>
                              </DialogHeader>
                              <form
                                className="space-y-4"
                                onSubmit={(event) =>
                                  handleEditStudent(event, student)
                                }
                              >
                                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                  <div className="grid gap-2">
                                    <Label htmlFor={`edit-prenom-${student.id}`}>
                                      Prénom
                                    </Label>
                                    <Input
                                      id={`edit-prenom-${student.id}`}
                                      name="prenom"
                                      defaultValue={student.prenom}
                                    />
                                  </div>
                                  <div className="grid gap-2">
                                    <Label htmlFor={`edit-nom-${student.id}`}>
                                      Nom
                                    </Label>
                                    <Input
                                      id={`edit-nom-${student.id}`}
                                      name="nom"
                                      defaultValue={student.nom}
                                    />
                                  </div>
                                </div>
                                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                  <div className="grid gap-2">
                                    <Label htmlFor={`edit-email-${student.id}`}>
                                      Email
                                    </Label>
                                    <Input
                                      id={`edit-email-${student.id}`}
                                      name="email"
                                      type="email"
                                      defaultValue={student.email}
                                    />
                                  </div>
                                  <div className="grid gap-2">
                                    <Label
                                      htmlFor={`edit-username-${student.id}`}
                                    >
                                      Identifiant
                                    </Label>
                                    <Input
                                      id={`edit-username-${student.id}`}
                                      name="username"
                                      defaultValue={student.username}
                                    />
                                  </div>
                                </div>
                                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                  <div className="grid gap-2">
                                    <Label
                                      htmlFor={`edit-password-${student.id}`}
                                    >
                                      Mot de passe
                                    </Label>
                                    <Input
                                      id={`edit-password-${student.id}`}
                                      name="password"
                                      type="password"
                                      placeholder="Laisser vide pour ne pas changer"
                                    />
                                  </div>
                                  <div className="flex items-center gap-2 pt-6">
                                    <input
                                      id={`edit-active-${student.id}`}
                                      name="active"
                                      type="checkbox"
                                      defaultChecked={student.active}
                                      className="h-4 w-4 rounded border border-input"
                                    />
                                    <Label
                                      htmlFor={`edit-active-${student.id}`}
                                      className="text-sm font-medium"
                                    >
                                      Compte actif
                                    </Label>
                                  </div>
                                </div>
                                <div className="grid gap-2">
                                  <Label
                                    htmlFor={`edit-telephone-${student.id}`}
                                  >
                                    Téléphone
                                  </Label>
                                  <Input
                                    id={`edit-telephone-${student.id}`}
                                    name="telephone"
                                    defaultValue={student.telephone}
                                  />
                                </div>
                                <div className="grid gap-2">
                                  <Label htmlFor={`edit-adresse-${student.id}`}>
                                    Adresse
                                  </Label>
                                  <Input
                                    id={`edit-adresse-${student.id}`}
                                    name="adresse"
                                    defaultValue={student.adresse}
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

                          {/* Suppression */}
                          <Button
                            size="icon"
                            variant="destructive"
                            className="h-8 w-8"
                            title="Supprimer"
                            onClick={() => handleDeleteStudent(student)}
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
    </div>
  );
}

