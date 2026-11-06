import { getAuth } from "@clerk/express";
import User from "../models/User.js";

export const checkAuth = async (req, res) => {
    try {
        const { userId } = getAuth(req);
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const user = await User.findOne({ clerkId: userId });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error("checkAuth failed:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
