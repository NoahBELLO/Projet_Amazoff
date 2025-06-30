// paymentModeRoutes.js
const express = require('express');
const router = express.Router();

const {
  createPaymentMode,
  getUserPaymentModes,
  updatePaymentMode,
  deletePaymentMode
} = require('./paymentModeController');

// const { verifyToken } = require('../middlewares/authMiddleware');

// Vérification de fonctionnement de l'API
router.get('/', (req, res) => {
  res.send('Microservice PaymentModes OK');
});

// Créer une paymentMode
router.post('/create-paymentModes', createPaymentMode);

// Récupérer les paymentModes d'un utilisateur
router.get('/my-paymentModes', /* verifyToken, */ getUserPaymentModes);

// Supprimer une paymentMode spécifique
router.delete('/:id', /* verifyToken, */ deletePaymentMode);

// Supprimer toutes les paymentModes d'un utilisateur
//router.delete('/delete-allpaymentModes', /* verifyToken, */ deletePaymentMode);

// Mettre à jour une paymentMode spécifique
router.put('/update-paymentModes/:id', /* verifyToken, */ updatePaymentMode);

module.exports = router;
