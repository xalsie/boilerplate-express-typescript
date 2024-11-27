import {Schema} from "mongoose";
import {User} from "../../../models";

export const userSchema = new Schema<User>({
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    birthDate: {
        type: Date
    }
}, {
    timestamps: true,
    collection: 'users',
    versionKey: false
});