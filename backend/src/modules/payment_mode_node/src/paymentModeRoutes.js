const express = require('express');
const router = express.Router();

const {
  createPaymentMode,
  getUserPaymentModes,
  updatePaymentMode,
  deletePaymentMode
} = require('./paymentModeController');

const {
  validatePaymentModeCreation,
  validatePaymentModeUpdate
} = require('./paymentModeMiddleware'); 
// Vérification du microservice
router.get('/', (req, res) => {
  res.send('Microservice PaymentMode OK');
});

// Créer un mode de paiement avec validation
router.post('/create', validatePaymentModeCreation, createPaymentMode);

// Récupérer les modes de paiement d'un utilisateur
router.get('/user', getUserPaymentModes);

// Mettre à jour un mode de paiement avec validation
router.put('/update/:id', validatePaymentModeUpdate, updatePaymentMode);

// Supprimer un mode de paiement
router.delete('/delete/:id', deletePaymentMode);

module.exports = router;
