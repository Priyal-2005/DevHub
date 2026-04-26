// =============================================
// Global Error Handler Middleware
// =============================================

const ApiError = require("../utils/ApiError");

/**
 * Central error handling middleware
 * @param {Error} err
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
const errorHandler = (err, _req, res, _next) => {
  // Default values
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";
  let errors = err.errors || [];

  // ─── Prisma Errors ───────────────────────────

  // Unique constraint violation
  if (err.code === "P2002") {
    statusCode = 409;
    const field = err.meta?.target?.[0] || "field";
    message = `A record with this ${field} already exists`;
    errors = [{ field, message }];
  }

  // Record not found
  if (err.code === "P2025") {
    statusCode = 404;
    message = "Record not found";
  }

  // ─── JSON Parse Error ────────────────────────

  if (err.type === "entity.parse.failed") {
    statusCode = 400;
    message = "Invalid JSON in request body";
  }

  // ─── Build Response ──────────────────────────

  const response = {
    success: false,
    statusCode,
    message,
    ...(errors.length > 0 && { errors }),
    ...(process.env.NODE_ENV === "development" && {
      stack: err.stack,
    }),
  };

  // Log error in development
  if (process.env.NODE_ENV === "development") {
    console.error("❌ Error:", {
      statusCode,
      message,
      ...(errors.length > 0 && { errors }),
      stack: err.stack,
    });
  }

  res.status(statusCode).json(response);
};

module.exports = errorHandler;
