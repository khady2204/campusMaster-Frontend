export interface Semestre {
    id?: string;
    nom: string;
    description: string;
    annee: string;
    createdBy: string | object;
    createdAt: Date;
    updatedAt: Date;
    updatedBy: string;
}