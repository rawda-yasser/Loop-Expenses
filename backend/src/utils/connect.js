import { connect } from "../dbConnection.js";

beforeAll(async () => {

  console.log("connect");

  await connect();

  // jest.useFakeTimers().setSystemTime(new Date(2023, 3, 15)); 
  // console.log("TODAY_______________", new Date());
});
