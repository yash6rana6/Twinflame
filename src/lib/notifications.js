// lib/notifications.js
import Notification from "@/models/Notification";

export const createNotification = async ({
  userId,
  type,
  title,
  message,
  timelineId = null,
  eventId = null,
  quizId = null,
  metadata = {},
}) => {
  try {
    const notif = await Notification.create({
      user: userId,
      type,
      title,
      message,
      timeline: timelineId,
      event: eventId,
      quiz: quizId,
      metadata,
    });

    // Future mein yahan real-time push (SSE / Socket.io / Push Notification) add kar sakte ho
    // emitToUser(userId, notif);

    return notif;
  } catch (err) {
    console.error(`Failed to create notification (${type}):`, err);
  }
};

// Bulk notifications (jaise sab users ko broadcast)
export const createBulkNotifications = async (userIds, notificationData) => {
  const notifications = userIds.map(userId => ({
    ...notificationData,
    user: userId,
  }));

  return Notification.insertMany(notifications);
};