const prisma = require("../prisma/client");
const AppError = require("../utils/appError");

const upsertProfile = async (userId, payload) => {
  return prisma.profile.upsert({
    where: { userId },
    update: payload,
    create: { userId, ...payload },
  });
};

const getProfileByUserId = async (userId) => {
  const profile = await prisma.profile.findUnique({
    where: { userId },
    include: {
      user: { select: { id: true, name: true, email: true, avatar: true } },
    },
  });

  if (!profile) throw new AppError(404, "Profile not found");
  return profile;
};

module.exports = { upsertProfile, getProfileByUserId };
