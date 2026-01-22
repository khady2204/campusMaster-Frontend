"use client"
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { userService } from "@/core/services/user.service";
import { User } from "@/core/model/user/user.model";
import { useEffect, useState } from "react";
import { mapUserRole } from "@/lib/menu-config";

export default function EnseignantsPage() {
  
  const [Listusers, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await userService.getUsers();
        setUsers(users);
        // On ne conserve que les profils ayant le rôle "Etudiant"
        const etudiantsOnly = users.filter(
          (user) => mapUserRole(user.role) === "Etudiant"
        );
        setUsers(etudiantsOnly);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);


  return (
    <div className="container mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-[#0A3282]/80">Liste des etudiants de la plateforme</h1>
        <p className="text-sm text-muted-foreground">
          Gestion des étudiants de la plateforme.
        </p>
      </div>
      <DataTable columns={columns} data={Listusers} />
    </div>
  )

}