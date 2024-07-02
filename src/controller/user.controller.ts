import { Request, Response } from "express";
import User from "../entities/user.model";
import { CommonResponse } from "../entities/common.model";
import ChatMessage from "../entities/chat-message.model";
import { Op } from "sequelize";

export class UserController {
    registerUser = async (req: Request, res: Response) => {
        const response = new CommonResponse();
        try {
            const { username, email, password }: any = req.body;
            if (await User.findOne({ where: { email } })) {
                response.message = "User already exists.";
                response.status = 400;
                return;
            }

            const newUser = await User.create({ username, email: email.toLowerCase(), password });
            response.message = "User registered successfully.";
            response.data = newUser;
            response.status = 200;
            response.success = true;
        } catch (error) {
            response.message = error.message;
            response.status = 400;
        } finally {
            res.status(response.status).send(response);
        }
    }
    loginUser = async (req: Request, res: Response) => {
        const response = new CommonResponse();
        try {
            let { email, password }: any = req.body;
            email = email.toLowerCase()
            if (!(await User.findOne({ where: { email } }))) {
                response.message = "User not registered";
                response.status = 400;
                return;
            }
            const userData = await User.findOne({ where: { email: email, password } })
            if (!userData) {
                response.message = "Invalid credentials";
                response.status = 400;
                return;
            }
            response.message = "User logged in successfully.";
            response.data = userData;
            response.status = 200;
            response.success = true;
        } catch (error) {
            response.message = error.message;
            response.status = 400;
        } finally {
            res.status(response.status).send(response);
        }
    }

    initMessage = async (req: Request, res: Response) => {
        const response = new CommonResponse();
        try {
            const { senderId, receiverId } = req.body;
            const userData = await ChatMessage.findAll(
                {
                    where:
                    {
                        [Op.or]:
                            [{
                                receiverId,
                                senderId
                            },
                            {
                                senderId: receiverId,
                                receiverId: senderId
                            }]
                    },
                    include: [
                        { model: User, as: 'senderDetails', attributes: ['id', 'username', 'email'] },
                        { model: User, as: 'receiverDetails', attributes: ['id', 'username', 'email'] }
                    ]
                });
            response.message = "User logged in successfully.";
            response.data = userData;
            response.status = 200;
            response.success = true;
        } catch (error) {
            response.message = error.message;
            response.status = 400;
        } finally {
            res.status(response.status).send(response);
        }
    }
    allUsers = async (req: Request, res: Response) => {
        const response = new CommonResponse();
        try {
            const userData = await User.findAll({});
            response.message = "User get successfully.";
            response.data = userData;
            response.status = 200;
            response.success = true;
        } catch (error) {
            response.message = error.message;
            response.status = 400;
        } finally {
            res.status(response.status).send(response);
        }
    }
}
