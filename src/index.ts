import {config} from "dotenv";
config();
import express from "express";
import {AuthController} from "./controllers/auth.controller";

const app = express();

const authController = new AuthController();
app.use('/auth', authController.buildRouter());

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});