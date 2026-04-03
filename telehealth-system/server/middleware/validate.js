import Joi from 'joi';

export function validate(schema) {
  return (req, res, next) => {
    const toValidate = {
      body: req.body,
      query: req.query,
      params: req.params,
    };

    const { error, value } = schema.validate(toValidate, {
      abortEarly: false,
      allowUnknown: true,
      stripUnknown: false,
    });

    if (error) {
      const details = error.details.map((d) => d.message);
      const err = new Error('Validation failed');
      err.status = 400;
      err.details = details;
      return next(err);
    }

    Object.assign(req, value);
    return next();
  };
}

export function buildSchema(definition) {
  return Joi.object(definition);
}

