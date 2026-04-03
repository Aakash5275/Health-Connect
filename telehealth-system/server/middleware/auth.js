import jwt from 'jsonwebtoken';
import { admin } from '../config/firebase.js';
import logger from '../config/logger.js';

const { JWT_SECRET } = process.env;

export async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) {
      const err = new Error('Authentication token missing');
      err.status = 401;
      throw err;
    }

    let decoded;

    // Prefer Firebase ID token verification
    try {
      decoded = await admin.auth().verifyIdToken(token);
      req.user = {
        uid: decoded.uid,
        role: decoded.role || decoded.customClaims?.role || 'patient',
        email: decoded.email,
      };
    } catch (firebaseError) {
      // Fallback to local JWT if configured
      if (!JWT_SECRET) {
        logger.warn('JWT_SECRET not set and Firebase token verification failed');
        const err = new Error('Invalid authentication token');
        err.status = 401;
        throw err;
      }

      decoded = jwt.verify(token, JWT_SECRET);
      req.user = {
        uid: decoded.sub || decoded.uid,
        role: decoded.role || 'patient',
        email: decoded.email,
      };
    }

    return next();
  } catch (err) {
    if (!err.status) {
      err.status = 401;
      err.message = 'Invalid or expired authentication token';
    }
    return next(err);
  }
}

export function requireRole(allowedRoles = []) {
  return (req, res, next) => {
    if (!req.user) {
      const err = new Error('Not authenticated');
      err.status = 401;
      return next(err);
    }

    if (allowedRoles.length && !allowedRoles.includes(req.user.role)) {
      const err = new Error('Not authorized');
      err.status = 403;
      return next(err);
    }

    return next();
  };
}

