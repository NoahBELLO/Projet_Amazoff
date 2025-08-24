const Joi = require('joi');

// Schéma de base utilisé pour les deux cas (création et mise à jour)
const baseSchema = {
  userId: Joi.string().hex().length(24).required().messages({
    'string.empty': 'Le champ userId est obligatoire.',
    'any.required': 'Le champ userId est obligatoire.',
    'string.hex': 'userId doit être un identifiant Mongo valide.',
    'string.length': 'userId doit comporter 24 caractères.'
  }),
  message: Joi.string().required().messages({
    'string.empty': 'Le champ message est obligatoire.',
    'any.required': 'Le champ message est obligatoire.'
  }),
  title: Joi.string().optional().allow('', null),
  type: Joi.string().valid('info', 'success', 'warning', 'error', 'demande').default('info'),
  requestId: Joi.string().hex().length(24).optional().allow(null),
  redirectUrl: Joi.string()
    .pattern(/^\/[\w\-\/]*$/)
    .optional()
    .allow('', null)
    .messages({
      'string.pattern.base': 'Le champ redirectUrl doit être une URL relative valide (ex: /mes-demandes).'
    }),
  data: Joi.object().optional()
};

// Middleware pour la création
const validateNotificationCreation = (req, res, next) => {
  const schema = Joi.object(baseSchema);

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

// Middleware pour la mise à jour
const validateNotificationUpdate = (req, res, next) => {
  // Pour l'update, tous les champs sont optionnels
  const schema = Joi.object({
    ...baseSchema,
    userId: baseSchema.userId.optional(),
    message: baseSchema.message.optional()
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
  validateNotificationCreation,
  validateNotificationUpdate
};
