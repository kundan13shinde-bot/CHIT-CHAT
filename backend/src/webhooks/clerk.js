import express from "express";
import { verifyWebhook } from "@clerk/express/webhooks";
import User from "../models/User.js";

const router = express.Router();

const toUserFields = (data) => {
    const primary = data.email_addresses?.find(
        (e) => e.id === data.primary_email_address_id
    ) ?? data.email_addresses?.[0];

    const fullname =
        [data.first_name, data.last_name].filter(Boolean).join(" ") ||
        data.username ||
        primary?.email_address?.split("@")[0] ||
        "User";

    return {
        email: primary?.email_address,
        fullname,
        profilePic: data.image_url || "",
    };
};

// Mounted with express.raw() in app.js — Clerk needs the unparsed body to verify the signature.
router.post("/", async (req, res) => {
    if (!process.env.CLERK_WEBHOOK_SECRET) {
        return res.status(503).json({ message: "Webhook secret is not provided" });
    }

    let evt;
    try {
        evt = await verifyWebhook(req, {
            signingSecret: process.env.CLERK_WEBHOOK_SECRET,
        });
    } catch (error) {
        console.error("Clerk webhook verification failed:", error.message);
        return res.status(400).json({ message: "Invalid webhook signature" });
    }

    try {
        switch (evt.type) {
            case "user.created":
            case "user.updated":
                await User.findOneAndUpdate(
                    { clerkId: evt.data.id },
                    { $set: toUserFields(evt.data), $setOnInsert: { clerkId: evt.data.id } },
                    { upsert: true, new: true, runValidators: true }
                );
                break;
            case "user.deleted":
                await User.deleteOne({ clerkId: evt.data.id });
                break;
            default:
                break;
        }
        return res.status(200).json({ received: true });
    } catch (error) {
        console.error("Clerk webhook handler failed:", error);
        return res.status(500).json({ message: "Webhook handler failed" });
    }
});

export default router;
