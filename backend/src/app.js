import express from "express";
import dotenv from "dotenv/config"
import cors from "cors";
import User from "./models/User.js";
import { ConnectDB } from "./lib/db.js";

import { clerkMiddleware } from "@clerk/express";

const app = express();
const PORT = process.env.PORT;
const FRONTEND_URL = process.env.PORT;
app.use(express.json())
app.use(cors({origin : FRONTEND_URL, credentials:true}))

app.use(clerkMiddleware())

app.get("/health", (req,res) => {
res.status(200).json({ok:true})
})

app.listen(PORT, () => {
    ConnectDB();
    console.log ("Server is up and running on PORT:", PORT);
});