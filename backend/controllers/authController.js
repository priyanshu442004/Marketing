const prisma = require('../utils/prismaClient');
const {
  googleLogin,
  googleCallback,
  googleFailure,
} = require('../services/googleAuthService');

const authController = {
  googleLogin: (req, res, next) => googleLogin(req, res, next),
  googleCallback: (req, res, next) => googleCallback(req, res, next),
  googleFailure: (req, res) => googleFailure(req, res),

  // Get current user profile
  getMe: async (req, res, next) => {
    try {
      let user = await prisma.user.findFirst();
      if (!user) {
        user = await prisma.user.create({
          data: {
            email: 'saurabh@brandsutra.ai',
            name: 'Saurabh Dey',
            company: 'All Above Design Studio',
            title: 'Head of Marketing Operations',
            plan: 'Enterprise Suite',
          },
        });
      }
      return res.status(200).json({ success: true, data: user });
    } catch (error) {
      return next(error);
    }
  },

  // Update user profile
  updateMe: async (req, res, next) => {
    try {
      const { name, email, company, title, plan, avatarUrl } = req.body;
      const currentUser = await prisma.user.findFirst();

      if (!currentUser) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      const updatedUser = await prisma.user.update({
        where: { id: currentUser.id },
        data: {
          name: name ?? currentUser.name,
          email: email ?? currentUser.email,
          company: company ?? currentUser.company,
          title: title ?? currentUser.title,
          plan: plan ?? currentUser.plan,
          avatarUrl: avatarUrl ?? currentUser.avatarUrl,
        },
      });

      return res.status(200).json({ success: true, data: updatedUser });
    } catch (error) {
      return next(error);
    }
  },

  // Simple login endpoint
  login: async (req, res, next) => {
    try {
      const { email } = req.body;
      let user = await prisma.user.findFirst({ where: { email } });
      if (!user) {
        user = await prisma.user.findFirst();
      }
      return res.status(200).json({ success: true, data: user });
    } catch (error) {
      return next(error);
    }
  },

  // Simple register endpoint
  register: async (req, res, next) => {
    try {
      const { email, name, company } = req.body;
      const newUser = await prisma.user.create({
        data: {
          email: email || `user_${Date.now()}@brandsutra.ai`,
          name: name || 'Marketing Operator',
          company: company || 'Enterprise Suite',
        },
      });
      return res.status(201).json({ success: true, data: newUser });
    } catch (error) {
      return next(error);
    }
  },
};

module.exports = authController;