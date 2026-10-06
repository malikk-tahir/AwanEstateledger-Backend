import express from "express";
const router = express.Router();
import { loginUser, logout, getCurrentUser } from "./userControllers.js";
import { isAuthenticatedUser } from "../../middleware/auth.js";

router.route("/login").post(loginUser);
router.route("/logout").post(logout);
router.route("/me").get(isAuthenticatedUser, getCurrentUser);

export default router;
