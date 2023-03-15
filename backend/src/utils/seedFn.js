import User from "../models/user.model";
import Expense from "../models/expense.model";
import jwt from "jsonwebtoken";
let user1, user2, expense1, expense2, expense3, authHeader, validAuth;
import config from "../config";
const seedUsers = async () => {
  user1 = new User({
    name: "Rawda Yasser",
    email: "rawda@test.com",
    password: "rawda@test.com",
  });
  await user1.save();
  user2 = new User({
    name: "Rawda Yasser2",
    email: "rawda2@test.com",
    password: "rawda2@test.com",
  });
  await user2.save();
  validAuth = jwt.sign({ _id: user1._id }, config.jwtSecret);

  authHeader = `Bearer ${validAuth}`;
  // console.log(authHeader);
  // const users = await User.find({});
  // console.log(users);
};
const seedExpenses = async () => {
  expense1 = new Expense({
    title: "Restaurants",
    category: "Food",
    amount: 100,
    // incurredOn: new Date(new Date().valueOf() - 1000 * 60 * 60 * 24),
    incurredOn: new Date("2023-03-14"),
    notes: "Hello world",
    owner: user1,
  });
  await expense1.save();
  expense2 = new Expense({
    title: "Rent",
    category: "Rent",
    amount: 200,
    notes: "Hello world",
    incurredOn: new Date("2023-03-15"),
    owner: user1,
  });
  await expense2.save();

  expense3 = new Expense({
    title: "Internet connection",
    category: "Internet",
    incurredOn: new Date("2023-03-15"),
    amount: 100,
    notes: "Hello world",
    owner: user1,
  });
  await expense3.save();
  // const expenses = await Expense.find({});
  // console.log(expenses);
};
const seedData = async () => {
  console.log("Seed Data");
  await seedUsers();
  await seedExpenses();
};
export { seedData, authHeader, user1, user2, expense1, expense2, expense3 };
