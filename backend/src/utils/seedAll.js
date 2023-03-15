import { seedData } from "./seedFn.js";
// import MockDate from "mockdate";
beforeEach(async () => {
  
  // const constantDate = new Date('2017-06-13T04:41:20')

  /*eslint no-global-assign:off*/
  // const constantDate = new Date('2023-03-15T04:41:20')

  // Date = class extends Date {
  //   constructor() {
  //     return constantDate
  //   }
  // }
  // MockDate.set(new Date("2023-03-16T22:42:16.652Z"));
  // console.log("DTAEEEEEEEEEEEEEE", new Date());
  // // MockDate.set(moment('').toDate());
  // console.log("NOWWW", Date.now);
  // // jest.useFakeTimers("modern");
  // jest
  //   .spyOn(global, "Date")
  //   .mockImplementationOnce(() => new Date("2023-03-15T11:01:58.135Z"));
  // jest
  //   .spyOn(global.Date, "now")
  //   .mockImplementationOnce(() =>
  //     new Date("2023-03-15T11:01:58.135Z").valueOf()
  //   );
  // console.log("NOW", new Date("2023-03-15T11:01:5ss8.135Z").valueOf());
  // Date.now = jest.fn(() => new Date("2023-03-15T11:01:58.135Z").valueOf());

  // jest.setSystemTime(new Date(2022, 3, 8));
  // Date.now = jest.fn(() => new Date(Date.UTC(2023, 3, 8)).valueOf());
  // console.log(new Date());

  await seedData();
});
