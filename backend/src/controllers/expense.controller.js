import errorHandler from "../helpers/dbErrorHandler";
import Expense from "../models/expense.model";
export const listByUser = async (req, res) => {
  const firstDay = req.query.firstDay;
  const lastDay = req.query.lastDay;
  console.log("FirstDay", firstDay);
  console.log("LastDay", lastDay);
  try {
    let expenses = await Expense.find({
      $and: [
        { incurredOn: { $gte: firstDay, $lte: lastDay } },
        { owner: req.auth._id },
      ],
    })
      .sort("incurredOn")
      .populate("owner", "_id name");
    return res.json(expenses);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};
