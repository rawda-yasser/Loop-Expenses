import { close } from "../dbConnection.js";

afterAll(async() => await close())