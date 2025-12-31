/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/hooks/use-auth"
import Image from "next/image"
import imgLogin from "../../../public/images/img-login.png"
import Link from "next/link"

// Schéma de validation avec Zod
const loginSchema = z.object({
    username: z.string().min(2, {
        message: "Veuillez entrer un identifiant au moins 2 caractères .",
    }),
    password: z.string().min(6, {
        message: "Le mot de passe doit contenir au moins 6 caractères.",
    }),
})

// Type inféré à partir du schéma Zod
type LoginFormValues = z.infer<typeof loginSchema>

export default function Login() {

    const { login } = useAuth()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")

    // Initialisation du formulaire avec react-hook-form et Zod
    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema), // Intègre la validation Zod
        defaultValues: {
            username: "",
            password: "",
        },
    })

    // Gestionnaire de soumission du formulaire
    async function onSubmit(values: LoginFormValues) {
        setIsLoading(true)
        setError("")
        try {
            await login(values);
        } catch (e: any) {
            setError(e.message || "Une erreur est survenue lors de la connexion")
            setIsLoading(false)
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-white">
            
            <div className="flex justify-center items-center min-h-screen w-full relative">
                
                <div className="absolute top-4 left-5">
                    <Link href="/" className="flex gap-4 items-center justify-center ">
                        <span className="h-10 w-10 p-2 flex items-center justify-center rounded-full bg-[#1153D7] text-white text-1xl font-bold">
                            <strong className="">CM</strong>
                        </span>
                        <p className="text-2xl font-bold text-[#1153D7]">CampusMaster</p>
                    </Link>
                </div>

                <div className="grid md:grid-cols-3 gap-5">
                    <div className="hidden md:block md:col-span-2">
                        <div className="relative">
                            <Image
                                src={imgLogin}
                                alt="Login Image"
                                width={700}
                                height={500}
                            />

                            <div className="absolute bottom-5 left-5 text-white p-4 rounded-md">
                                <h2 className="text-4xl font-bold">
                                    Bienvenue sur votre espace <br /> numérique
                                </h2>
                                <p className="mt-4 font-medium">
                                    Accedez à tous vos cours, ressources et suivis pédagogiques
                                    pour l’année de Master
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="md:col-span-1 flex justify-center items-center">
                        <Card className="w-[350px] border md:border-0 px-4 py-10 shadow-none rounded-lg bg-transparent dark:bg-transparent z-50">
                            
                            <CardTitle className="text-center font-bold text-2xl mb-6 text-[#1153D7]">Connectez-vous</CardTitle>
                        
                            {error && (
                                <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm text-center mt-4 mb-2 border border-red-200">
                                    {error}
                                </div>
                            )}

                            {/* Composant Form de react-hook-form */}
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                                    {/* Champ Email */}
                                    <FormField
                                        control={form.control}
                                        name="username"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-sm font-medium text-gray-600">Nom d'utilisateur</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Votre nom d'utilisateur"
                                                        type="text"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage /> {/* Affiche les erreurs de validation */}
                                            </FormItem>
                                        )}
                                    />

                                    {/* Champ Mot de passe */}
                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-sm font-medium text-gray-600">Mot de passe</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="••••••"
                                                        type="password"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage /> {/* Affiche les erreurs de validation */}
                                            </FormItem>
                                        )}
                                    />

                                    <p className="text-sm font-medium text-left text-[#1153D7] cursor-pointer">Mot de passe oublié ?</p>

                                    {/* Bouton de soumission */}
                                    <Button
                                        type="submit"
                                        className="w-full mt-8 bg-[#1153D7] text-white font-bold py-2 rounded-md hover:bg-[#0d47a1]"
                                        disabled={isLoading} // Désactive pendant la soumission
                                    >
                                        {isLoading ? "Connexion..." : "Se connecter"}
                                    </Button>
                                </form>
                            </Form>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}