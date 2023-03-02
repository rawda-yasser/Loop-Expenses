import express from "express";
import mongoose from "mongoose";
import "dotenv/config";
import config from "./config";
import userRoutes from "./routes/user.routes";
import authRoutes from "./routes/auth.routes";
import expenseRoutes from "./routes/expense.routes";
const app = express();
app.use(express.json());
app.get("/", (req, res) => res.json({ message: "Loop Expenses" }));
app.use("/api/users", userRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/auth", authRoutes);
app.listen(config.port, () => console.log("Listening on port 4000"));
app.use((err, req, res, next) => {
  if (err.name === "UnauthorizedError") {
    res.status(401).json({ error: err.name + ": " + err.message });
  } else if (err) {
    res.status(400).json({ error: err.name + ": " + err.message });
    console.log(err);
  }
  next();
});
// Database Connection URL
mongoose.Promise = global.Promise;
mongoose.connect(config.mongoUri, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});
mongoose.connection.on("error", () => {
  throw new Error(`Unable to connect database ${config.mongoUri}`);
});
