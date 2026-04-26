// =============================================
// Zod Validation Middleware
// =============================================
// Generic middleware factory that validates
// req.body against any Zod schema.

const ApiError = require("../utils/ApiError");

/**
 * Creates validation middleware for a given Zod schema
 * @param {import("zod").ZodSchema} schema - Zod schema to validate against
 * @returns {import("express").RequestHandler}
 */
const validate = (schema) => {
  return (req, _res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const errors = result.error.errors.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));

      throw ApiError.badRequest("Validation failed", errors);
    }

    // Replace body with parsed/transformed data
    req.body = result.data;
    next();
  };
};

module.exports = validate;
