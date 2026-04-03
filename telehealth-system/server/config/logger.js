import winston from 'winston';

const { NODE_ENV } = process.env;
const isProduction = NODE_ENV === 'production';

const logger = winston.createLogger({
  level: isProduction ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    isProduction ? winston.format.json() : winston.format.simple(),
  ),
  transports: [
    new winston.transports.Console(),
  ],
});

export default logger;

