import "dotenv/config";

export const dbSetting = {
  test: {
    url: process.env.MONGODB_TEST_URL,
  },
  development: {
    url: process.env.MONGODB_URL,
  },
};
