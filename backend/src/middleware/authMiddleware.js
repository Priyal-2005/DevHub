const jwt = require("jsonwebtoken");
const prisma = require("../prisma/client");
const AppError = require("../utils/appError");

const authMiddleware = async (req, _res, next) => {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
      throw new AppError(401, "Unauthorized");
    }

    const token = header.split(" ")[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, name: true, email: true, avatar: true, provider: true },
    });

    if (!user) {
      throw new AppError(401, "Unauthorized");
    }

    req.user = user;
    next();
  } catch (_error) {
    next(new AppError(401, "Unauthorized"));
  }
};

module.exports = authMiddleware;
