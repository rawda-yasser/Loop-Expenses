import express from "express";
import { requireLogin, hasAuthorization } from "../controllers/auth.controller";
import { create, listByUser } from "../controllers/expense.controller";
const router = express.Router();
router.route("/").get(requireLogin, listByUser).post(requireLogin, create);
export default router;
