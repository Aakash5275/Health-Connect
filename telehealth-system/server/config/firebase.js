import admin from 'firebase-admin';

let appInitialized = false;

function getFirebaseAdminApp() {
  if (!appInitialized) {
    const {
      FIREBASE_PROJECT_ID,
      FIREBASE_CLIENT_EMAIL,
      FIREBASE_PRIVATE_KEY,
      FIREBASE_SERVICE_ACCOUNT_KEY,
      NODE_ENV,
    } = process.env;

    if (FIREBASE_PROJECT_ID && FIREBASE_CLIENT_EMAIL && FIREBASE_PRIVATE_KEY) {
      const privateKey = FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');

      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: FIREBASE_PROJECT_ID,
          clientEmail: FIREBASE_CLIENT_EMAIL,
          privateKey,
        }),
      });
    } else if (FIREBASE_SERVICE_ACCOUNT_KEY) {
      const serviceAccount = JSON.parse(FIREBASE_SERVICE_ACCOUNT_KEY);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    } else {
      console.warn(
        'Firebase credentials not found. Running in demo mode with projectId=demo-telehealth.',
      );
      admin.initializeApp({
        projectId: 'demo-telehealth',
      });
    }

    appInitialized = true;
  }

  return admin;
}

const adminApp = getFirebaseAdminApp();
const db = adminApp.firestore();

export { adminApp as admin, db };
