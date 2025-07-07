// paymentModeService.js

const mongoose = require('mongoose');
const PaymentMode = require('./paymentModeModel');

class PaymentModeService {
  // Créer un mode de paiement
  static async createPaymentMode({ userId, method, description }) {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error('userId invalide.');
    }
    const paymentMode = new PaymentMode({
      userId,
      method,
      description: description || ''
    });
    await paymentMode.save();
    return paymentMode;
  }

  // Récupérer les modes de paiement d’un utilisateur
  static async getUserPaymentModes(userId) {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error('userId invalide.');
    }
    return await PaymentMode.find({ userId, isActive: true }).sort({ createdAt: -1 });
  }

  // Mettre à jour un mode de paiement
  static async updatePaymentMode(paymentModeId, updateData) {
    if (!mongoose.Types.ObjectId.isValid(paymentModeId)) {
      throw new Error('ID invalide.');
    }
    return await PaymentMode.findByIdAndUpdate(paymentModeId, updateData, { new: true });
  }

  // Supprimer un mode de paiement
  static async deletePaymentMode(paymentModeId) {
    if (!mongoose.Types.ObjectId.isValid(paymentModeId)) {
      throw new Error('ID invalide.');
    }
    return await PaymentMode.findByIdAndDelete(paymentModeId);
  }

// Récupérer tous les modes de paiement (admin/debug)
static async getAllPaymentModes() {
  return await PaymentMode.find().sort({ createdAt: -1 });
}
}

module.exports = PaymentModeService;
