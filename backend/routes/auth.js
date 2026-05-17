// routes/auth.js
import express from "express";
import { register, login, logout, verifyEmail } from "../controllers/auth.js";
const router = express.Router();
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/verify/:token", verifyEmail);
export default router;
