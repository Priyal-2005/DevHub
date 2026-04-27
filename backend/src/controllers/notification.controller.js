const notificationService = require("../services/notification.service");

const getNotifications = async (req, res, next) => {
  try {
    const data = await notificationService.getNotifications(req.user.id);
    res.json(data);
  } catch (error) {
    next(error);
  }
};

module.exports = { getNotifications };
