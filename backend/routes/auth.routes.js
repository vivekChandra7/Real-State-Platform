import express from "express";

import { registerUser, login, forgotPassword, resetPassword, verifyEmail, getMe } from "../controllers/auth.controller.js";
const {protect } = await import("../middlewares/auth.middleware.js");

const authRouter = express.Router();

authRouter.post("/register", registerUser);
authRouter.post("/login", login);
authRouter.get("/me", protect, getMe);
authRouter.post("/verify-email", verifyEmail);
authRouter.post("/forgot-password", forgotPassword);
authRouter.post("/reset-password/:token", resetPassword);

export default authRouter;
