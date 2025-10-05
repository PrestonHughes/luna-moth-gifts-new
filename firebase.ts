
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

// This file holds the configuration for connecting to your Firebase project.
// These values are injected by the build process from environment variables.
// When running in an environment without these variables (like the AI Studio IDE),
// it falls back to safe placeholder strings, and the services will not be initialized.

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY ?? 'MISSING_API_KEY_IN_IDE',
  authDomain: process.env.FIREBASE_AUTH_DOMAIN ?? 'MISSING_AUTH_DOMAIN_IN_IDE',
  projectId: process.env.FIREBASE_PROJECT_ID ?? 'MISSING_PROJECT_ID_IN_IDE',
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET ?? 'MISSING_STORAGE_BUCKET_IN_IDE',
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID ?? 'MISSING_MESSAGING_SENDER_ID_IN_IDE',
  appId: process.env.FIREBASE_APP_ID ?? 'MISSING_APP_ID_IN_IDE',
  measurementId: process.env.FIREBASE_MEASUREMENT_ID ?? 'MISSING_MEASUREMENT_ID_IN_IDE'
};

let app: firebase.app.App | null = null;

// Initialize Firebase only if the config is valid (i.e., not in the IDE)
const hasMissingKeys = Object.values(firebaseConfig).some(
    value => typeof value === 'string' && value.startsWith('MISSING_')
);

if (!hasMissingKeys) {
    // Standard guard against re-initializing the app
    if (!firebase.apps.length) {
        app = firebase.initializeApp(firebaseConfig);
    } else {
        app = firebase.app();
    }
} else {
    // This is the expected path in the IDE. Firebase features will be disabled.
    console.log("Firebase config keys not found. Running in limited IDE mode.");
}

// Export the initialized services. They will be null in the IDE.
export const auth = app ? firebase.auth() : null;
export const db = app ? firebase.firestore() : null;
