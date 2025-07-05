// notificationRoutes.js
const express = require('express');
const router = express.Router();

const {
  createNotification,
  getUserNotifications,
  markNotificationAsRead,
  deleteNotification,
  markAllAsRead,
  deleteAllNotifications,
  updateNotification
} = require('./notificationController');

// const { verifyToken } = require('../middlewares/authMiddleware');

// Vérification de fonctionnement de l'API
router.get('/', (req, res) => {
  res.send('Microservice Notifications OK');
});

router.get('/health', (req, res) => { res.status(200).send('OK'); });

// Créer une notification
router.post('/create-notif', createNotification);

// Récupérer les notifications d'un utilisateur
router.get('/my-notifications', /* verifyToken, */ getUserNotifications);

// Marquer une notification spécifique comme lue
router.put('/:id/read', /* verifyToken, */ markNotificationAsRead);

// Marquer toutes les notifications comme lues
router.put('/mark-all-read', /* verifyToken, */ markAllAsRead);

// Supprimer une notification spécifique
router.delete('/:id', /* verifyToken, */ deleteNotification);

// Supprimer toutes les notifications d'un utilisateur
router.delete('/delete-all', /* verifyToken, */ deleteAllNotifications);

// Mettre à jour une notification spécifique
router.put('/update/:id', /* verifyToken, */ updateNotification);

module.exports = router;
