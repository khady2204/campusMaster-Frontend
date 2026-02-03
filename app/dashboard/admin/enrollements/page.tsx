"use client"
import { DataTable } from "./data-table";
import { createColumns } from "./columns";
import { useEffect, useState } from "react";
import { Enrollement } from "@/core/model/cours/enrollement";
import { enrollementService } from "@/core/services/enrollement.service";

export default function EnrollmentsPage() {

    const [ListEnrollements, setListEnrollements] = useState<Enrollement[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // 
    const fetchEnrollement = async () => {
        setIsLoading(true)
        try {
            const enrollements = await enrollementService.getAllEnrollements();

            setListEnrollements(enrollements)

        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    // 
    useEffect(() => {
        (async () => {
            await fetchEnrollement()
        })()
    }, [])

    const columns = createColumns(fetchEnrollement);


    return (
        <div className="container mx-auto space-y-4">
            <div>
            <h1 className="text-2xl font-semibold text-[#0A3282]/80">Liste des enrollements de la plateforme</h1>
            <p className="text-sm text-muted-foreground">
                Gestion des enrollements de la plateforme.
            </p>
            </div>
    
            <DataTable columns={columns} data={ListEnrollements} onRefresh={fetchEnrollement} isLoading={isLoading} />
        </div>
    )
}