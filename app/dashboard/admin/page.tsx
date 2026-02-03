"use client";

import { userService } from "@/core/services/user.service";
import { moduleService } from "@/core/services/module.service";
import { Database, GraduationCap, Megaphone, Package, TrendingUp, UserPlus, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { coursService } from "@/core/services/cours.service";
import { enrollementService } from "@/core/services/enrollement.service";

export default function AdminDashboard() {

    const [listUsers, setListUsers] = useState(0);
    const [listModules, setListModules] = useState(0);
    const [listCours, setListCours] = useState(0);
    const [listEnrollements, setListEnrollements] = useState(0);

    useEffect(() => {
            try {
                userService.getAllUsers().then((res) => {
                    setListUsers(res.length);
                });
                moduleService.getAllModules().then((res) => {
                    setListModules(res.length);
                });
                coursService.getAllCours().then((res) => {
                    setListCours(res.length);
                });
                enrollementService.getAllEnrollements().then((res) => {
                    setListEnrollements(res.length);
                });
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        }
    , []);
    
    return (
        <div className="space-y-5">
            <div className="grid md:grid-cols-4 lg:grid-cols-4 gap-4">
                <div className="shadow border rounded-2xl space-y-1 flex flex-col justify-between p-4">
                    <div className="flex justify-between items-center">
                        <p className="font-medium text-[#0A3282]/80 dark:text-white">Utilisateurs</p>
                        <span className="bg-[#0A3282]/90 text-white dark:bg-gray-700 p-2 rounded">
                            <Users className="h-4"/>
                        </span>
                    </div>
                    <div className="">
                        <p className="font-bold text-2xl"> {listUsers} </p>
                    </div>
                    <div className="flex items-center">
                        <TrendingUp className="mr-2 h-4 text-[#0A3282]" />
                        <p className="font-light text-sm">utilisateurs inscrits</p>
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
                        <p className="font-bold text-2xl"> {listModules} </p>
                    </div>
                    <div className="flex items-center">
                        <TrendingUp className="mr-2 h-4 text-[#0A3282]" />
                        <p className="font-light text-sm">modules disponibles</p>
                    </div>
                </div>
                <div className="shadow border rounded-2xl space-y-1 flex flex-col justify-between p-4">
                    <div className="flex justify-between items-center">
                        <p className="font-medium text-[#0A3282]/90 dark:text-white">Nbre Cours</p>
                        <span className="bg-[#0A3282] text-white dark:bg-gray-700 p-2 rounded">
                            <Users className="h-4"/>
                        </span>
                    </div>
                    <div className="">
                        <p className="font-bold text-2xl"> {listCours} </p>
                    </div>
                    <div className="flex items-center">
                        <TrendingUp className="mr-2 h-4 text-[#0A3282]" />
                        <p className="font-light text-sm">Cours disponibles</p>
                    </div>
                </div>
                <div className="shadow border rounded-2xl space-y-1 flex flex-col justify-between p-4">
                    <div className="flex justify-between items-center">
                        <p className="font-medium text-[#0A3282]/80 dark:text-white">Nbre d&apos;enrolements</p>
                        <span className="bg-[#0A3282] text-white dark:bg-gray-700 p-2 rounded">
                            <GraduationCap className="h-4"/>
                        </span>
                    </div>
                    <div className="">
                        <p className="font-bold text-2xl"> {listEnrollements} </p>
                    </div>
                    <div className="flex items-center">
                        <TrendingUp className="mr-2 h-4 text-[#0A3282]" />
                        <p className="font-light text-sm">Etudiants enrollés</p>
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