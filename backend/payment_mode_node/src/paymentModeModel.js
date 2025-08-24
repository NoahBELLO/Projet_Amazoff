const mongoose = require('mongoose');

const paymentModeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  method: {
    type: String,
    enum: ['cb', 'paypal', 'virement', 'espèces'],
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  },
},
{ timestamps: true }
);

module.exports = mongoose.model('PaymentMode', paymentModeSchema);
