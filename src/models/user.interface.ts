import {Timestamps} from "./timestamps.interface";

export interface User extends Timestamps {
    _id: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    birthDate?: Date;
}