const bcrypt = require("bcryptjs");
const prisma = require("../prisma/client");
const AppError = require("../utils/appError");

const register = async ({ name, email, password, avatar }) => {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new AppError(409, "Email already in use");

  const hashedPassword = await bcrypt.hash(password, 10);

  return prisma.user.create({
    data: { name, email, password: hashedPassword, avatar, provider: "local" },
    select: { id: true, name: true, email: true, avatar: true, provider: true },
  });
};

const login = async ({ email, password }) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.password) throw new AppError(401, "Invalid credentials");

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new AppError(401, "Invalid credentials");

  return user;
};

const findOrCreateGoogleUser = async (profile) => {
  const email = profile.emails?.[0]?.value;
  if (!email) throw new AppError(400, "Google email not available");

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return existing;

  return prisma.user.create({
    data: {
      name: profile.displayName || "Google User",
      email,
      avatar: profile.photos?.[0]?.value,
      provider: "google",
    },
  });
};

const getMe = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, avatar: true, provider: true, createdAt: true },
  });

  if (!user) throw new AppError(404, "User not found");
  return user;
};

module.exports = { register, login, findOrCreateGoogleUser, getMe };
