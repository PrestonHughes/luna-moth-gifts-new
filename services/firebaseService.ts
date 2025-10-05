// FIX: Changed to namespace imports to resolve module resolution issues with Firebase SDK.
import * as firebaseAppNs from 'firebase/app';
import * as firebaseAuthNs from 'firebase/auth';
import { firebaseConfig } from '../firebaseConfig';

let app: firebaseAppNs.FirebaseApp | null = null;
let auth: firebaseAuthNs.Auth | null = null;
let isInitialized = false;

/**
 * Lazily initializes and returns the Firebase App instance.
 * Returns null if the configuration (e.g., API key) is missing or a placeholder.
 */
export const getFirebaseApp = (): firebaseAppNs.FirebaseApp | null => {
    if (isInitialized) {
        return app;
    }
    isInitialized = true; // Attempt initialization only once.

    // Disable Firebase if the apiKey is missing or still a placeholder.
    if (!firebaseConfig.apiKey || firebaseConfig.apiKey.startsWith('YOUR_API_KEY')) {
        console.warn("Firebase config is missing or is a placeholder. Firebase features will be disabled.");
        return null;
    }
    
    app = !firebaseAppNs.getApps().length ? firebaseAppNs.initializeApp(firebaseConfig) : firebaseAppNs.getApp();
    return app;
};


/**
 * Returns the Auth instance, or null if Firebase is not initialized.
 */
const getFirebaseAuth = (): firebaseAuthNs.Auth | null => {
    if (auth) return auth;

    const firebaseApp = getFirebaseApp();
    if (!firebaseApp) return null;
    
    auth = firebaseAuthNs.getAuth(firebaseApp);
    return auth;
};


/**
 * A listener that calls a callback function whenever the user's authentication state changes.
 * @param callback - The function to call with the Firebase user object or null.
 * @returns An unsubscribe function to clean up the listener.
 */
export const onAuthStateChangedListener = (callback: (user: firebaseAuthNs.User | null) => void) => {
    const authInstance = getFirebaseAuth();
    if (!authInstance) {
        // If Firebase isn't initialized, immediately call back with no user
        // and return a no-op unsubscribe function.
        callback(null);
        return () => {};
    }
    return firebaseAuthNs.onAuthStateChanged(authInstance, callback);
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
    if (!authInstance) throw new Error("Firebase is not configured in this environment.");

    try {
        const userCredential = await firebaseAuthNs.createUserWithEmailAndPassword(authInstance, email, password);
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
    if (!authInstance) throw new Error("Firebase is not configured in this environment.");

    try {
        return await firebaseAuthNs.signInWithEmailAndPassword(authInstance, email, password);
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
    return await firebaseAuthNs.signOut(authInstance);
};