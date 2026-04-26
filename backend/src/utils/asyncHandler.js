// =============================================
// Async Handler Wrapper
// =============================================
// Eliminates try-catch boilerplate in controllers.
// Wraps async route handlers and forwards errors
// to Express error middleware.

/**
 * @param {Function} fn - Async route handler
 * @returns {Function} Express middleware
 */
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

module.exports = asyncHandler;
