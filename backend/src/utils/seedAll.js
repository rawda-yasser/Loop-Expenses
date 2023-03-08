import { seedData } from "./seedFn.js";

beforeEach(async () => {
  await seedData();
});
