const Joi = require('joi');
const { BadRequestError } = require('../utils/errors');

const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errorMessage = error.details
        .map((detail) => detail.message)
        .join(', ');
      next(new BadRequestError(errorMessage));
    }

    next();
  };
};

module.exports = { validateRequest };
