import { User } from "../user/user.model";
import { Module } from "./module";
import { Semestre } from "./semestre";
import { Support } from "./support";

export interface Cours {
    id?: string;
    titreCours: string;
    contenuTextuel: string;
    description: string;
    ordre: number;
    typeCours: string;
    moduleId: string;
    module?: Module;
    semestreId: string;
    semestre?: Semestre;
    createdAt: Date;
    updatedAt: Date;
}