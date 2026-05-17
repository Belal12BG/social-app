// routes/relationships.js
import express from "express";
import { getFollowers, getFollowing, followUser, unfollowUser } from "../controllers/relationships.js";
import { verifyToken } from "../middleware/auth.js";
const router = express.Router();
router.get("/:userId/followers", verifyToken, getFollowers);
router.get("/:userId/following", verifyToken, getFollowing);
router.post("/:userId/follow", verifyToken, followUser);
router.delete("/:userId/unfollow", verifyToken, unfollowUser);
export default router;
