const mongoose = require('mongoose');
const PaymentMode = require('./paymentModeModel');

class PaymentModeService {
  // Créer un mode de paiement
  static async createPaymentMode(userId, method, details = "") {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error('userId invalide.');
    }

    const paymentMode = new PaymentMode({ userId, method, details });
    await paymentMode.save();
    return paymentMode;
  }

  // Récupérer tous les modes de paiement d’un utilisateur
  static async getUserPaymentModes(userId) {
    return await PaymentMode.find({ userId }).sort({ createdAt: -1 });
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
}

module.exports = PaymentModeService;
