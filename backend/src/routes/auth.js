import express from "express";
import { checkAuth } from "../controllers/auth.js";

const router = express.Router();

router.get("/check", protectRoute ,checkAuth);

export default router;
