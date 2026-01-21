import { User } from "../user/user.model";
import { Devoir } from "./devoir";

export interface Remise {
    id: string;
    devoirId: Devoir;
    etudiantId: User;
    libelle: string;
    urlFichier: string;
    dateRemise: Date;
    commentaire: string;
    etat: 'REMIS' | 'NON_REMIS' | 'RETARDE';
    version: number;
    createdAt: Date;
    updatedAt: Date
}