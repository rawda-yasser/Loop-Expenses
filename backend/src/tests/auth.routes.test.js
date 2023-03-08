import { user1 } from "../utils/seedFn";
import server from "../server";
import jwt from "jsonwebtoken";
import User from "../models/user.model";
import request from "supertest";
import config from "../config";
describe("/auth/login", () => {
  test("logging with existing email and password should succeed", async () => {
    const response = await request(server)
      .post("/auth/login")
      .send({
        email: user1.email,
        password: user1.password,
      })
      .expect(200)
      .expect("Content-Type", /json/);

    expect(response.body.token).toBeDefined();
    expect(response.body.user.name).toEqual(user1.name);
  });
  test("logging with wrong credentials should fail", async () => {
    const testUser = new User({name: "Test", email: "wrong_email@test.com", password: "wrong_email@test.com"})
    await testUser.save()
    const response = await request(server)
      .post("/auth/login")
      .send({
        email: testUser.email,
        password: "a wrong password",
      })
      .expect(401)
      .expect("Content-Type", /json/);

    expect(response.body.token).not.toBeDefined();
    expect(response.body.error).toEqual("Email and password don't match");
  });
});
