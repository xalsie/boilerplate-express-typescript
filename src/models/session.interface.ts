import {Timestamps} from "./timestamps.interface";
import {User} from "./user.interface";

export interface Session extends Timestamps {
    _id: string;
    expirationDate?: Date;
    userAgent: string;
    user: string | User;
}