import { getAnalytics, isSupported as isAnalyticsSupported } from 'firebase/analytics';
import { initializeApp } from 'firebase/app';
import { getPerformance } from 'firebase/performance';

// Validate config to ensure required fields are present
const validateFirebaseConfig = (config: unknown) => {
  const requiredFields = [
    'apiKey',
    'authDomain',
    'projectId',
    'storageBucket',
    'messagingSenderId',
    'appId',
  ];
  const missingFields = requiredFields.filter((field) => !(config as Record<string, unknown>)[field]);

  if (missingFields.length > 0) {
    console.error(
      `Firebase initialization error: Missing required fields: ${missingFields.join(', ')}`
    );
    return false;
  }

  return true;
};

// Your Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
};

// Initialize Firebase only if the config is valid
const isValidConfig = validateFirebaseConfig(firebaseConfig);
const app = isValidConfig ? initializeApp(firebaseConfig) : null;

// Initialize Analytics with support check
const initializeAnalytics = async () => {
  if (!app) {
    console.log('Firebase Analytics initialization skipped due to invalid configuration');
    return null;
  }

  try {
    if (await isAnalyticsSupported()) {
      return getAnalytics(app);
    }
    console.log('Firebase Analytics is not supported in this environment');
    return null;
  } catch (error) {
    console.error('Error initializing Firebase Analytics:', error);
    return null;
  }
};

// Initialize Performance with support check
const initializePerformance = async () => {
  if (!app) {
    console.log('Firebase Performance initialization skipped due to invalid configuration');
    return null;
  }

  try {
    return getPerformance(app);
  } catch (error) {
    console.error('Error initializing Firebase Performance:', error);
    return null;
  }
};

export { app, initializeAnalytics, initializePerformance };
