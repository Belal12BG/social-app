import express from "express";
import { getComments, addComment, deleteComment } from "../controllers/comments.js";
import { verifyToken } from "../middleware/auth.js";
const router = express.Router();
router.get("/:postId", verifyToken, getComments);
router.post("/:postId", verifyToken, addComment);
router.delete("/:commentId", verifyToken, deleteComment);
export default router;
