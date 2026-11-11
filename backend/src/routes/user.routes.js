import express from "express";
import { clerkClient, getAuth } from "@clerk/express";
import User from "../models/User.js";
import { protectRoute } from "../middleware/auth.js";

const router = express.Router();

// Upserts the signed-in Clerk user into MongoDB. The frontend calls this after login,
// which keeps MongoDB in sync even when the webhook can't reach localhost.
router.post("/sync", async (req, res) => {
    try {
        const { userId } = getAuth(req);
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const clerkUser = await clerkClient.users.getUser(userId);

        const email = (
            clerkUser.emailAddresses.find((e) => e.id === clerkUser.primaryEmailAddressId) ??
            clerkUser.emailAddresses[0]
        )?.emailAddress;

        if (!email) {
            return res.status(400).json({ message: "Clerk user is missing an email address" });
        }

        const fullname =
            [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") ||
            clerkUser.username ||
            email.split("@")[0] ||
            "User";

        const user = await User.findOneAndUpdate(
            { clerkId: userId },
            {
                $set: { email, fullname, profilePic: clerkUser.imageUrl || "" },
                $setOnInsert: { clerkId: userId },
            },
            { upsert: true, returnDocument: "after", runValidators: true }
        );

        return res.status(200).json(user);
    } catch (error) {
        console.error("User sync failed:", error);
        return res.status(500).json({ message: "Failed to sync user" });
    }
});

router.get("/me", protectRoute, (req, res) => {
    return res.status(200).json(req.user);
});

export default router;
