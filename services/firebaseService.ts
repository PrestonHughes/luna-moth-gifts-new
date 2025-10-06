
import { auth } from '../firebase';
import type firebase from 'firebase/compat/app';

/**
 * Throws a user-friendly error if Firebase Auth is not available.
 */
const checkAuthAvailability = () => {
    if (!auth) {
        const userMessage = "Authentication is not available. This is expected in the IDE. If you see this on the live website, the configuration is incomplete.";
        throw new Error(userMessage);
    }
};

/**
 * A listener that calls a callback function whenever the user's authentication state changes.
 * @param callback - The function to call with the Firebase user object or null.
 * @returns An unsubscribe function to clean up the listener.
 */
export const onAuthStateChangedListener = (callback: (user: firebase.User | null) => void) => {
    // In IDE mode, auth will be null. The app will behave as if the user is logged out.
    if (!auth) {
        callback(null);
        return () => {}; // Return a no-op unsubscribe function
    }
    
    return auth.onAuthStateChanged(callback);
};

/**
 * Maps Firebase authentication error codes to more user-friendly messages.
 * @param error - The error object from Firebase.
 * @returns A user-friendly error message string.
 */
const mapAuthError = (error: any): string => {
    // If it's a generic error with a message (like our custom config error), use it directly.
    if (error instanceof Error && !('code' in error)) {
        return error.message;
    }

    if (error && error.code) {
        switch (error.code) {
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

    console.error('Unknown error during authentication:', error);
    return 'An unexpected error occurred. Please try again.';
};

/**
 * Signs up a new user with an email and password.
 * @param email - The user's email.
 * @param password - The user's password.
 * @returns A promise that resolves with the created Firebase user object.
 */
export const signUpWithEmail = async (email: string, password: string): Promise<firebase.User> => {
    try {
        checkAuthAvailability();
        const userCredential = await auth!.createUserWithEmailAndPassword(email, password);
        if (!userCredential.user) {
            throw new Error("Sign up successful, but no user object was returned.");
        }
        return userCredential.user;
    } catch (error) {
        throw new Error(mapAuthError(error));
    }
};

/**
 * Signs in an existing user with an email and password.
 * @param email - The user's email.
 * @param password - The user's password.
 * @returns A promise that resolves with the signed-in Firebase user object.
 */
export const signInWithEmail = async (email: string, password: string): Promise<firebase.User> => {
     try {
        checkAuthAvailability();
        const userCredential = await auth!.signInWithEmailAndPassword(email, password);
        if (!userCredential.user) {
            throw new Error("Login successful, but no user object was returned.");
        }
        return userCredential.user;
    } catch (error) {
        throw new Error(mapAuthError(error));
    }
};

/**
 * Signs out the currently logged-in user.
 * @returns A promise that resolves when the user has been signed out.
 */
export const signOutUser = async () => {
    if (!auth) return;
    return await auth.signOut();
};
