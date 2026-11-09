import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
const server = http.createServer(app);

const allowOrigin = process.env.FRONTEND_URL || "http://localhost:5173";
const io = new Server(server, {cors : {origin : [allowedOrigin]}});

io.on("connection", (socket)=> {
    const userId = socket.handshake.query.userId;

    function getReceiverSocketId(userId) {
        return userSocketMap[userId];
    }

    if(userId) userSocketMap[userId] = socket.id;
    io.emit("getOnlineUsers", Object.keys(userSocketMap)); // sends the list of online users to all connected clients

   // socket.on is used to listen for events
    socket.on("disconnect", ()=>{
        if(userId) delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap)); // sends the updated list of online users to all connected clients
    })
})

export {app, io, server, getReceiverSocketId};