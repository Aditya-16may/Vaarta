const http = require("http");
const { Server } = require("socket.io");
const express = require("express")
const { socketAuthMiddleware } = require("../middlewares/socketAuthMiddleware");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: [process.env.CLIENT_URL],
        credentials: true,
    }
});

io.use(socketAuthMiddleware);

const userSocketMap = {};

io.on("connection", (socket) => {
    const userId = socket.userId;
    userSocketMap[userId] = socket.id; 

    io.emit("userOnline", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
        delete userSocketMap[userId];
        io.emit("userOffline", Object.keys(userSocketMap));
    });
});

module.exports =  { server, io, app };