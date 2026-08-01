const prisma = require('../utils/prismaClient');

const notificationController = {
  // Get all notifications for user
  getNotifications: async (req, res, next) => {
    try {
      const defaultUser = await prisma.user.findFirst();
      if (!defaultUser) {
        return res.status(200).json({ success: true, count: 0, data: [] });
      }

      const notifications = await prisma.notification.findMany({
        where: { userId: defaultUser.id },
        orderBy: { createdAt: 'desc' },
      });

      return res.status(200).json({ success: true, count: notifications.length, data: notifications });
    } catch (error) {
      return next(error);
    }
  },

  // Toggle read status of a notification
  toggleReadStatus: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { read } = req.body;

      const notification = await prisma.notification.findUnique({ where: { id } });
      if (!notification) {
        return res.status(404).json({ success: false, message: 'Notification not found' });
      }

      const updated = await prisma.notification.update({
        where: { id },
        data: { read: read !== undefined ? read : !notification.read },
      });

      return res.status(200).json({ success: true, data: updated });
    } catch (error) {
      return next(error);
    }
  },

  // Delete single notification
  deleteNotification: async (req, res, next) => {
    try {
      const { id } = req.params;
      await prisma.notification.delete({ where: { id } });
      return res.status(200).json({ success: true, message: 'Notification deleted' });
    } catch (error) {
      return next(error);
    }
  },

  // Clear all notifications
  clearAll: async (req, res, next) => {
    try {
      const defaultUser = await prisma.user.findFirst();
      if (defaultUser) {
        await prisma.notification.deleteMany({ where: { userId: defaultUser.id } });
      }
      return res.status(200).json({ success: true, message: 'All notifications cleared' });
    } catch (error) {
      return next(error);
    }
  },
};

module.exports = notificationController;
