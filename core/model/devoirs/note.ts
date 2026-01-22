import { User } from "../user/user.model";
import { Remise } from "./remise";

export interface Note {
    id: string;
    remiseId: Remise;
    enseignantId: User;
    note: number;
    commentaire: string;
    dateNotation: Date;
    createdAt: Date;
    updatedAt: Date
}