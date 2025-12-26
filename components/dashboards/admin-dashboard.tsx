import { Card, CardContent, CardFooter, CardHeader } from "../ui/card"

export function AdminDashboard() {
    return (
        <>
            <div className="grid grid-cols-4 gap-4">
                <Card>
                    <CardHeader>Test</CardHeader>
                    <CardContent></CardContent>
                    <CardFooter></CardFooter>
                </Card>
                <Card> </Card>
                <Card> </Card>
                <Card> </Card>
            </div>


            {/* <h1 className="text-3xl font-bold mb-6">Tableau de bord Admin</h1>

            <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                <div className="bg-muted/50 aspect-video rounded-xl flex flex-col items-center justify-center p-4">
                    <p className="text-4xl font-bold">150</p>
                    <p className="text-muted-foreground">Total Étudiants</p>
                </div>
                <div className="bg-muted/50 aspect-video rounded-xl flex flex-col items-center justify-center p-4">
                    <p className="text-4xl font-bold">25</p>
                    <p className="text-muted-foreground">Enseignants</p>
                </div>
                <div className="bg-muted/50 aspect-video rounded-xl flex flex-col items-center justify-center p-4">
                    <p className="text-4xl font-bold">42</p>
                    <p className="text-muted-foreground">Cours actifs</p>
                </div>
            </div>

            <div className="bg-muted/50 min-h-[60vh] flex-1 rounded-xl md:min-h-min p-6 mt-4">
                <h2 className="text-xl font-semibold mb-4">Activités récentes</h2>
                <p className="text-muted-foreground">Liste des dernières actions sur la plateforme...</p>
            </div> */}
        </>
    )
}