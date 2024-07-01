import express from "express";
import { UserController } from "../controller/user.controller";

const app = express();
const userController = new UserController();

app.post('/registerUser', userController.registerUser);
app.post('/loginUser', userController.loginUser);
app.get('/allUser', userController.allUsers);
app.post('/initMessage', userController.initMessage);

export default app;
