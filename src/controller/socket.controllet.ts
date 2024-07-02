import { Server as SocketIOServer } from 'socket.io'
import ChatMessage from '../entities/chat-message.model';
import { Op } from 'sequelize';
import User from '../entities/user.model';
export class SocketConnection {
    constructor(io: SocketIOServer) {
        io.on('connection', (socket) => {
            console.log('A user connected');

            socket.on('joinRoom', async (data) => {
                const { receiverId, senderId } = data;
                socket.join(senderId + "_" + receiverId); // Join a room/channel identified by receiverId
                console.log(senderId + "_" + receiverId);
            })

            socket.on('leaveRoom', (data) => {
                const { receiverId, senderId } = data;
                socket.leave(senderId + "_" + receiverId);
                console.log(senderId + "_" + receiverId);
            })

            socket.on('typing_ping', (data) => {
                const { receiverId, senderId, status } = data;
                socket.to(receiverId + "_" + senderId).emit('typing_ping_receiver', { status });
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
                io.to(data.senderId + "_" + data.receiverId).to(data.receiverId + "_" + data.senderId).emit('chat-message', newUserAdd); // Broadcast the message to all connected clients
            });
        });
    }
}