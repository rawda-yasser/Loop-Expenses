import request from "supertest";
import server from "../server";
import { authHeader, expense1, user1 } from "../utils/seedFn";
import Expense from "../models/expense.model";

beforeEach(() => {
  // const DATE_TO_USE = new Date("2023-03-15");
  // const _Date = Date;
  // global.Date = jest.fn(() => DATE_TO_USE);
  // global.Date.UTC = _Date.UTC;
  // global.Date.parse = _Date.parse;
  // global.Date.now = _Date.now;
  // global.Date.setDate = _Date.setDate;
  // global.Date.getDate = _Date.getDate;
  // console.log(new Date());
});

// afterAll(() => {

//   dateNowSpy.mockRestore();
// });
// beforeAll(() => {
//   jest.useFakeTimers("modern");
//   jest.setSystemTime(new Date(2022, 3, 8));
//   console.log("today", new Date());
// });

// afterAll(() => {
//   jest.useRealTimers();
// });
describe("Expenses reports", () => {
  test.skip("get /api/expenses/monthly-preview", async () => {
    const response = await request(server)
      .get("/api/expenses/monthly-preview")
      .set("authorization", authHeader)
      .expect(200)
      .expect("Content-Type", /json/);

    console.log("MONTHLY PREVIEW", response.body);
    expect(response.body).toEqual({
      month: { _id: "currentMonth", totalSpent: 400 },
      today: { _id: "today", totalSpent: 300 },
      yesterday: { _id: "yesterday", totalSpent: 100 },
    });
  });
  test.skip("get /api/expenses/expenses-by-category", async () => {
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
  test.skip("get /api/expenses/average-by-category", async () => {
    const date = new Date();
    // y = date.getFullYear(),
    // m = date.getMonth();
    // const firstDay = new Date(y, m, 1);
    // const lastDay = new Date(y, m + 1, 0);
    const firstDay = new Date(2023, 3, 1);
    const lastDay = new Date(2023, 3, 16);
    const response = await request(server)
      .get(
        `/api/expenses/average-by-category?firstDay=${firstDay}&lastDay=${lastDay}`
      )
      .set("authorization", authHeader)
      .expect(200)
      .expect("Content-Type", /json/);

    expect(response.body).toEqual(
      expect.arrayContaining([
        { _id: "Rent", x: "Rent", y: 200 },
        { _id: "Food", x: "Food", y: 100 },
        { _id: "Internet", x: "Internet", y: 100 },
      ])
    );
  });
  test.skip("get /api/expenses/plot", async () => {
    const m = 3;
    const response = await request(server)
      .get(`/api/expenses/plot?month=${m}`)
      .set("authorization", authHeader)
      .expect(200)
      .expect("Content-Type", /json/);
    expect(response.body).toHaveLength(3);
    console.log("PLOT...............", response.body);
    // expect(response.body[0].x).toEqual(7);
  });
  test.skip("get /api/expenses/yearly", async () => {
    const y = 2023;
    const response = await request(server)
      .get(`/api/expenses/plot?year=${y}`)
      .set("authorization", authHeader)
      .expect(200)
      .expect("Content-Type", /json/);
    console.log("YEARLY............", response.body);
    expect(response.body).toHaveLength(3);
    expect(response.body[0].y).toEqual(100);
  });
});
