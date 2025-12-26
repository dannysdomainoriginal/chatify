import "dotenv/config"
import { Server } from "socket.io";
import { createServer } from "http";
import express from "express"
import { SocketData } from "types/socket";
import socketAuthMiddleware from "@/middlewares/socket-auth.middleware";

// * Features being implemented with Socket
// todo OnlineUsers
// todo Realtime Messages

const app = express()
const server = createServer(app)

const io = new Server<any, any, any, SocketData>(server, {
  cors: {
    origin: [process.env.CLIENT_URL],
    credentials: true
  },
});

io.on("connection", (socket) => {
  socket.emit("hello", "world")
  io.to("room-101").emit("foo", socket.data.user)
})

// apply authentication middleware to all socket connections
io.use(socketAuthMiddleware)

// Store online users: Map<userId, socketId>
const userSocketMap = new Map();

io.on("connection", (socket) => {
  const { userId, user } = socket.data;

  console.log("A user connected", user.fullName);
  userSocketMap.set(userId, socket.id);

  // Emit online users (array of userIds)
  io.emit("getOnlineUsers", Array.from(userSocketMap.keys()));

  socket.on("disconnect", () => {
    console.log("A user disconnected", user.fullName);
    userSocketMap.delete(userId);

    io.emit("getOnlineUsers", Array.from(userSocketMap.keys()));
  });
});

export { io, app, server }