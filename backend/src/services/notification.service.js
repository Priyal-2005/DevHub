const prisma = require("../prisma/client");

const getNotifications = async (userId, limit = 50) => {
  try {
    const items = await prisma.notification.findMany({
      where: { recipientId: userId },
      include: { actor: { select: { id: true, name: true, avatar: true } } },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return { items };
  } catch (error) {
    if (error?.code === "P2021") {
      console.warn("[notifications] Notification table missing, returning empty list");
      return { items: [] };
    }
    throw error;
  }
};

module.exports = { getNotifications };
