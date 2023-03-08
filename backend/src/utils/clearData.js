import { clear } from "../dbConnection.js";

beforeEach(() => {
  console.log("CLEAR");
  clear();
});
