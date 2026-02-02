import { User } from "../user/user.model";

export interface Module{
    id?: string;
    codeModule: string;
    titreModule: string;
    description: string;
    responsableModule: string
    createdBy: string;
    updatedBy: string;
    responsable?: User;
    createdAt: Date;
    updatedAt: Date;
}