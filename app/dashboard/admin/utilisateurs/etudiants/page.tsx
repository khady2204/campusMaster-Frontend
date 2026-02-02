"use client"
import { DataTable } from "./data-table";
import { createColumns } from "./columns";
import { userService } from "@/core/services/user.service";
import { User } from "@/core/model/user/user.model";
import { useEffect, useState } from "react";
import { PagedResponse } from "@/core/model/user/pageResponse.model";

export default function EtudiantsPage() {
  
  const [data, setData] = useState<PagedResponse<User> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

   // 
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await userService.getAllUsersByRole("ETUDIANT", pageIndex, pageSize);
      setData(response);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [pageIndex, pageSize]);


  const columns = createColumns(fetchUsers);

  return (
    <div className="container mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-[#0A3282]/80">Liste des etudiants de la plateforme</h1>
        <p className="text-sm text-muted-foreground">
          Gestion des étudiants de la plateforme.
        </p>
      </div>

      <DataTable
        columns={columns}
        data={data?.content ?? []}
        onRefresh={fetchUsers}
        isLoading={isLoading}
        pageIndex={pageIndex}
        setPageIndex={setPageIndex}
        totalPages={data?.totalPages ?? 0}
      />
    </div>
  )

}