import request from "supertest";
import server from "../server";
import User from "../models/user.model";
describe("create accounts", () => {
  test("creating a new account", async () => {
    const response = await request(server)
      .post("/api/users")
      .send({
        email: "test123@test.com",
        name: "test123",
        password: "test123@test.com",
      })
      .expect(200)
      .expect("Content-Type", /json/);
    expect(response.body).toEqual({
      message: "Successfully signed up",
    });
    const user = await User.findOne({ email: "test123@test.com" });
    expect(user.name).toEqual("test123");
    expect(user.email).toEqual("test123@test.com");
  });
  test("creating a new account with duplicate email should fail", async () => {
    await new User({
      email: "test1@test.com",
      password: "test1@test.com",
      name: "test1",
    }).save();
    await request(server)
      .post("/api/users")
      .send({
        email: "test1@test.com",
        name: "test1",
        password: "test1@test.com",
      })
      .expect(400)
      .expect("Content-Type", /json/);
  });
  test("creating a new account with invalid password should fail", async () => {

    await request(server)
      .post("/api/users")
      .send({
        email: "test1@test.com",
        name: "test1",
        password: "test1",
      })
      .expect(400)
      .expect("Content-Type", /json/);
  });
});
