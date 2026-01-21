import { User } from "../user/user.model";
import { Module } from "./module";
import { Support } from "./support";

export interface Cours {
    id: string;
    titre: string;
    contenuTextuel: string;
    ordre: number;
    moduleId: string;
    module: Module;
    enseigantId: User;
    enseignant: User;
    supports: Support[];
    createdAt: Date;
    updatedAt: Date;
}