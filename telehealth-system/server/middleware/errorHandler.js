import logger from '../config/logger.js';

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  const status = err.status || err.statusCode || 500;
  const isProduction = process.env.NODE_ENV === 'production';

  logger.error({
    message: err.message,
    stack: err.stack,
    status,
    path: req.path,
    method: req.method,
  });

  res.status(status).json({
    error: status === 500 ? 'Internal server error' : err.message || 'Request failed',
    ...(isProduction ? {} : { details: err.message, stack: err.stack }),
  });
}

export function notFoundHandler(req, res, next) {
  res.status(404).json({ error: 'Endpoint not found' });
}

