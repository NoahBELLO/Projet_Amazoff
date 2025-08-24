const Joi = require('joi');

// Middleware pour la création d’un mode de paiement
const validatePaymentModeCreation = (req, res, next) => {
  const schema = Joi.object({
    userId: Joi.string().hex().length(24).required().messages({
      'string.empty': 'Le champ userId est obligatoire.',
      'any.required': 'Le champ userId est obligatoire.',
      'string.hex': 'userId doit être un identifiant Mongo valide.',
      'string.length': 'userId doit comporter 24 caractères.'
    }),
    method: Joi.string().required().messages({
      'string.empty': 'Le champ method est obligatoire.',
      'any.required': 'Le champ method est obligatoire.'
    }),
    details: Joi.string().optional().allow('', null)
  });

  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    console.error('Validation error:', error.details);
    const formattedErrors = error.details.map(({ message, path }) => ({
      field: path[0],
      message
    }));
    return res.status(400).json({ message: 'Validation échouée', errors: formattedErrors });
  }

  next();
};

// Middleware pour la mise à jour d’un mode de paiement
const validatePaymentModeUpdate = (req, res, next) => {
  const schema = Joi.object({
    method: Joi.string().optional(),
    details: Joi.string().optional().allow('', null)
  });

  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const formattedErrors = error.details.map(({ message, path }) => ({
      field: path[0],
      message
    }));
    return res.status(400).json({ message: 'Validation échouée', errors: formattedErrors });
  }

  next();
};

module.exports = {
  validatePaymentModeCreation,
  validatePaymentModeUpdate
};
