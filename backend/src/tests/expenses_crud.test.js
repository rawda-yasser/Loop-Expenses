import request from "supertest";
import server from "../server";
import { authHeader } from "../utils/seedFn";

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
