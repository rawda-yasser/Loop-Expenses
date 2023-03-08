import request from "supertest";
import server from "../server";
import { authHeader, user1 } from "../utils/seedFn";
import Expense from "../models/expense.model";
describe("get /api/expenses/", () => {
  test("get all expenses for user1", async () => {
    const date = new Date(),
      y = date.getFullYear(),
      m = date.getMonth();
    const firstDay = new Date(y, m, 1);
    const lastDay = new Date(y, m + 1, 0);
    const response = await request(server)
      .get(`/api/expenses?firstDay=${firstDay}&lastDay=${lastDay}`)
      .set("authorization", authHeader)
      .expect(200)
      .expect("Content-Type", /json/);
    expect(response.body).toHaveLength(3);
  });
});

describe("post /api/expenses/", () => {
  test("create an expense for user1", async () => {
    const response = await request(server)
      .post("/api/expenses")
      .send({
        title: "test expenses",
        category: "test category",
        amount: 100,
        notes: "Hello world",
        owner: user1,
      })
      .set("authorization", authHeader)
      .expect(201)
      .expect("Content-Type", /json/);
      expect(response.body.message).toEqual("Expense created successfully");
      const allExpensesForUser1 = await Expense.find({owner:user1._id});
      expect(allExpensesForUser1).toHaveLength(4)
      
  });
});
