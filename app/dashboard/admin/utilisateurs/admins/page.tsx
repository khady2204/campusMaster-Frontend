"use client"
import { DataTable } from "./data-table";
import { createColumns } from "./columns";
import { userService } from "@/core/services/user.service";
import { User } from "@/core/model/user/user.model";
import { useEffect, useState } from "react";
import { PagedResponse } from "@/core/model/user/pageResponse.model";

export default function AdminsPage() {
  
  const [data, setData] = useState<PagedResponse<User> | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(10);
  
     // 
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const response = await userService.getAllUsersByRole("Administrateur", pageIndex, pageSize);
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


  return (
    <div className="container mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-[#0A3282]/80">Liste des administrateurs de la plateforme</h1>
        <p className="text-sm text-muted-foreground">
          Gestion des administrateurs de la plateforme.
        </p>
      </div>
      <DataTable  
        columns={createColumns(fetchUsers)}
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