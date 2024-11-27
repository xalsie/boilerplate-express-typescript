import {MongooseService} from "./mongoose.service";
import {Model, isValidObjectId} from "mongoose";
import {sessionSchema} from "./schema/session.schema";
import {Session} from "../../models";

export type CreateSession = Omit<Session, '_id' | 'createdAt' | 'updatedAt'>;

export class SessionService {

    readonly mongooseService: MongooseService;
    readonly model: Model<Session>;

    constructor(mongooseService: MongooseService) {
        this.mongooseService = mongooseService;
        const mongoose = this.mongooseService.mongoose;
        this.model = mongoose.model('Session', sessionSchema);
    }

    async createSession(session: CreateSession): Promise<Session> {
        const res = await this.model.create(session);
        return res;
    }

    async findActiveSession(id: string): Promise<Session | null> {
        if(!isValidObjectId(id)) {
            return null;
        }
        const res = await this.model.findOne({
            _id: id,
            $or: [
                {expirationDate: {$exists: false}},
                {expirationDate: {$gt: Date.now()}}
            ]
        }).populate('user');
        return res;
    }

    async increaseExpirationDate(id: string): Promise<Session | null> {
        if(!isValidObjectId(id)) {
            return null;
        }
        const res = await this.model.findOneAndUpdate({
            _id: id
        }, {
            expirationDate: new Date( (new Date().getTime()) + 1_296_000_000)
        }, {
            new: true
        }).populate('user');
        return res;
    }
}