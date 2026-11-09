import express from "express"
import {getUsersForSidebar} from "../controllers/message.controller.js";
import { protectRoute } from "../middleware/auth.js";
import {getConversationForSidebar} from "../controllers/message.controller.js";
import { getMessages, sendMessage } from "../controllers/message.controller.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

router.get("/users", protectRoute ,getUsersForSidebar);
router.get("/converstation", protectRoute ,getConversationForSidebar);
router.get("/:id", protectRoute , getMessages);
router.post("/:id", protectRoute, upload.single("media"), sendMessage);

export default router;