export function EtudiantDashboard() {
    return (
        <>
            <h1 className="text-3xl font-bold mb-6">Tableau de bord Étudiant</h1>

            <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                <div className="bg-muted/50 aspect-video rounded-xl flex flex-col items-center justify-center p-4">
                    <p className="text-4xl font-bold">6</p>
                    <p className="text-muted-foreground">Cours suivis</p>
                </div>
                <div className="bg-muted/50 aspect-video rounded-xl flex flex-col items-center justify-center p-4">
                    <p className="text-4xl font-bold">3</p>
                    <p className="text-muted-foreground">Devoirs en attente</p>
                </div>
                <div className="bg-muted/50 aspect-video rounded-xl flex flex-col items-center justify-center p-4">
                    <p className="text-4xl font-bold">14.5</p>
                    <p className="text-muted-foreground">Moyenne générale</p>
                </div>
            </div>

            <div className="bg-muted/50 min-h-[60vh] flex-1 rounded-xl md:min-h-min p-6 mt-4">
                <h2 className="text-xl font-semibold mb-4">Devoirs à rendre</h2>
                <p className="text-muted-foreground">Liste des devoirs et dates limites...</p>
            </div>
        </>
    )
}