import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration
// Replace these with your actual Firebase project configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "demo-api-key",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "demo-telehealth.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "demo-telehealth",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "demo-telehealth.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789:web:abc123"
};

// Flag to detect when we're using the built‑in demo config
export const isDemoFirebase = firebaseConfig.projectId === 'demo-telehealth';

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
