import express from "express";
const app = express();
app.get("/", (req, res) => res.json({ message: "Loop Expenses" }));
app.listen(4000, () => console.log("Listening on port 4000"));
