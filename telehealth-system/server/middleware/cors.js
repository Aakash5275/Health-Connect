import cors from 'cors';

export function createCorsMiddleware() {
  const corsOrigin = process.env.CORS_ORIGIN || process.env.FRONTEND_URL || 'http://localhost:5173';
  const origins = corsOrigin.split(',').map((o) => o.trim());

  return cors({
    origin: origins,
    credentials: true,
  });
}

