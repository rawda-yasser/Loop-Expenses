import { close } from "../dbConnection.js";

afterAll(async () => {
  // jest.useRealTimers();
  await close();
});
