import express from "express";
import cors from "cors";
import { readdirSync } from "fs";
import mongoose from "mongoose";
const morgan = require("morgan");
require("dotenv").config();

//create express app
const app = express();

//db
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("**DB connection**"))
  .catch((err) => console.log("db connection err =>", err));

//apply middle wares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

//routes
readdirSync("./routes").map((r) => app.use("/api", require(`./routes/${r}`)));
// app.get("/", (req, res) => {
//   res.send("you hit serve end point");
// });

//port
const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`server running at port ${port}`);
});
