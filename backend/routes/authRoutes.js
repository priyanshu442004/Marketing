const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { optionalAuthMiddleware } = require('../middleware/authMiddleware');

router.get('/google', authController.googleLogin);
router.get('/google/callback', authController.googleCallback);
router.get('/google/failure', authController.googleFailure);

router.get('/me', optionalAuthMiddleware, authController.getMe);
router.put('/me', optionalAuthMiddleware, authController.updateMe);
router.post('/login', authController.login);
router.post('/register', authController.register);

module.exports = router;