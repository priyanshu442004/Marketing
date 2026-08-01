const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

router.get('/', notificationController.getNotifications);
router.patch('/:id/read', notificationController.toggleReadStatus);
router.delete('/:id', notificationController.deleteNotification);
router.delete('/clear/all', notificationController.clearAll);

module.exports = router;
