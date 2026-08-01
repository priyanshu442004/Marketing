const prisma = require('../utils/prismaClient');
const { generateToken } = require('../utils/jwt');
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
      const userId = req.user?.id || req.query.userId || req.headers['x-user-id'];
      let user = null;
      if (userId) {
        user = await prisma.user.findUnique({ where: { id: userId } });
      }
      if (!user) {
        user = await prisma.user.findFirst();
      }
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
      const token = generateToken({ id: user.id, email: user.email, name: user.name });
      return res.status(200).json({ success: true, token, data: user });
    } catch (error) {
      return next(error);
    }
  },

  // Update user profile
  updateMe: async (req, res, next) => {
    try {
      const { name, email, company, title, plan, avatarUrl } = req.body;
      const userId = req.user?.id || req.query.userId || req.headers['x-user-id'];
      let currentUser = userId ? await prisma.user.findUnique({ where: { id: userId } }) : await prisma.user.findFirst();

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
      const { email, name, company } = req.body;
      const userEmail = email ? email.trim().toLowerCase() : null;

      let user = null;
      if (userEmail) {
        user = await prisma.user.findFirst({ where: { email: userEmail } });
      }
      if (!user && userEmail) {
        user = await prisma.user.create({
          data: {
            email: userEmail,
            name: name || userEmail.split('@')[0],
            company: company || 'Enterprise Suite',
          },
        });
      }
      if (!user) {
        user = await prisma.user.findFirst();
      }

      const token = generateToken({ id: user.id, email: user.email, name: user.name });
      return res.status(200).json({ success: true, token, data: user });
    } catch (error) {
      return next(error);
    }
  },

  // Simple register endpoint
  register: async (req, res, next) => {
    try {
      const { email, name, company } = req.body;
      const userEmail = email ? email.trim().toLowerCase() : `user_${Date.now()}@brandsutra.ai`;

      let user = await prisma.user.findFirst({ where: { email: userEmail } });
      if (!user) {
        user = await prisma.user.create({
          data: {
            email: userEmail,
            name: name || 'Marketing Operator',
            company: company || 'Enterprise Suite',
          },
        });
      }

      const token = generateToken({ id: user.id, email: user.email, name: user.name });
      return res.status(201).json({ success: true, token, data: user });
    } catch (error) {
      return next(error);
    }
  },
};

module.exports = authController;