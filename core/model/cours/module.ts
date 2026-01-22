import { User } from "../user/user.model";
import { Semestre } from "./semestre";

export interface Module{
    id: string;
    code: string;
    titre: string;
    description: string;
    adminId: User;
    semestreId: Semestre;
    createdAt: Date;
    updatedAt: Date;
}