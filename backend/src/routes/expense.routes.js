import express from "express";
import { requireLogin } from "../controllers/auth.controller";
import {
  create,
  expenseByID,
  isOwner,
  listByUser,
  update,
  remove,
  currentMonthlyPreview
} from "../controllers/expense.controller";
const router = express.Router();
router.route("/").get(requireLogin, listByUser).post(requireLogin, create);
router.route("/:expenseId").put(requireLogin, isOwner, update).delete(requireLogin, isOwner, remove);
router.route("/monthly-preview").get(requireLogin, currentMonthlyPreview)
router.param("expenseId", expenseByID);
export default router;
