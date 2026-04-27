const prisma = require("../prisma/client");

const getNotifications = async (userId, limit = 50) => {
  const items = await prisma.notification.findMany({
    where: { recipientId: userId },
    include: { actor: { select: { id: true, name: true, avatar: true } } },
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  return { items };
};

module.exports = { getNotifications };
