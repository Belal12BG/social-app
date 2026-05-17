import Notification from "../models/Notification.js";

// GET MY NOTIFICATIONS
export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.userInfo.id })
      .sort({ createdAt: -1 })
      .limit(20)
      .populate("senderId", "name profilePic username")
      .populate("postId", "desc img");

    res.status(200).json(notifications);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

// MARK ALL AS READ
export const markAllRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { userId: req.userInfo.id, isRead: false },
      { $set: { isRead: true } }
    );
    res.status(200).json("All notifications marked as read!");
  } catch (err) {
    res.status(500).json(err.message);
  }
};

// GET UNREAD COUNT
export const getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      userId: req.userInfo.id,
      isRead: false,
    });
    res.status(200).json({ count });
  } catch (err) {
    res.status(500).json(err.message);
  }
};
