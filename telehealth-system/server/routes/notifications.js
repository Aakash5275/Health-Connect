import express from 'express';
import {
  getNotifications,
  markNotificationRead,
} from '../controllers/notificationController.js';

const router = express.Router();

// GET /api/notifications?userId=...&unread=true
router.get('/', getNotifications);

// PATCH /api/notifications/:id/read
router.patch('/:id/read', markNotificationRead);

export default router;

