import express from "express";
import { requireLogin } from "../controllers/auth.controller";
import {
  create,
  expenseByID,
  isOwner,
  listByUser,
  update,
  remove,
  read,
  currentMonthlyPreview,
  expenseByCategory,
  averageByCategory,
  yearlyExpenses,
  plotExpenses,
} from "../controllers/expense.controller";
const router = express.Router();
router.route("/monthly-preview").get(requireLogin, currentMonthlyPreview);
router.route("/expenses-by-category").get(requireLogin, expenseByCategory);
router.route("/average-by-category").get(requireLogin, averageByCategory);
router.route("/plot").get(requireLogin, plotExpenses);
router.route("/yearly").get(requireLogin, yearlyExpenses);
router
  .route("/:expenseId")
  .put(requireLogin, isOwner, update)
  .delete(requireLogin, isOwner, remove)
  .get(requireLogin, isOwner, read);

router.route("/").get(requireLogin, listByUser).post(requireLogin, create);
router.param("expenseId", expenseByID);
export default router;
