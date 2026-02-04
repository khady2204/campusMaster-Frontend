import { Module } from "./module";
import { Semestre } from "./semestre";

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
}