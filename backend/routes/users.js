import express from "express";
import { getUser, updateUser, searchUsers, getSuggestedUsers } from "../controllers/users.js";
import { verifyToken } from "../middleware/auth.js";
const router = express.Router();
router.get("/search", verifyToken, searchUsers);
router.get("/suggestions", verifyToken, getSuggestedUsers);
router.get("/:userId", verifyToken, getUser);
router.put("/:userId", verifyToken, updateUser);
export default router;
