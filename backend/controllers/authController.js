const {
  googleLogin,
  googleCallback,
  googleFailure,
} = require('../services/googleAuthService');

const authController = {
  googleLogin: (req, res, next) => googleLogin(req, res, next),
  googleCallback: (req, res, next) => googleCallback(req, res, next),
  googleFailure: (req, res) => googleFailure(req, res),
};

module.exports = authController;