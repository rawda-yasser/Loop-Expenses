import mongoose from "mongoose";
import errorHandler from "../helpers/dbErrorHandler";
import Expense from "../models/expense.model";
import extend from "lodash/extend";
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
export const create = async (req, res) => {
  try {
    req.body.owner = req.auth._id;
    const newExpense = new Expense(req.body);
    await newExpense.save();
    return res.status(201).json({ message: "Expense created successfully" });
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};
export const expenseByID = async (req, res, next, id) => {
  try {
    const expense = await Expense.findOne({ _id: id }).populate(
      "owner",
      "_id name"
    );

    if (!expense)
      return res.status(404).json({
        message: `Sorry, we couldn't find given the expense`,
      });
    req.expense = expense;
    next();
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
  }
};
export const update = async (req, res) => {
  try {
    let updatedExpense = req.expense;
    console.log(updatedExpense);
    updatedExpense = extend(updatedExpense, req.body);
    console.log(updatedExpense);
    updatedExpense.updated = Date.now();
    await updatedExpense.save();
    return res.json(updatedExpense);
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
  }
};
export const read = async (req, res) => {
  return res.json(req.expense);
};
export const isOwner = (req, res, next) => {
  const authorized =
    req.expense && req.auth && req.expense.owner._id == req.auth._id;
  if (!authorized) {
    return res.status(403).json({ error: "Sorry, you're not authorized" });
  }
  next();
};
export const remove = async (req, res) => {
  try {
    const deletedExpense = await Expense.findByIdAndDelete(req.expense._id);
    return res.json(deletedExpense);
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
  }
};
export const currentMonthlyPreview = async (req, res) => {
  const date = new Date(),
    y = date.getFullYear(),
    m = date.getMonth();
  const firstDay = new Date(y, m, 1);
  const lastDay = new Date(y, m + 1, 0);
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  const tomorrow = new Date();
  tomorrow.setUTCHours(0, 0, 0, 0);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const yesterday = new Date();
  yesterday.setUTCHours(0, 0, 0, 0);
  yesterday.setDate(yesterday.getDate() - 1);
  console.log(firstDay, lastDay, today, tomorrow, yesterday);
  const all = await Expense.find({});
  console.log("ALL", all);
  try {
    let monthlyPreview = await Expense.aggregate([
      {
        $facet: {
          month: [
            {
              $match: {
                incurredOn: { $gte: firstDay, $lt: lastDay },
                owner: new mongoose.Types.ObjectId(req.auth._id),
              },
            },
            {
              $group: { _id: "currentMonth", totalSpent: { $sum: "$amount" } },
            },
          ],
          today: [
            {
              $match: {
                incurredOn: { $gte: today, $lt: tomorrow },
                owner: new mongoose.Types.ObjectId(req.auth._id),
              },
            },
            {
              $group: { _id: "today", totalSpent: { $sum: "$amount" } },
            },
          ],
          yesterday: [
            {
              $match: {
                incurredOn: { $gte: yesterday, $lt: today },
                owner: new mongoose.Types.ObjectId(req.auth._id),
              },
            },
            {
              $group: {
                _id: "yesterday",
                totalSpent: { $sum: "$amount" },
              },
            },
          ],
        },
      },
    ]);
    const result = {
      month: monthlyPreview[0].month[0],
      today: monthlyPreview[0].today[0],
      yesterday: monthlyPreview[0].yesterday[0],
    };
    return res.status(200).json(result);
  
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
  }
  
};
export const expenseByCategory = async (req, res) => {
  const date = new Date(),
    y = date.getFullYear(),
    m = date.getMonth();
  const firstDay = new Date(y, m, 1);
  const lastDay = new Date(y, m + 1, 0);
  // const all = await Expense.find({ owner: req.auth._id });
  // console.log("ALL", all);
  try {
    const summary = await Expense.aggregate([
      {
        $match: {
          incurredOn: {
            $gte: firstDay,
            $lt: lastDay,
          },
          owner: new mongoose.Types.ObjectId(req.auth._id),
        },
      },
      {
        $group: {
          _id: { category: "$category" },
          totalSpent: { $sum: "$amount" },
          averageSpent: { $avg: "$amount" },
        },
      },
      {
        $project: {
          _id: 0,
          category: "$_id.category",
          total: "$totalSpent",
          average: "$averageSpent",
        },
      },
    ]);
    res.json(summary);
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: errorHandler.getErrorMessage(err) });
  }
};
export const plotExpenses = async (req, res) => {
  const date = new Date(),
    y = date.getFullYear(),
    m = date.getMonth();
  date.setMonth(req.query.month);
  console.log("DATE", date);
  const firstDay = new Date(y, m, 1);
  const lastDay = new Date(y, m + 1, 0);
  try {
    const expenses = await Expense.aggregate([
      {
        $match: {
          incurredOn: {
            $gte: firstDay,
            $lt: lastDay,
          },
          owner: new mongoose.Types.ObjectId(req.auth._id),
        },
      },
      { $project: { x: { $dayOfMonth: "$incurredOn" }, y: "$amount" } },
    ]);
    return res.json(expenses);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: errorHandler.getErrorMessage(err) });
  }
};
export const yearlyExpenses = async (req, res) => {
  try {
    const date = new Date();
    const y = req.query.year;
    date.setFullYear(y);
    const firstDay = new Date(y, 0, 1);
    const lastDay = new Date(y, 12, 0);
    const result = await Expense.aggregate([
      {
        $match: {
          incurredOn: {
            $gte: firstDay,
            $lt: lastDay,
          },
          owner: new mongoose.Types.ObjectId(req.auth._id),
        },
      },
      {
        $group: {
          _id: {
            $month: "$incurredOn",
          },
          totalSpent: { $sum: "$amount" },
        },
      },
      {
        $project: {
          x: "$_id",
          y: "$totalSpent",
        },
      },
    ]);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: errorHandler.getErrorMessage(err) });
  }
};
export const averageByCategory = async (req, res) => {
  try {
    const firstDay = new Date(req.query.firstDay);
    const lastDay = new Date(req.query.lastDay);

    const result = await Expense.aggregate([
      {
        $match: {
          owner: new mongoose.Types.ObjectId(req.auth._id),
          incurredOn: {
            $gte: firstDay,
            $lte: lastDay,
          },
        },
      },
      {
        $group: {
          _id: { category: "$category" },
          totalSpent: { $sum: "$amount" },
        },
      },
      {
        $group: {
          _id: "$_id.category",
          averageSpent: { $avg: "$totalSpent" },
        },
      },
      {
        $project: {
          x: "$_id",
          y: "$averageSpent",
        },
      },
    ]);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: errorHandler.getErrorMessage(err) });
    I;
  }
};
