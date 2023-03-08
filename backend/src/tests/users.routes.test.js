import request from "supertest";
import server from "../server";
import User from "../models/user.model";
import { authHeader, user1 } from "../utils/seedFn";
import config from "../config";
import jwt from "jsonwebtoken";
import { response } from "express";

describe("post /api/users", () => {
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
describe("get /api/users", () => {
  test("list all users", async () => {
    const response = await request(server)
      .get("/api/users/")
      .expect(200)
      .expect("Content-Type", /json/);
    expect(response.body).toHaveLength(2);
    expect(response.body[0].name).toEqual("Rawda Yasser");
    expect(response.body[1].name).toEqual("Rawda Yasser2");
  });
});
describe("get /api/users/:userId", () => {
  test("get user data", async () => {
    const response = await request(server)
      .get(`/api/users/${user1._id}`)
      .set("authorization", authHeader)
      .expect(200)
      .expect("Content-Type", /json/);

    expect(response.body.name).toEqual("Rawda Yasser");
    expect(response.body.email).toBe(undefined);
  });
  test("get user data with no authorization should fail", async () => {
    await request(server).get(`/api/users/${user1._id}`).expect(401);
  });
});
describe("/api/users/:userId delete", () => {
  test("delete user data", async () => {
    const deleted = new User({
      name: "deleted",
      email: "deleted@test.com",
      password: "deleted@test.com",
    });
    await deleted.save();
    // console.log(await User.findOne({email: "deleted@test.com"}))
    const deletedAuthHeader =
      "Bearer " + jwt.sign({ _id: deleted._id }, config.jwtSecret);

    const response = await request(server)
      .delete(`/api/users/${deleted._id}`)
      .set("authorization", deletedAuthHeader)
      .expect(200)
      .expect("Content-Type", /json/);
    expect(response.body.name).toEqual(deleted.name);
  });
});
describe("/api/users/:userId put", () => {
  test("update name using formidable", async () => {
    const response = await request(server)
      .put(`/api/users/${user1._id}`)
      .set("authorization", authHeader)
      .set({ connetion: "keep-alive" })
      .field("name", "Rawda updated")
      .field("password", user1.password)
      .expect(200)
      .expect("Content-Type", /json/);
    expect(response.body.name).toEqual("Rawda updated");
  });
});
