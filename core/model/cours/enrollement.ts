import {Module} from "../cours/module";
import { User } from "../user/user.model";

export interface Enrollement {
    id?: string;
    etudiantId: string;
    etudiant?: User;
    moduleId: string;
    module?: Module;
    dateCreation?: Date;
    updatedAt?: Date;
    createdBy: string;
    updatedBy?: string;
}