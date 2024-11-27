import {NextFunction, Request, Response, RequestHandler} from "express";
import {MongooseService} from "../services";
import {Session} from "../models";

declare module 'express' {
    interface Request {
        session?: Session;
    }
}

export function sessionMiddleware(): RequestHandler {

    return async (req: Request, res: Response, next: NextFunction) => {
        const authorization = req.headers.authorization;
        if(!authorization) {
            res.status(401).end();
            return;
        }
        const authorizationSplit = authorization.split(" ");
        if(authorizationSplit.length !== 2 || authorizationSplit[0] !== 'Bearer') {
            res.status(401).end();
            return;
        }
        const token = authorizationSplit[1];
        const mongooseService = await MongooseService.get();
        let session = await mongooseService.sessionService.findActiveSession(token);
        if(session === null) {
            res.status(401).end();
            return;
        }
        if(session.expirationDate) {
            session = await mongooseService.sessionService.increaseExpirationDate(session._id);
        }
        req.session = session === null ? undefined : session;
        next();
    }
}