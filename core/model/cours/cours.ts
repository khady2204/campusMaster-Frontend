import { Module } from "./module";
import { Semestre } from "./semestre";
import { Support } from "./support";

export interface Cours {
    id?: string;
    moduleId: string;
    semestreId: string;
    titreCours: string;
    description: string;
    ordre: number;
    typeCours: string;
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
    updatedBy: string;
    module?: Module;
    semestre?: Semestre;
    supports?: Support[];
    enrollements?: string[];
}