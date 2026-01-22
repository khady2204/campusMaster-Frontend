import { Database, Megaphone, Package, TrendingUp, UserPlus, Users } from "lucide-react";

export default function page() {
    return (
        <div className="space-y-5">
            <div className="grid md:grid-cols-4 lg:grid-cols-4 gap-4">
                <div className="shadow border rounded-2xl space-y-1 flex flex-col justify-between p-4">
                    <div className="flex justify-between items-center">
                        <p className="font-medium text-[#0A3282]/80 dark:text-white">Nbre étudiants</p>
                        <span className="bg-[#0A3282]/90 text-white dark:bg-gray-700 p-2 rounded">
                            <Users className="h-4"/>
                        </span>
                    </div>
                    <div className="">
                        <p className="font-bold text-2xl">150</p>
                    </div>
                    <div className="flex items-center">
                        <TrendingUp className="mr-2 h-4 text-[#0A3282]" />
                        <p className="font-light text-sm">plus de 50% d&apos;augmentation</p>
                    </div>
                </div>
                <div className="shadow border rounded-2xl space-y-1 flex flex-col justify-between p-4">
                    <div className="flex justify-between items-center">
                        <p className="font-medium text-[#0A3282]/90 dark:text-white">Nbre enseignants</p>
                        <span className="bg-[#0A3282] text-white dark:bg-gray-700 p-2 rounded">
                            <Users className="h-4"/>
                        </span>
                    </div>
                    <div className="">
                        <p className="font-bold text-2xl">15</p>
                    </div>
                    <div className="flex items-center">
                        <TrendingUp className="mr-2 h-4 text-[#0A3282]" />
                        <p className="font-light text-sm">plus de 10% d&apos;augmentation</p>
                    </div>
                </div>
                <div className="shadow border rounded-2xl space-y-1 flex flex-col justify-between p-4">
                    <div className="flex justify-between items-center">
                        <p className="font-medium text-[#0A3282]/90 dark:text-white">Modules</p>
                        <span className="bg-[#0A3282] text-white dark:bg-gray-700 p-2 rounded">
                            <Package className="h-4"/>
                        </span>
                    </div>
                    <div className="">
                        <p className="font-bold text-2xl">150</p>
                    </div>
                    <div className="flex items-center">
                        <TrendingUp className="mr-2 h-4 text-[#0A3282]" />
                        <p className="font-light text-sm">modules disponibles</p>
                    </div>
                </div>
                <div className="shadow border rounded-2xl space-y-1 flex flex-col justify-between p-4">
                    <div className="flex justify-between items-center">
                        <p className="font-medium text-[#0A3282]/80 dark:text-white">Nbre étudiants</p>
                        <span className="bg-[#0A3282] text-white dark:bg-gray-700 p-2 rounded">
                            <Users className="h-4"/>
                        </span>
                    </div>
                    <div className="">
                        <p className="font-bold text-2xl">150</p>
                    </div>
                    <div className="flex items-center">
                        <TrendingUp className="mr-2 h-4 text-[#0A3282]" />
                        <p className="font-light text-sm">plus de 50% d&apos;augmentation</p>
                    </div>
                </div>
            </div>

            <div className="">
                <div className="grid md:grid-cols-12 lg:grid-cols-12 gap-4">
                    <div className="card h-96 shadow border rounded-2xl col-span-8"></div>
                    <div className="card h-96 shadow border rounded-2xl col-span-4 p-5 space-y-5">
                        <h2 className="font-semibold">Actions rapides</h2>
                        <div className="card grid md:grid-cols-2 lg:grid-cols-2 gap-6">
                            <div className="p-2 rounded-2xl space-y-4 h-34 border flex flex-col justify-center items-center">
                                <Package className="h-8 w-8" />
                                <p className="text-sm text-center font-extralight">Ajouter un module</p>
                            </div>
                            <div className="p-2 rounded-2xl space-y-4 h-34 border flex flex-col justify-center items-center">
                                <UserPlus className="h-8 w-8" />
                                <p className="text-sm text-center font-extralight">Ajouter un utilisateur</p>
                            </div>
                            <div className="p-2 rounded-2xl space-y-4 h-34 border flex flex-col justify-center items-center">
                                <Megaphone className="h-8 w-8"/>
                                <p className="text-sm text-center font-extralight">Passer une annonce</p>
                            </div>
                            <div className="p-2 rounded-2xl space-y-4 h-34 border flex flex-col justify-center items-center">
                                <Database className="h-8 w-8" />
                                <p className="text-sm text-center font-extralight">Exporter des données</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}