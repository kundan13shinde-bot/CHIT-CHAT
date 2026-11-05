import express from "express";
import { clerkClient, getAuth, requireAuth } from "@clerk/express";
import User from "../models/User.js";

const router = express.Router();

// Upserts the signed-in Clerk user into MongoDB. The frontend calls this after login,
// which keeps MongoDB in sync even when the webhook can't reach localhost.
router.post("/sync", requireAuth(), async (req, res) => {
    try {
        const { userId } = getAuth(req);
        const clerkUser = await clerkClient.users.getUser(userId);

        const email = (
            clerkUser.emailAddresses.find((e) => e.id === clerkUser.primaryEmailAddressId) ??
            clerkUser.emailAddresses[0]
        )?.emailAddress;

        const fullname =
            [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") ||
            clerkUser.username ||
            email?.split("@")[0] ||
            "User";

        const user = await User.findOneAndUpdate(
            { clerkId: userId },
            { $set: { email, fullname, profilePic: clerkUser.imageUrl || "" } },
            { upsert: true, new: true, runValidators: true }
        );

        res.status(200).json(user);
    } catch (error) {
        console.error("User sync failed:", error);
        res.status(500).json({ message: "Failed to sync user" });
    }
});

router.get("/me", requireAuth(), async (req, res) => {
    const { userId } = getAuth(req);
    const user = await User.findOne({ clerkId: userId });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
});

export default router;
