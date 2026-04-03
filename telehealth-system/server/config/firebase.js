import 'dotenv/config';
import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getFirebaseAdminApp() {
  // FIX 1: Check if there are already initialized apps to avoid "Already Exists" error
  if (admin.apps.length > 0) {
    return admin.app();
  }

  const {
    FIREBASE_PROJECT_ID,
    FIREBASE_CLIENT_EMAIL,
    FIREBASE_PRIVATE_KEY,
    FIREBASE_SERVICE_ACCOUNT_KEY,
  } = process.env;

  try {
    // Priority 1: Individual Environment Variables (Best for Production/Heroku/Vercel)
    if (FIREBASE_PROJECT_ID && FIREBASE_CLIENT_EMAIL && FIREBASE_PRIVATE_KEY) {
      // FIX 2: Better regex to handle keys wrapped in quotes or with literal backslashes
      const privateKey = FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n').replace(/"/g, '');

      return admin.initializeApp({
        credential: admin.credential.cert({
          projectId: FIREBASE_PROJECT_ID,
          clientEmail: FIREBASE_CLIENT_EMAIL,
          privateKey: privateKey,
        }),
      });
    }

    // Priority 2: Full JSON string in Environment Variable
    if (FIREBASE_SERVICE_ACCOUNT_KEY) {
      const serviceAccount = JSON.parse(FIREBASE_SERVICE_ACCOUNT_KEY);
      return admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    }

    // Priority 3: Local firebase.json file (Best for local dev)
    const firebaseJsonPath = path.join(__dirname, 'firebase.json');
    if (fs.existsSync(firebaseJsonPath)) {
      console.log('Loading Firebase credentials from config/firebase.json');
      const serviceAccount = JSON.parse(fs.readFileSync(firebaseJsonPath, 'utf8'));
      return admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    }

    // Fallback: Demo Mode (Note: Firestore operations will likely fail here without valid creds)
    console.warn('Firebase credentials not found. Running in demo mode.');
    return admin.initializeApp({
      projectId: 'demo-telehealth',
    });

  } catch (error) {
    console.error('Failed to initialize Firebase Admin:', error.message);
    throw error;
  }
}

// Initialize the app
const adminApp = getFirebaseAdminApp();

// Export Firestore and Admin
export const db = adminApp.firestore();
export { adminApp as admin };