import express from "express";
import { login, logout } from "../controllers/auth.controller";
const router = express.Router();
router.route("/login").post(login);
router.route("/logout").get(logout);
export default router;
