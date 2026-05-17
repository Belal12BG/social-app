import express from "express";
import { getConversations, createConversation, getMessages, sendMessage } from "../controllers/messages.js";
import { verifyToken } from "../middleware/auth.js";
const router = express.Router();
router.get("/conversations", verifyToken, getConversations);
router.post("/conversations", verifyToken, createConversation);
router.get("/conversations/:conversationId", verifyToken, getMessages);
router.post("/conversations/:conversationId", verifyToken, sendMessage);
export default router;
