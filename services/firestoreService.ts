
import { db } from '../firebase';
import type { User, CartItem } from '../types';
import firebase from 'firebase/compat/app';

/**
 * Fetches a user's profile from Firestore.
 * @param uid The user's unique ID from Firebase Auth.
 * @returns The user's profile data or null if not found or DB is unavailable.
 */
export const getUserProfile = async (uid: string): Promise<User | null> => {
    if (!db) return null;

    const userDocRef = db.collection('users').doc(uid);
    const userDocSnap = await userDocRef.get();

    if (userDocSnap.exists) {
        return userDocSnap.data() as User;
    } else {
        console.log("No such user profile!");
        return null;
    }
};

/**
 * Creates a new user profile document in Firestore and returns it.
 * This is typically called right after a user signs up.
 * @param user The user object containing uid and email.
 * @returns The newly created user profile object.
 */
export const createUserProfile = async (user: { uid: string; email: string; }): Promise<User> => {
    if (!db) {
        // In a real app, you might want to throw an error or handle this more gracefully.
        // For this project, returning a default object allows the UI to proceed without crashing in IDE mode.
        return { 
            uid: user.uid, 
            email: user.email, 
            firstName: '', 
            lastName: '', 
            orders: [] 
        };
    }

    const userDocRef = db.collection('users').doc(user.uid);
    // Create a new user profile with default/initial values
    const newUserProfile: User = {
        uid: user.uid,
        email: user.email,
        firstName: '',
        lastName: '',
        orders: [], // Initialize with empty orders
    };
    await userDocRef.set(newUserProfile);
    return newUserProfile;
};

/**
 * Updates a user's profile in Firestore.
 * @param uid The user's unique ID.
 * @param data An object containing the fields to update (e.g., { firstName: 'Jane' }).
 */
export const updateUserProfile = async (uid: string, data: Partial<User>) => {
    if (!db) return;

    const userDocRef = db.collection('users').doc(uid);
    await userDocRef.update(data);
};

/**
 * Fetches a user's cart from Firestore.
 * @param uid The user's unique ID.
 * @returns An array of CartItem objects or an empty array if not found or DB is unavailable.
 */
export const getCart = async (uid: string): Promise<CartItem[]> => {
    if (!db) return [];

    const cartDocRef = db.collection('carts').doc(uid);
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
    if (!db) return;
    
    const cartDocRef = db.collection('carts').doc(uid);
    await cartDocRef.set({ items: cartItems });
};

/**
 * Gets the number of visual searches a user has performed in the last 24 hours.
 * @param uid The user's unique ID.
 * @returns The number of searches.
 */
export const getVisualSearchesToday = async (uid: string): Promise<number> => {
    if (!db) return 0;

    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

    const searchesRef = db.collection('visual_searches');
    // Note: This query requires a composite index in Firestore on 'uid' and 'timestamp'.
    // Firestore will provide a link in the console error to create it automatically if it doesn't exist.
    const query = searchesRef.where('uid', '==', uid).where('timestamp', '>=', twentyFourHoursAgo);
    
    try {
        const snapshot = await query.get();
        return snapshot.size;
    } catch (error) {
        console.error("Error fetching visual searches count. This may require creating a Firestore index:", error);
        return 0; // Fail gracefully
    }
};

/**
 * Logs a visual search event for a user in Firestore.
 * @param uid The user's unique ID.
 */
export const logVisualSearch = async (uid: string): Promise<void> => {
    if (!db) return;

    const searchesRef = db.collection('visual_searches');
    await searchesRef.add({
        uid,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
};