import { initializeApp } from 'firebase/app';
import { getAnalytics, isSupported as isAnalyticsSupported } from 'firebase/analytics';
import { getPerformance } from 'firebase/performance';

// Validate config to ensure required fields are present
const validateFirebaseConfig = (config: any) => {
    const requiredFields = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'];
    const missingFields = requiredFields.filter(field => !config[field]);

    if (missingFields.length > 0) {
        console.error(`Firebase initialization error: Missing required fields: ${missingFields.join(', ')}`);
        return false;
    }

    return true;
};

// Your Firebase configuration
const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
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
