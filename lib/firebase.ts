import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

/**
 * Hardcoded Firebase configuration extracted from native config files.
 * These serve as fallbacks if environment variables fail to load in bare workflow.
 * Values extracted from GoogleService-Info.plist and google-services.json
 */
const FIREBASE_CONFIG_FALLBACK = {
  apiKey: 'AIzaSyCzoC2pj9xCAPh8KGJI1vIRDOkhYHEvm_g',
  authDomain: 'focusefit.firebaseapp.com',
  projectId: 'focusefit',
  storageBucket: 'focusefit.firebasestorage.app',
  messagingSenderId: '1044421386248',
  appId: '1:1044421386248:ios:36d9d2612636f714c871bd',
};

/**
 * Gets Firebase configuration value with fallback support.
 * Prioritizes environment variables, falls back to hardcoded constants.
 */
function getConfigValue(envKey: string, fallbackKey: keyof typeof FIREBASE_CONFIG_FALLBACK): string {
  const envValue = process.env[envKey];

  // Check if env value exists and is not a placeholder
  if (envValue &&
      envValue !== '' &&
      envValue !== 'your-project-id' &&
      envValue !== 'your-api-key-here' &&
      !envValue.includes('your-')) {
    return envValue;
  }

  // Use fallback
  const fallbackValue = FIREBASE_CONFIG_FALLBACK[fallbackKey];
  console.log(`[Firebase Config] Using fallback for ${envKey}: ${fallbackKey}`);
  return fallbackValue;
}

// Build Firebase configuration with fallbacks
const firebaseConfig = {
  apiKey: getConfigValue('EXPO_PUBLIC_FIREBASE_API_KEY', 'apiKey'),
  authDomain: getConfigValue('EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN', 'authDomain'),
  projectId: getConfigValue('EXPO_PUBLIC_FIREBASE_PROJECT_ID', 'projectId'),
  storageBucket: getConfigValue('EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET', 'storageBucket'),
  messagingSenderId: getConfigValue('EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID', 'messagingSenderId'),
  appId: getConfigValue('EXPO_PUBLIC_FIREBASE_APP_ID', 'appId'),
};

// Validate that we have valid configuration
const isValid = firebaseConfig.apiKey &&
                firebaseConfig.projectId &&
                firebaseConfig.apiKey !== '' &&
                firebaseConfig.projectId !== '';

if (!isValid) {
  console.error('[Firebase Config] CRITICAL: Firebase configuration is invalid even after fallbacks!');
  throw new Error('Firebase configuration failed. Please check native config files.');
}

// Log configuration status (without exposing sensitive API key)
console.log('[Firebase] ✓ Configuration loaded successfully');
console.log('[Firebase] ✓ Project:', firebaseConfig.projectId);
console.log('[Firebase] ✓ Auth Domain:', firebaseConfig.authDomain);
console.log('[Firebase] ✓ Storage Bucket:', firebaseConfig.storageBucket);

// Initialize Firebase only if it hasn't been initialized yet
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Auth
const auth = getAuth(app);

// Initialize Firestore
const db = getFirestore(app);

export { app, auth, db };
