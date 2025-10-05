// This file holds the configuration for connecting to your Firebase project.
// These values are injected by the build process from environment variables.
// When running in an environment without these variables (like the AI Studio IDE),
// it falls back to safe placeholder strings to allow the app to initialize without errors.

export const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY ?? 'MISSING_API_KEY_IN_IDE',
  authDomain: process.env.FIREBASE_AUTH_DOMAIN ?? 'MISSING_AUTH_DOMAIN_IN_IDE',
  projectId: process.env.FIREBASE_PROJECT_ID ?? 'MISSING_PROJECT_ID_IN_IDE',
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET ?? 'MISSING_STORAGE_BUCKET_IN_IDE',
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID ?? 'MISSING_MESSAGING_SENDER_ID_IN_IDE',
  appId: process.env.FIREBASE_APP_ID ?? 'MISSING_APP_ID_IN_IDE',
  measurementId: process.env.FIREBASE_MEASUREMENT_ID ?? 'MISSING_MEASUREMENT_ID_IN_IDE'
};