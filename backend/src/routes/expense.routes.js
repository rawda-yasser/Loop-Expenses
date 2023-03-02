import express from "express";
import { requireLogin, hasAuthorization } from "../controllers/auth.controller";
import { listByUser } from "../controllers/expense.controller"
const router = express.Router();
router.route("/").get(requireLogin, listByUser);
export default router;
