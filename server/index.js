import express from "express";
const app = express();
import bodyParser from "body-parser";
import cors from "cors";
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

import AuthRoute from "./routes/authroutes.js";
import AbsensiRoute from "./routes/absensiroutes.js";

app.get("/", (req, res) => {
  res.send("Welcome to Web Req");
});
// function midleware(req, res, next) {
//   // ini midlewre
//   if (req.headers?.webreq === "secret key") return next();
//   return res.json("stuck di midleware");
// }

// app.get("/getData", midleware, (req, res) => {
//   res.json("ok ini data");
// });

app.use(AuthRoute);
app.use(AbsensiRoute);

app.listen(5000, () => {
  console.log("listening port 5000");
});
