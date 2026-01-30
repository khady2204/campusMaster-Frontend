import { User } from "../user/user.model";
import { Semestre } from "./semestre";

export interface Module{
    id?: string;
    codeModule: string;
    titreModule: string;
    description: string;
    createdBy: string;
    updatedBy: string;
    responsable?: User;
    createur?: User;
    createdAt: Date;
    updatedAt: Date;
}