import { initializeApp, getApp, getApps, type FirebaseApp } from 'firebase/app';
import { 
    getAuth, 
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    type User as FirebaseUser,
    type Auth,
} from 'firebase/auth';
import { firebaseConfig } from '../firebaseConfig';

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let isInitialized = false;

/**
 * Lazily initializes and returns the Firebase App instance.
 * Returns null if the configuration (e.g., API key) is missing or a placeholder.
 */
export const getFirebaseApp = (): FirebaseApp | null => {
    if (isInitialized) {
        return app;
    }
    isInitialized = true; // Attempt initialization only once.

    // Disable Firebase if the apiKey is missing or still a placeholder.
    if (!firebaseConfig.apiKey || firebaseConfig.apiKey.startsWith('YOUR_API_KEY')) {
        console.warn("Firebase config is missing or is a placeholder. Firebase features will be disabled.");
        return null;
    }
    
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    return app;
};


/**
 * Returns the Auth instance, or null if Firebase is not initialized.
 */
const getFirebaseAuth = (): Auth | null => {
    if (auth) return auth;

    const firebaseApp = getFirebaseApp();
    if (!firebaseApp) return null;
    
    auth = getAuth(firebaseApp);
    return auth;
};


/**
 * A listener that calls a callback function whenever the user's authentication state changes.
 * @param callback - The function to call with the Firebase user object or null.
 * @returns An unsubscribe function to clean up the listener.
 */
export const onAuthStateChangedListener = (callback: (user: FirebaseUser | null) => void) => {
    const authInstance = getFirebaseAuth();
    if (!authInstance) {
        // If Firebase isn't initialized, immediately call back with no user
        // and return a no-op unsubscribe function.
        callback(null);
        return () => {};
    }
    return onAuthStateChanged(authInstance, callback);
};

/**
 * Maps Firebase authentication error codes to more user-friendly messages.
 * @param error - The error object from Firebase.
 * @returns A user-friendly error message string.
 */
// Fix: Changed error type from AuthError to any to resolve property 'code' not found error.
const mapAuthError = (error: any): string => {
    switch (error.code) {
        case 'auth/email-already-in-use':
            return 'An account with this email already exists.';
        case 'auth/invalid-email':
            return 'The email address is not valid.';
        case 'auth/operation-not-allowed':
            return 'Email/password accounts are not enabled.';
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
            return 'An unexpected error occurred. Please try again.';
    }
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
        const userCredential = await createUserWithEmailAndPassword(authInstance, email, password);
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
        return await signInWithEmailAndPassword(authInstance, email, password);
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
    return await signOut(authInstance);
};