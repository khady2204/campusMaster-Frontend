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
        <div className="flex justify-center items-center min-h-screen loginPage">
            <div className="flex justify-center items-center card-content min-h-screen w-full">
                <Card className="min-w-sm px-4 py-10 rounded-lg border shadow bg-transparent dark:bg-transparent z-50">
                
                <CardTitle className="text-center">Connexion</CardTitle>
                
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
                                    <FormLabel>Nom d'utilisateur</FormLabel>
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
                                    <FormLabel>Mot de passe</FormLabel>
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

                        {/* Bouton de soumission */}
                        <Button
                            type="submit"
                            className="w-full mt-5"
                            disabled={isLoading} // Désactive pendant la soumission
                        >
                            {isLoading ? "Connexion..." : "Se connecter"}
                        </Button>
                    </form>
                </Form>
            </Card>
            </div>
        </div>
    );
}