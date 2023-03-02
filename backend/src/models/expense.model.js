import mongoose from "mongoose";
const expenseSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: "Please enter the expense's title",
  },
  category: {
    type: String,
    trim: true,
    required: "Please enter expense's category",
  },
  amount: {
    type: Number,
    min: 0,
    required: "Please enter the expense's amount",
  },
  incurredOn: {
    type: Date,
    default: Date.now(),
  },
  notes: {
    type: String,
    trim: true,
  },
  updated: Date,
  created: {
    type: Date,
    default: Date.now(),
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
});
export default mongoose.model("Expense", expenseSchema);
