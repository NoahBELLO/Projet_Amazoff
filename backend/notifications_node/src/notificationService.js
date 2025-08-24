// notificationService.js
const mongoose = require("mongoose");

const Notification = require("./notificationModel");

class NotificationService {
  static async createNotification(
    userId,
    message,
    title = null,
    type = "info",
    requestId = null,
    redirectUrl = null,
    data = {}
  ) {
    try {
      // Optionnel : validation manuelle de l'ObjectId si nécessaire
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error("userId invalide : pas un ObjectId");
      }

      const notification = new Notification({
        userId,
        message,
        title,
        type,
        requestId,
        redirectUrl,
        data,
      });
      await notification.save();
      return notification;
    } catch (error) {
      console.error("Erreur lors de la création de la notification :", error);
      throw error;
    }
  }

  // Récupérer les notifications d'un utilisateur
  static async getUserNotifications(userId) {
    return await Notification.find({ userId }).sort({ createdAt: -1 });
  }

  // Marquer une notification comme lue
  static async markAsRead(notificationId) {
    return await Notification.findByIdAndUpdate(
      notificationId,
      { status: "read" },
      { new: true }
    );
  }

  // Supprimer une notification
  static async deleteNotification(notificationId) {
    return await Notification.findByIdAndDelete(notificationId);
  }
  // Marquer toutes les notifications d'un utilisateur comme lues
  static async markAllAsRead(userId) {
    return await Notification.updateMany(
      { userId, status: { $ne: "read" } },
      { $set: { status: "read" } }
    );
  }
  // Supprimer toutes les notifications d'un utilisateur
  static async deleteAllNotifications(userId) {
    return await Notification.deleteMany({ userId });
  }

  static async deleteNotificationsByUserIds(userIds) {
    // userIds peut être un tableau ou une seule valeur
    if (!Array.isArray(userIds)) {
      userIds = [userIds];
    }
    return await Notification.deleteMany({ userId: { $in: userIds } });
  }

  // Mettre à jour une notification
  static async updateNotification(notificationId, updateData) {
    return await Notification.findByIdAndUpdate(notificationId, updateData, {
      new: true,
    });
  }
}

module.exports = NotificationService;
