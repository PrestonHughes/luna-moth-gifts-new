import { getFirestore, doc, getDoc, setDoc, updateDoc, type Firestore } from 'firebase/firestore';
import { getFirebaseApp } from './firebaseService';
import type { User, CartItem } from '../types';

let db: Firestore | null = null;
let isDbInitialized = false;

/**
 * Lazily initializes and returns the Firestore instance.
 * Returns null if Firebase app is not available.
 */
const getDb = (): Firestore | null => {
    if (isDbInitialized) return db;
    isDbInitialized = true;

    const app = getFirebaseApp();
    if (app) {
        db = getFirestore(app);
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

    const userDocRef = doc(firestoreDb, 'users', uid);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
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

    const userDocRef = doc(firestoreDb, 'users', user.uid);
    // Create a new user profile with default/initial values
    const newUserProfile: User = {
        uid: user.uid,
        email: user.email,
        firstName: '',
        lastName: '',
        orders: [], // Initialize with empty orders
    };
    await setDoc(userDocRef, newUserProfile);
};

/**
 * Updates a user's profile in Firestore.
 * @param uid The user's unique ID.
 * @param data An object containing the fields to update (e.g., { firstName: 'Jane' }).
 */
export const updateUserProfile = async (uid: string, data: Partial<User>) => {
    const firestoreDb = getDb();
    if (!firestoreDb) return;

    const userDocRef = doc(firestoreDb, 'users', uid);
    await updateDoc(userDocRef, data);
};

/**
 * Fetches a user's cart from Firestore.
 * @param uid The user's unique ID.
 * @returns An array of CartItem objects or an empty array if not found or DB is unavailable.
 */
export const getCart = async (uid: string): Promise<CartItem[]> => {
    const firestoreDb = getDb();
    if (!firestoreDb) return [];

    const cartDocRef = doc(firestoreDb, 'carts', uid);
    const cartDocSnap = await getDoc(cartDocRef);

    if (cartDocSnap.exists() && cartDocSnap.data().items) {
        return cartDocSnap.data().items as CartItem[];
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
    
    const cartDocRef = doc(firestoreDb, 'carts', uid);
    await setDoc(cartDocRef, { items: cartItems });
};