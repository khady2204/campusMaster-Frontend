export function EnseignantDashboard() {
    return (
        <>
            <h1 className="text-3xl font-bold mb-6">Tableau de bord Enseignant</h1>

            <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                <div className="bg-muted/50 aspect-video rounded-xl flex flex-col items-center justify-center p-4">
                    <p className="text-4xl font-bold">8</p>
                    <p className="text-muted-foreground">Mes cours</p>
                </div>
                <div className="bg-muted/50 aspect-video rounded-xl flex flex-col items-center justify-center p-4">
                    <p className="text-4xl font-bold">120</p>
                    <p className="text-muted-foreground">Étudiants</p>
                </div>
                <div className="bg-muted/50 aspect-video rounded-xl flex flex-col items-center justify-center p-4">
                    <p className="text-4xl font-bold">15</p>
                    <p className="text-muted-foreground">Devoirs à corriger</p>
                </div>
            </div>

            <div className="bg-muted/50 min-h-[60vh] flex-1 rounded-xl md:min-h-min p-6 mt-4">
                <h2 className="text-xl font-semibold mb-4">Prochains cours</h2>
                <p className="text-muted-foreground">Planning de la semaine...</p>
            </div>
        </>
    )
}