import express from "express";
import http from 'http';
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

const __filename: any = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const port = process.env.PORT || 3030;
// Socket.IO event handling
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


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

// Start the server
server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

