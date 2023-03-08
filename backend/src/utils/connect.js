import { connect } from "../dbConnection.js";

beforeAll(async () => {
  console.log("connect");
  await connect();
});
