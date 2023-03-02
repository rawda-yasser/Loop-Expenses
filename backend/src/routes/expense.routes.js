import express from "express";
import { requireLogin } from "../controllers/auth.controller";
import {
  create,
  expenseByID,
  isOwner,
  listByUser,
  update,
} from "../controllers/expense.controller";
const router = express.Router();
router.route("/").get(requireLogin, listByUser).post(requireLogin, create);
router.route("/:expenseId").put(requireLogin, isOwner, update);
router.param("expenseId", expenseByID);
export default router;
