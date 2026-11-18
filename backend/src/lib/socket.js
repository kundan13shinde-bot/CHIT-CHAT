import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);

const allowedOrigin = process.env.FRONTEND_URL || "http://localhost:5173";
const io = new Server(server, {
  cors: {
    origin: [allowedOrigin, "http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true,
  },
});

const userSocketMap = {};

export function getReceiverSocketId(userId) {
  return userSocketMap[String(userId)];
}

io.on("connection", (socket) => {
  const rawUserId = socket.handshake.query.userId;
  const userId =
    typeof rawUserId === "string" && rawUserId.trim() !== "" && rawUserId !== "undefined"
      ? String(rawUserId.trim())
      : null;

  if (userId) {
    userSocketMap[userId] = socket.id;
  }

  // Broadcast list of currently online user IDs to all connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // Private relay for real-time typing indicators
  socket.on("typing", ({ senderId, receiverId }) => {
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("userTyping", { senderId });
    }
  });

  socket.on("stopTyping", ({ senderId, receiverId }) => {
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("userStoppedTyping", { senderId });
    }
  });

  socket.on("disconnect", () => {
    if (userId && userSocketMap[userId] === socket.id) {
      delete userSocketMap[userId];
    }
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { app, io, server };