import {Model} from "mongoose";
import {MongooseService} from "./mongoose.service";
import {User} from "../../models/user.interface";
import {userSchema} from "./schema";

export type CreateUser = Omit<User, '_id' | 'createdAt' | 'updatedAt'>;

export class UserService {

    readonly mongooseService: MongooseService;
    readonly model: Model<User>;

    constructor(mongooseService: MongooseService) {
        this.mongooseService = mongooseService;
        const mongoose = this.mongooseService.mongoose;
        this.model = mongoose.model('User', userSchema);
    }

    async createUser(user: CreateUser): Promise<User> {
        const res = await this.model.create(user);
        return res;
    }

    async findUser(email: string, password: string): Promise<User | null> {
        const user = await this.model.findOne({
            email: email,
            password: password
        });
        return user;
    }
}