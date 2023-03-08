import request from "supertest";
import server from "../server";
import { authHeader, expense1, user1 } from "../utils/seedFn";
import Expense from "../models/expense.model";
// beforeAll(() => {
//   jest.useFakeTimers("modern");
//   jest.setSystemTime(new Date(2022, 3, 8));
// });

// afterAll(() => {
//   jest.useRealTimers();
// });
describe("Expenses reports", () => {
  test("get /api/expenses/monthly-preview", async () => {
    const response = await request(server)
      .get("/api/expenses/monthly-preview")
      .set("authorization", authHeader)
      .expect(200)
      .expect("Content-Type", /json/);
    expect(response.body).toEqual({
      month: { _id: "currentMonth", totalSpent: 400 },
      yesterday: { _id: "yesterday", totalSpent: 400 },
    });
  });
  test("get /api/expenses/expenses-by-category", async () => {
    const response = await request(server)
      .get("/api/expenses/expenses-by-category")
      .set("authorization", authHeader)
      .expect(200)
      .expect("Content-Type", /json/);

    expect(response.body).toEqual(
      expect.arrayContaining([
        { category: "Internet", total: 100, average: 100 },
        { category: "Rent", total: 200, average: 200 },
        { category: "Food", total: 100, average: 100 },
      ])
    );
  });
});
