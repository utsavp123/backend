import dotenv from "dotenv";
import express from "express";
import fs from "fs";
import morgan from "morgan";
// import path from "path";
import http from "http";
import path from 'path';
import { fileURLToPath } from 'url';

import { Server as SocketIOServer } from 'socket.io';
import cors from "cors";
import { connection } from "./src/config/sequelize"; // Assuming this sets up Sequelize and connects to the database
import userRoute from "./src/router/user.route"; // Assuming this is where your user route is defined
import { SocketConnection } from "./src/controller/socket.controllet";

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server);
dotenv.config();
const __filename: any = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 3030;
// Socket.IO event handling
app.use(express.static(path.join(__dirname, 'src/public')));

// Routes



// Sequelize database connection
connection();
const socket = new SocketConnection(io);
// app.get('/', function (request, response) {
//     response.sendFile('chat-app/index.html', { root: __dirname });
// });
// Middleware to parse JSON bodies
app.use(cors());
app.use(express.json());

// Middleware to parse URL-encoded bodies (if needed)
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/api/user', userRoute);
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/public', 'index.html'));
});
// Start the server
server.listen(PORT, () => {
    console.log(`server is runing ${PORT}`)
})
