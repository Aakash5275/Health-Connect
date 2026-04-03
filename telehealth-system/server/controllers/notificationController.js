import { db } from '../config/firebase.js';

// Get notifications for a user (optionally filter unread)
export const getNotifications = async (req, res) => {
  try {
    const { userId, unread } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'userId query parameter is required' });
    }

    let query = db.collection('notifications').where('userId', '==', userId);

    if (unread === 'true') {
      query = query.where('read', '==', false);
    }

    const snapshot = await query.orderBy('createdAt', 'desc').get();

    const notifications = [];
    snapshot.forEach((doc) => {
      notifications.push({ id: doc.id, ...doc.data() });
    });

    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mark a notification as read
export const markNotificationRead = async (req, res) => {
  try {
    const { id } = req.params;

    await db.collection('notifications').doc(id).update({
      read: true,
      readAt: new Date().toISOString(),
    });

    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

