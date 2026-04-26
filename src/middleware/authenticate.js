// =============================================
// Authentication Middleware
// =============================================
// Protects routes by verifying JWT from
// Authorization header (Bearer token).

const { verifyToken } = require("../utils/jwt");
const ApiError = require("../utils/ApiError");
const prisma = require("../prisma/client");

/**
 * Auth guard middleware
 * Extracts and verifies JWT, attaches user to req
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
const authenticate = async (req, _res, next) => {
  try {
    // 1. Extract token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw ApiError.unauthorized("Access token is missing");
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      throw ApiError.unauthorized("Access token is missing");
    }

    // 2. Verify token
    const decoded = verifyToken(token);

    // 3. Find user in database
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        bio: true,
        provider: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw ApiError.unauthorized("User not found — token is invalid");
    }

    // 4. Attach user to request
    req.user = user;
    next();
  } catch (error) {
    if (error instanceof ApiError) {
      return next(error);
    }

    // Handle JWT-specific errors
    if (error.name === "JsonWebTokenError") {
      return next(ApiError.unauthorized("Invalid token"));
    }
    if (error.name === "TokenExpiredError") {
      return next(ApiError.unauthorized("Token has expired"));
    }

    next(ApiError.unauthorized("Authentication failed"));
  }
};

module.exports = authenticate;
