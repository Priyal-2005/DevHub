// =============================================
// Middleware - Barrel Export
// =============================================

const authenticate = require("./authenticate");
const errorHandler = require("./errorHandler");
const validate = require("./validate");

module.exports = { authenticate, errorHandler, validate };
