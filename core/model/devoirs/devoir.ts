import { Cours } from "../cours/cours";
import { User } from "../user/user.model";

export interface Devoir {
    id: string;
    coursId: Cours;
    enseignantId: User;
    urlFichier: string;
    titre: string;
    consigne: string;
    description: string;
    dateLimite: Date;
    createdAt: Date;
    updatedAt: Date;
}