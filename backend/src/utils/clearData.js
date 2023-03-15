import { clear } from "../dbConnection";

beforeEach(async() => {
  console.log("CLEAR");
  await clear();
});
