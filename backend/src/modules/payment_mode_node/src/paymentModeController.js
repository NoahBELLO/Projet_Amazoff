const express = require('express');
const router = express.Router();

const {
  createPaymentMode,
  getUserPaymentModes,
  updatePaymentMode,
  deletePaymentMode
} = require('./paymentModeService');

// Vérifie que le microservice fonctionne
router.get('/', (req, res) => {
  res.send('Microservice PaymentMode OK');
});

// Créer un mode de paiement
router.post('/', createPaymentMode);

// Récupérer les modes de paiement d’un utilisateur
router.get('/user/:userId', getUserPaymentModes);

// Mettre à jour un mode de paiement
router.put('/:id', updatePaymentMode);

// Supprimer un mode de paiement
router.delete('/:id', deletePaymentMode);

module.exports = router;
