import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Validate Firebase configuration
function validateFirebaseConfig() {
  const requiredVars = [
    'EXPO_PUBLIC_FIREBASE_API_KEY',
    'EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN',
    'EXPO_PUBLIC_FIREBASE_PROJECT_ID',
    'EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET',
    'EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
    'EXPO_PUBLIC_FIREBASE_APP_ID',
  ];

  const missing = requiredVars.filter(varName => !process.env[varName] || process.env[varName] === 'your-project-id' || process.env[varName] === 'your-api-key-here');

  if (missing.length > 0) {
    console.error('[Firebase Config] Missing or invalid environment variables:', missing);
    console.error('[Firebase Config] Please update your .env file with valid Firebase credentials');
    return false;
  }

  console.log('[Firebase Config] All required environment variables are present');
  return true;
}

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || '',
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || '',
};

// Validate configuration
const isConfigValid = validateFirebaseConfig();
if (!isConfigValid) {
  console.warn('[Firebase] Running with placeholder configuration. Authentication will not work until .env is updated.');
}

// Log configuration status (without exposing sensitive data)
console.log('[Firebase] Initializing with project:', firebaseConfig.projectId);
console.log('[Firebase] Auth domain:', firebaseConfig.authDomain);

// Initialize Firebase only if it hasn't been initialized yet
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Auth
const auth = getAuth(app);

// Initialize Firestore
const db = getFirestore(app);

export { app, auth, db };
