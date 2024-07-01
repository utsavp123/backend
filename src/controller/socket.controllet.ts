import { Server as SocketIOServer } from 'socket.io'
import ChatMessage from '../entities/chat-message.model';
import { Op } from 'sequelize';
import User from '../entities/user.model';
export class SocketConnection {
    constructor(io: SocketIOServer) {
        io.on('connection', (socket) => {
            // let receiverIdTemp = 0;
            // let receivesenderIdrIdTemp = 0;
            console.log('A user connected');

            socket.on('joinRoom', async (data) => {
                const { receiverId, senderId } = data;
                socket.join(senderId + "_" + receiverId); // Join a room/channel identified by receiverId
                console.log(senderId + "_" + receiverId);
                
                // receiverIdTemp = senderId
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
                socket.emit('all-message', userData);
            })

            socket.on('leaveRoom', (data) => {
                const { receiverId, senderId } = data;
                socket.leave(senderId + "_" + receiverId);
                console.log(senderId + "_" + receiverId);
            })

            // Example: Handle a custom event from the client
            socket.on('chat-message', async (data) => {

                console.log('Message from client:', data);
                let newUserData = await ChatMessage.create(data);
                let newUserAdd = await ChatMessage.findOne({
                    where:
                        { id: newUserData.dataValues.id },
                    include: [
                        { model: User, as: 'senderDetails', attributes: ['id', 'username', 'email'] },
                        { model: User, as: 'receiverDetails', attributes: ['id', 'username', 'email'] }
                    ]
                });
                // if(receiverIdTemp == newUser.senderId){
                io.to(data.senderId + "_" + data.receiverId).to(data.receiverId + "_" + data.senderId).emit('chat-message', newUserAdd); // Broadcast the message to all connected clients
                // }
                // if(receiverIdTemp == newUser.receiverId){
                // io.to(data.receiverId + "_" + data.senderId).emit('chat-message', newUser); // Broadcast the message to all connected clients
                // }
            });
        });
    }
}