import express from "express";
import { requireLogin } from "../controllers/auth.controller";
import {
  create,
  expenseByID,
  isOwner,
  listByUser,
  update,
  remove
} from "../controllers/expense.controller";
const router = express.Router();
router.route("/").get(requireLogin, listByUser).post(requireLogin, create);
router.route("/:expenseId").put(requireLogin, isOwner, update).delete(requireLogin, isOwner, remove);
router.param("expenseId", expenseByID);
export default router;
