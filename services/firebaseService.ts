
// Fix: Use Firebase v8 compat imports to match the likely installed SDK version.
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { firebaseConfig } from '../firebaseConfig';

let app: firebase.app.App | null = null;
let auth: firebase.auth.Auth | null = null;
let isInitialized = false;

/**
 * Lazily initializes and returns the Firebase App instance.
 * Returns null if the configuration is incomplete or initialization fails.
 */
export const getFirebaseApp = (): firebase.app.App | null => {
    if (isInitialized) {
        return app;
    }
    isInitialized = true; // Attempt initialization only once.

    try {
        // Fix: Use v8 compat initialization check.
        if (!firebase.apps.length) {
            app = firebase.initializeApp(firebaseConfig);
        } else {
            app = firebase.app();
        }
    } catch (error) {
        console.error("Failed to initialize Firebase. This is expected in the IDE if using placeholder keys. In a deployed environment, check your build variables.", error);
        app = null;
    }
    
    return app;
};


/**
 * Returns the Auth instance, or null if Firebase is not initialized.
 */
const getFirebaseAuth = (): firebase.auth.Auth | null => {
    if (auth) return auth;

    const firebaseApp = getFirebaseApp();
    if (!firebaseApp) return null;
    
    // Fix: Use v8 compat auth instance retrieval.
    auth = firebase.auth(firebaseApp);
    return auth;
};


/**
 * A listener that calls a callback function whenever the user's authentication state changes.
 * @param callback - The function to call with the Firebase user object or null.
 * @returns An unsubscribe function to clean up the listener.
 */
// Fix: Use firebase.User type from the compat SDK.
export const onAuthStateChangedListener = (callback: (user: firebase.User | null) => void) => {
    const authInstance = getFirebaseAuth();
    if (!authInstance) {
        // If Firebase isn't initialized, immediately call back with no user
        // and return a no-op unsubscribe function.
        callback(null);
        return () => {};
    }
    // Fix: Use v8 compat onAuthStateChanged method.
    return authInstance.onAuthStateChanged(callback);
};

/**
 * Maps Firebase authentication error codes to more user-friendly messages.
 * This is now more robust to handle both Firebase errors and generic configuration errors.
 * @param error - The error object from Firebase.
 * @returns A user-friendly error message string.
 */
const mapAuthError = (error: any): string => {
    // If it's a Firebase error with a code, handle it specifically.
    if (error && error.code) {
        switch (error.code) {
            // Provide a specific, actionable error for configuration issues.
            case 'auth/configuration-not-found':
            case 'auth/invalid-api-key':
                return 'Firebase setup is incomplete. This is likely an issue with the build configuration. Please contact support.';
            case 'auth/email-already-in-use':
                return 'An account with this email already exists.';
            case 'auth/invalid-email':
                return 'The email address is not valid.';
            case 'auth/operation-not-allowed':
                return 'Email/password accounts are not enabled in the Firebase console.';
            case 'auth/weak-password':
                return 'The password is too weak. Please use at least 6 characters.';
            case 'auth/user-disabled':
                return 'This user account has been disabled.';
            case 'auth/user-not-found':
            case 'auth/wrong-password':
            case 'auth/invalid-credential':
                return 'Invalid email or password.';
            default:
                console.error('Unhandled Firebase Auth Error:', error);
                return `An unexpected error occurred: ${error.message}`;
        }
    }

    // If it's a generic error from our setup (like missing config), return its message directly.
    if (error instanceof Error) {
        return error.message;
    }

    // Fallback for unknown error types.
    console.error('Unknown error during authentication:', error);
    return 'An unexpected error occurred. Please try again.';
};


/**
 * Signs up a new user with an email and password.
 * This function now also triggers the creation of a user profile document in Firestore.
 * @param email - The user's email.
 * @param password - The user's password.
 * @returns A promise that resolves with the created user's credentials.
 */
export const signUpWithEmail = async (email: string, password: string) => {
    const authInstance = getFirebaseAuth();
    if (!authInstance) throw new Error("Firebase is not properly configured. Check the browser console for details.");

    try {
        // Fix: Use v8 compat createUserWithEmailAndPassword method.
        const userCredential = await authInstance.createUserWithEmailAndPassword(email, password);
        // The onAuthStateChanged listener in App.tsx will handle creating the user profile.
        return userCredential;
    } catch (error) {
        throw new Error(mapAuthError(error));
    }
};

/**
 * Signs in an existing user with an email and password.
 * @param email - The user's email.
 * @param password - The user's password.
 * @returns A promise that resolves with the signed-in user's credentials.
 */
export const signInWithEmail = async (email: string, password: string) => {
    const authInstance = getFirebaseAuth();
    if (!authInstance) throw new Error("Firebase is not properly configured. Check the browser console for details.");

    try {
        // Fix: Use v8 compat signInWithEmailAndPassword method.
        return await authInstance.signInWithEmailAndPassword(email, password);
    } catch (error) {
        throw new Error(mapAuthError(error));
    }
};

/**
 * Signs out the currently logged-in user.
 * @returns A promise that resolves when the user has been signed out.
 */
export const signOutUser = async () => {
    const authInstance = getFirebaseAuth();
    if (!authInstance) return;
    // Fix: Use v8 compat signOut method.
    return await authInstance.signOut();
};