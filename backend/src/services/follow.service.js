const prisma = require("../prisma/client");
const AppError = require("../utils/appError");

const userSelect = { id: true, name: true, email: true, avatar: true };

const toggleFollow = async (followerId, followingId) => {
  if (!followingId) throw new AppError(400, "followingId is required");
  if (followerId === followingId) throw new AppError(400, "You cannot follow yourself");

  const target = await prisma.user.findUnique({ where: { id: followingId }, select: { id: true } });
  if (!target) throw new AppError(404, "User not found");

  const existing = await prisma.follow.findUnique({
    where: { followerId_followingId: { followerId, followingId } },
  });

  if (existing) {
    await prisma.follow.delete({ where: { id: existing.id } });
    await prisma.notification.deleteMany({
      where: { recipientId: followingId, actorId: followerId, type: "follow" },
    });
    return { following: false };
  }

  await prisma.follow.create({ data: { followerId, followingId } });
  await prisma.notification.create({
    data: {
      recipientId: followingId,
      actorId: followerId,
      type: "follow",
      message: "started following you.",
    },
  });

  return { following: true };
};

const getFollowers = async (userId) => {
  const rows = await prisma.follow.findMany({
    where: { followingId: userId },
    include: { follower: { select: userSelect } },
    orderBy: { createdAt: "desc" },
  });

  return { items: rows.map((row) => row.follower) };
};

const getFollowing = async (userId) => {
  const rows = await prisma.follow.findMany({
    where: { followerId: userId },
    include: { following: { select: userSelect } },
    orderBy: { createdAt: "desc" },
  });

  return { items: rows.map((row) => row.following) };
};

module.exports = { toggleFollow, getFollowers, getFollowing };
