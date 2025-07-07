const PaymentModeService = require('./paymentModeService');

// Créer un mode de paiement
const createPaymentMode = async (req, res) => {
  try {
    const paymentMode = await PaymentModeService.createPaymentMode(req.body);
    res.status(201).json(paymentMode);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Récupérer les modes de paiement d’un utilisateur
const getUserPaymentModes = async (req, res) => {
  try {
    const userId = req.query.userId;
    if (!userId) {
      return res.status(400).json({ error: 'Le userId est requis.' });
    }
    const paymentModes = await PaymentModeService.getUserPaymentModes(userId);
    res.status(200).json(paymentModes);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Mettre à jour un mode de paiement
const updatePaymentMode = async (req, res) => {
  try {
    const userId = req.query.userId;
    if (!userId) {
      return res.status(400).json({ error: 'Le userId est requis.' });
    }

    // Vérifier si le mode de paiement appartient à cet utilisateur
    const paymentModes = await PaymentModeService.getUserPaymentModes(userId);
    const ownsPaymentMode = paymentModes.some(pm => pm._id.toString() === req.params.id);
    if (!ownsPaymentMode) {
      return res.status(403).json({ error: 'Action non autorisée sur ce mode de paiement.' });
    }

    const updatedPaymentMode = await PaymentModeService.updatePaymentMode(req.params.id, req.body);
    res.status(200).json(updatedPaymentMode);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Supprimer un mode de paiement
const deletePaymentMode = async (req, res) => {
  try {
    const userId = req.query.userId;
    if (!userId) {
      return res.status(400).json({ error: 'Le userId est requis.' });
    }

    // Vérifier si le mode de paiement appartient à cet utilisateur
    const paymentModes = await PaymentModeService.getUserPaymentModes(userId);
    const ownsPaymentMode = paymentModes.some(pm => pm._id.toString() === req.params.id);
    if (!ownsPaymentMode) {
      return res.status(403).json({ error: 'Action non autorisée sur ce mode de paiement.' });
    }

    await PaymentModeService.deletePaymentMode(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
// Récupérer TOUS les modes de paiement (pour admin ou debug)
const getAllPaymentModes = async (req, res) => {
  try {
    const paymentModes = await PaymentModeService.getAllPaymentModes();
    res.status(200).json(paymentModes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createPaymentMode,
  getUserPaymentModes,
  updatePaymentMode,
  deletePaymentMode,
  getAllPaymentModes
};
