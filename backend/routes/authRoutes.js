const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.get('/google', authController.googleLogin);
router.get('/google/callback', authController.googleCallback);
router.get('/google/failure', authController.googleFailure);

router.get('/me', authController.getMe);
router.put('/me', authController.updateMe);
router.post('/login', authController.login);
router.post('/register', authController.register);

module.exports = router;