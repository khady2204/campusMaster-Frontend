import { User } from "../user/user.model";

export interface Semestre {
    id: string;
    nom: string;
    adminId: string;
    admin: User;
    createdAt: Date;
    updatedAt: Date;
}