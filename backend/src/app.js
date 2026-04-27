const express = require("express");
const cors = require("cors");
const passport = require("passport");
const routes = require("./routes");
const errorHandler = require("./middleware/errorHandler");

const app = express();
const allowedOrigins = ["http://localhost:5173", "http://localhost:5174"];
const corsOptions = {
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));
app.use(express.json());
app.use(passport.initialize());

app.get("/", (_req, res) => {
  res.json({ status: "ok", message: "DevHub backend running" });
});

app.use("/api", routes);
app.use(errorHandler);

module.exports = app;
