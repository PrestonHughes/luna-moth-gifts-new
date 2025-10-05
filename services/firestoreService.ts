
// Fix: Use Firebase v8 compat imports to match the likely installed SDK version.
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { getFirebaseApp } from './firebaseService';
import type { User, CartItem } from '../types';

let db: firebase.firestore.Firestore | null = null;
let isDbInitialized = false;

/**
 * Lazily initializes and returns the Firestore instance.
 * Returns null if Firebase app is not available.
 */
const getDb = (): firebase.firestore.Firestore | null => {
    if (isDbInitialized) return db;
    isDbInitialized = true;

    const app = getFirebaseApp();
    if (app) {
        // Fix: Use v8 compat firestore instance retrieval.
        db = app.firestore();
    }
    return db;
};

/**
 * Fetches a user's profile from Firestore.
 * @param uid The user's unique ID from Firebase Auth.
 * @returns The user's profile data or null if not found or DB is unavailable.
 */
export const getUserProfile = async (uid: string): Promise<User | null> => {
    const firestoreDb = getDb();
    if (!firestoreDb) return null;

    // Fix: Use v8 compat API for document fetching.
    const userDocRef = firestoreDb.collection('users').doc(uid);
    const userDocSnap = await userDocRef.get();

    if (userDocSnap.exists) {
        // We can safely cast here because we control what we save.
        return userDocSnap.data() as User;
    } else {
        console.log("No such user profile!");
        return null;
    }
};

/**
 * Creates a new user profile document in Firestore.
 * This is typically called right after a user signs up.
 * @param user The user object containing uid and email.
 */
export const createUserProfile = async (user: { uid: string; email: string; }) => {
    const firestoreDb = getDb();
    if (!firestoreDb) return;

    // Fix: Use v8 compat API for setting a document.
    const userDocRef = firestoreDb.collection('users').doc(user.uid);
    // Create a new user profile with default/initial values
    const newUserProfile: User = {
        uid: user.uid,
        email: user.email,
        firstName: '',
        lastName: '',
        orders: [], // Initialize with empty orders
    };
    await userDocRef.set(newUserProfile);
};

/**
 * Updates a user's profile in Firestore.
 * @param uid The user's unique ID.
 * @param data An object containing the fields to update (e.g., { firstName: 'Jane' }).
 */
export const updateUserProfile = async (uid: string, data: Partial<User>) => {
    const firestoreDb = getDb();
    if (!firestoreDb) return;

    // Fix: Use v8 compat API for updating a document.
    const userDocRef = firestoreDb.collection('users').doc(uid);
    await userDocRef.update(data);
};

/**
 * Fetches a user's cart from Firestore.
 * @param uid The user's unique ID.
 * @returns An array of CartItem objects or an empty array if not found or DB is unavailable.
 */
export const getCart = async (uid: string): Promise<CartItem[]> => {
    const firestoreDb = getDb();
    if (!firestoreDb) return [];

    // Fix: Use v8 compat API for document fetching.
    const cartDocRef = firestoreDb.collection('carts').doc(uid);
    const cartDocSnap = await cartDocRef.get();

    if (cartDocSnap.exists && (cartDocSnap.data() as any)?.items) {
        return (cartDocSnap.data() as any).items as CartItem[];
    } else {
        return [];
    }
};

/**
 * Updates/saves a user's cart to Firestore.
 * @param uid The user's unique ID.
 * @param cartItems The current array of items in the cart.
 */
export const updateCart = async (uid: string, cartItems: CartItem[]) => {
    const firestoreDb = getDb();
    if (!firestoreDb) return;
    
    // Fix: Use v8 compat API for setting a document.
    const cartDocRef = firestoreDb.collection('carts').doc(uid);
    await cartDocRef.set({ items: cartItems });
};
