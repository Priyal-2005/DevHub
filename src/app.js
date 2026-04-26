// =============================================
// Express Application Setup
// =============================================

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const passport = require("passport");

const configurePassport = require("./config/passport");
const routes = require("./routes");
const { errorHandler } = require("./middleware");
const ApiError = require("./utils/ApiError");

const app = express();

// ─── Security ──────────────────────────────────

app.use(helmet());

// ─── CORS ──────────────────────────────────────

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ─── Body Parsing ──────────────────────────────

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

// ─── Logging ───────────────────────────────────

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

// ─── Passport ──────────────────────────────────

configurePassport();
app.use(passport.initialize());

// ─── Health Check ──────────────────────────────

app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "DevHub API is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

// ─── API Routes ────────────────────────────────

app.use("/api", routes);

// ─── 404 Handler ───────────────────────────────

app.use((_req, _res, next) => {
  next(ApiError.notFound("Route not found"));
});

// ─── Global Error Handler ──────────────────────

app.use(errorHandler);

module.exports = app;
