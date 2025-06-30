// notificationController.js
const mongoose = require('mongoose');

const NotificationService = require('./notificationService');
exports.createNotification = async (req, res) => {
  try {
    const userId = req.query.userId || req.body.userId || "677bee6f001291cbbe4eda4";
    const { message, title, type, requestId, redirectUrl, data } = req.body;

    if (!userId || !message) {
      return res.status(400).json({ error: "userId et message sont requis." });
    }

    const notification = await NotificationService.createNotification(
      userId,
      message,
      title,
      type,
      requestId,
      redirectUrl,
      data
    );

    res.status(201).json({ message: 'Notification créée', notification });
  } catch (error) {
    console.error("Erreur lors de la création :", error);
    res.status(500).json({ error: "Erreur serveur lors de la création." });
  }
};

// Récupérer les notifications d'un utilisateur
// exports.getUserNotifications = async (req, res) => {
//   try {
//     const notifications = await NotificationService.getUserNotifications(req.user.id);
//     res.status(200).json(notifications);
//   } catch (error) {
//     console.error('Erreur lors de la récupération des notifications :', error);
//     res.status(500).json({ error: 'Erreur serveur lors de la récupération des notifications.' });
//   }
// };


//pour le test  pcq l'authentification n'est pas encore fait
exports.getUserNotifications = async (req, res) => {
  try {
    const userId = req.user?.id || req.query.userId;

    if (!userId) {
      return res.status(400).json({ error: "Aucun identifiant utilisateur fourni." });
    }

    const notifications = await NotificationService.getUserNotifications(userId);
    res.status(200).json(notifications);
  } catch (error) {
    console.error('Erreur lors de la récupération des notifications :', error);
    res.status(500).json({ error: 'Erreur serveur lors de la récupération des notifications.' });
  }
};


// Marquer une notification comme lue
// exports.markNotificationAsRead = async (req, res) => {
//   try {
//     const notification = await NotificationService.markAsRead(req.params.id);
//     if (!notification) {
//       return res.status(404).json({ error: 'Notification non trouvée.' });
//     }
//     res.status(200).json({ message: 'Notification marquée comme lue.', notification });
//   } catch (error) {
//     console.error('Erreur lors de la mise à jour de la notification :', error);
//     res.status(500).json({ error: 'Erreur serveur lors de la mise à jour.' });
//   }
// };

exports.markNotificationAsRead = async (req, res) => {
  try {
    const notificationId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(notificationId)) {
      return res.status(400).json({ error: 'ID de notification invalide.' });
    }

    const notification = await NotificationService.markAsRead(notificationId);
    if (!notification) {
      return res.status(404).json({ error: 'Notification non trouvée.' });
    }

    res.status(200).json({ message: 'Notification marquée comme lue.', notification });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la notification :', error);
    res.status(500).json({ error: 'Erreur serveur lors de la mise à jour.' });
  }
};


// Supprimer une notification
exports.deleteNotification = async (req, res) => {
  try {
    const notification = await NotificationService.deleteNotification(req.params.id);
    if (!notification) {
      return res.status(404).json({ error: 'Notification non trouvée.' });
    }
    res.status(200).json({ message: 'Notification supprimée avec succès.', notification });
  } catch (error) {
    console.error('Erreur lors de la suppression de la notification :', error);
    res.status(500).json({ error: 'Erreur serveur lors de la suppression.' });
  }
};
// Marquer toutes les notifications comme lues
// exports.markAllAsRead = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     await NotificationService.markAllAsRead(userId);
//     res.status(200).json({ message: 'Toutes les notifications ont été marquées comme lues.' });
//   } catch (error) {
//     console.error('Erreur lors du marquage des notifications :', error);
//     res.status(500).json({ error: 'Erreur serveur lors du marquage des notifications.' });
//   }
// };

exports.markAllAsRead = async (req, res) => {
  try {
    const userId = req.query.userId || req.user?.id;
    if (!userId) {
      return res.status(400).json({ error: "userId manquant." });
    }

    await NotificationService.markAllAsRead(userId);
    res.status(200).json({ message: 'Toutes les notifications ont été marquées comme lues.' });
  } catch (error) {
    console.error('Erreur lors du marquage des notifications :', error);
    res.status(500).json({ error: 'Erreur serveur lors du marquage.' });
  }
};


// Supprimer toutes les notifications
exports.deleteAllNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    await NotificationService.deleteAllNotifications(userId);
    res.status(200).json({ message: 'Toutes les notifications ont été supprimées.' });
  } catch (error) {
    console.error('Erreur lors de la suppression des notifications :', error);
    res.status(500).json({ error: 'Erreur serveur lors de la suppression des notifications.' });
  }
};
// Mettre à jour une notification
exports.updateNotification = async (req, res) => {
  try {
    const notificationId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(notificationId)) {
      return res.status(400).json({ error: 'ID de notification invalide.' });
    }

    const updatedNotification = await NotificationService.updateNotification(notificationId, req.body);

    if (!updatedNotification) {
      return res.status(404).json({ error: 'Notification non trouvée.' });
    }

    res.status(200).json({ message: 'Notification mise à jour.', notification: updatedNotification });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la notification :', error);
    res.status(500).json({ error: 'Erreur serveur lors de la mise à jour.' });
  }
};
