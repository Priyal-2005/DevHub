const express = require("express");
const cors = require("cors");
const routes = require("./routes");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || "*" }));
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ status: "ok", message: "DevHub backend running" });
});

app.use("/api", routes);
app.use(errorHandler);

module.exports = app;
