import express from "express";
import dotenv from "dotenv/config"
import cors from "cors";
import clerkWebhook from "./webhooks/clerk.js";
import userRoutes from "./routes/user.routes.js";
import { ConnectDB } from "./lib/db.js";

import authRoutes from "./routes/auth.js";
import messageRoutes from "./routes/message.route.js";
import {app, server} from "lib/socket.js";

import { clerkMiddleware } from "@clerk/express";

const PORT = process.env.PORT || 3000;
const FRONTEND_URL = process.env.FRONTEND_URL;

app.use("/api/webhooks/clerk", express.raw({type : "application/json"}), clerkWebhook);

app.use(express.json())
app.use(cors({origin : FRONTEND_URL, credentials:true}))

app.use(clerkMiddleware())

app.use("/api/users", userRoutes)
app.use("/api/auth", authRoutes)
app.use("/api/messages", messageRoutes );

app.get("/health", (req,res) => {
res.status(200).json({ok:true})
})

const startServer = async () => {
  try {
    await ConnectDB();

    server.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();