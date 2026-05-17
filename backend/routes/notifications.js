import express from "express";
import { getNotifications, markAllRead, getUnreadCount } from "../controllers/notifications.js";
import { verifyToken } from "../middleware/auth.js";
const router = express.Router();
router.get("/", verifyToken, getNotifications);
router.get("/unread-count", verifyToken, getUnreadCount);
router.put("/mark-read", verifyToken, markAllRead);
export default router;
