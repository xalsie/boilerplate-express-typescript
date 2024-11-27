import express, {Router, Request, Response} from "express";
import {MongooseService} from "../services";
import {SecurityUtils} from "../utils";
import {sessionMiddleware} from "../middlewares/session.middleware";

export class AuthController {

    async subscribe(req: Request, res: Response) {
        if(!req.body ||
            typeof req.body.firstName !== "string" ||
            typeof req.body.lastName !== "string" ||
            typeof req.body.email !== "string" ||
            typeof req.body.password !== "string") {
            res.status(400).end();
            return;
        }
        const mongooseService = await MongooseService.get();
        try {
            const user = await mongooseService.userService.createUser({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                password: SecurityUtils.sha512(req.body.password),
                birthDate: new Date(req.body.birthDate),
            });
            res.status(201).json(user);
        } catch (error) {
            if(error instanceof Error &&
                error.name === "MongoServerError" &&
                error.message.startsWith('E11000 duplicate key')) {
                res.status(409).end();
                return;
            }
            res.status(500).end();
        }
    }

    async login(req: Request, res: Response) {
        if(!req.body ||
            typeof req.body.email !== "string" ||
            typeof req.body.password !== "string") {
            res.status(400).end();
            return;
        }
        const mongooseService = await MongooseService.get();
        const user = await mongooseService.userService.findUser(
            req.body.email,
            SecurityUtils.sha512(req.body.password)
        );
        if(user === null) {
            res.status(404).end();
            return;
        }
        const session = await mongooseService.sessionService.createSession({
            user: user,
            userAgent: req.header("user-agent") || 'unknown',
            expirationDate: new Date( (new Date().getTime()) + 1_296_000_000),
        });
        res.status(201).json(session);
    }

    async me(req: Request, res: Response) {
        res.json(req.session!.user);
    }

    buildRouter(): Router {
        const router = Router();
        router.post('/subscribe', express.json(), this.subscribe.bind(this));
        router.post('/login', express.json(), this.login.bind(this));
        router.get('/me', sessionMiddleware(), this.me.bind(this));
        return router;
    }
}