/**
 * Sutra Vedic — Backend API Client
 * Replaces all mock-data imports with real API calls.
 */

import { Product, Category, Review, Order, User } from '@/types';
import { auth as firebaseAuth, db } from './firebase';
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    updateProfile
} from 'firebase/auth';
import {
    collection,
    getDocs,
    getDoc,
    doc,
    query,
    where,
    orderBy,
    limit as firestoreLimit,
    addDoc,
    updateDoc
} from 'firebase/firestore';

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface AuthResponse {
    user: User;
    accessToken: string;
    refreshToken: string;
}

export const auth = {
    async login(email: string, password: string): Promise<AuthResponse> {
        const userCredential = await signInWithEmailAndPassword(firebaseAuth, email, password);
        const token = await userCredential.user.getIdToken();

        // Simulating the backend response format for compatibility with existing UI
        const authData = {
            user: {
                id: userCredential.user.uid,
                email: userCredential.user.email!,
                name: userCredential.user.displayName || email.split('@')[0],
                role: 'customer' as const,
                createdAt: userCredential.user.metadata.creationTime || new Date().toISOString()
            },
            accessToken: token,
            refreshToken: userCredential.user.refreshToken
        };

        localStorage.setItem('sutravedic-token', token);
        return authData;
    },

    async register(name: string, email: string, password: string): Promise<AuthResponse> {
        const userCredential = await createUserWithEmailAndPassword(firebaseAuth, email, password);

        // Update display name
        await updateProfile(userCredential.user, { displayName: name });
        const token = await userCredential.user.getIdToken();

        const authData = {
            user: {
                id: userCredential.user.uid,
                email: userCredential.user.email!,
                name: name,
                role: 'customer' as const,
                createdAt: new Date().toISOString()
            },
            accessToken: token,
            refreshToken: userCredential.user.refreshToken
        };

        localStorage.setItem('sutravedic-token', token);
        return authData;
    },

    async refresh(): Promise<{ accessToken: string; refreshToken: string }> {
        // Firebase automatically handles token refreshes internally if the user is signed in.
        // If we strictly need a fresh token right now:
        const user = firebaseAuth.currentUser;
        if (!user) throw new Error('No user is currently signed in');

        const token = await user.getIdToken(true);
        localStorage.setItem('sutravedic-token', token);

        return {
            accessToken: token,
            refreshToken: user.refreshToken
        };
    },

    async logout(): Promise<void> {
        await signOut(firebaseAuth);
        localStorage.removeItem('sutravedic-token');
        localStorage.removeItem('sutravedic-refresh-token');
    },

    isLoggedIn(): boolean {
        if (typeof window === 'undefined') return false;
        // Check local storage for quick synchronous checks, but remember Firebase Auth state is the real source of truth
        return !!localStorage.getItem('sutravedic-token');
    },

    getToken(): string | null {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem('sutravedic-token');
    },
};

// ─── Products ─────────────────────────────────────────────────────────────────

export interface ProductListResult {
    data: Product[];
    meta: { total: number; page: number; pages: number; limit: number };
}

export const productsApi = {
    async list(params?: {
        category?: string;
        search?: string;
        sort?: string;
        isBestseller?: boolean;
        isNew?: boolean;
        page?: number;
        limit?: number;
    }): Promise<ProductListResult> {
        let q = collection(db, 'products');
        let queryConstraints: any[] = [];

        if (params?.category) {
            queryConstraints.push(where('category', '==', params.category));
        }
        if (params?.isBestseller) {
            queryConstraints.push(where('isBestseller', '==', true));
        }
        if (params?.isNew) {
            queryConstraints.push(where('isNew', '==', true));
        }
        if (params?.sort === 'price_asc') {
            queryConstraints.push(orderBy('price', 'asc'));
        } else if (params?.sort === 'price_desc') {
            queryConstraints.push(orderBy('price', 'desc'));
        }

        // Note: Firestore doesn't natively support full-text search easily like SQL. 
        // For 'search', a third-party service like Algolia is usually recommended, 
        // but we'll fetch everything and filter client-side for this MVP if search is used.

        let finalQuery = queryConstraints.length > 0 ? query(q, ...queryConstraints) : q;
        const snapshot = await getDocs(finalQuery);

        let products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));

        if (params?.search) {
            products = products.filter(p => p.name.en.toLowerCase().includes(params.search!.toLowerCase()) || p.description.en.toLowerCase().includes(params.search!.toLowerCase()));
        }

        // Fake pagination metadata since Firestore pagination requires cursors
        return {
            data: products,
            meta: { total: products.length, page: 1, pages: 1, limit: products.length }
        };
    },

    async getBySlug(slug: string): Promise<Product> {
        const q = query(collection(db, 'products'), where('slug', '==', slug));
        const snapshot = await getDocs(q);
        if (snapshot.empty) throw new Error("Product not found");
        const doc = snapshot.docs[0];
        return { id: doc.id, ...doc.data() } as Product;
    },

    async getReviews(slug: string): Promise<Review[]> {
        // Technically reviews should be subcollections or tied to product ID, but matching by slug here for simplicity based on old API
        const q = query(collection(db, 'reviews'), where('productSlug', '==', slug));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Review));
    },
};

// ─── Categories ───────────────────────────────────────────────────────────────

export const categoriesApi = {
    async list(): Promise<Category[]> {
        const snapshot = await getDocs(collection(db, 'categories'));
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));
    },
};

// ─── Orders ───────────────────────────────────────────────────────────────────

export interface CheckoutPayload {
    items: { productId: string; quantity: number; variantId?: string }[];
    shippingAddress: {
        firstName: string;
        lastName: string;
        address: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
        phone: string;
    };
    email?: string;
    guestName?: string;
    locale?: 'fr' | 'en';
}

export const ordersApi = {
    async create(payload: CheckoutPayload): Promise<{ id: string; totalAmount: number; idempotencyKey: string }> {
        const user = firebaseAuth.currentUser;

        // Simplified Total Amount Calculation for MVP Firebase Migration
        let totalAmount = 0;
        const enrichedItems = [];
        for (const item of payload.items) {
            const productDoc = await getDoc(doc(db, 'products', item.productId));
            if (productDoc.exists()) {
                const productData = productDoc.data() as Product;
                let price = productData.price;
                let variantName = undefined;

                // Track stock updates for this product document
                let newTotalStock = productData.stock || 0;
                let updatedVariants = productData.variants ? [...productData.variants] : undefined;

                if (item.variantId && updatedVariants) {
                    const variantIndex = updatedVariants.findIndex(v => v.id === item.variantId);
                    if (variantIndex !== -1) {
                        const variant = updatedVariants[variantIndex];
                        price = variant.price;
                        variantName = typeof variant.name === 'object' ? (variant.name.en || variant.name.fr) : variant.name;

                        // Decrement variant stock
                        const currentVariantStock = variant.stock || 0;
                        updatedVariants[variantIndex] = {
                            ...variant,
                            stock: Math.max(0, currentVariantStock - item.quantity)
                        };
                    }
                } else {
                    // Decrement base product stock if no variant
                    newTotalStock = Math.max(0, newTotalStock - item.quantity);
                }

                totalAmount += (price * item.quantity);

                enrichedItems.push({
                    productId: item.productId,
                    variantId: item.variantId,
                    quantity: item.quantity,
                    unitPrice: price,
                    productSnapshot: {
                        name: productData.name,
                        category: productData.category,
                        variantName: variantName
                    }
                });

                // Apply stock updates to Firestore
                try {
                    const updatePayload: any = {};
                    if (updatedVariants) {
                        updatePayload.variants = updatedVariants;
                    } else {
                        updatePayload.stock = newTotalStock;
                    }
                    await updateDoc(doc(db, 'products', item.productId), updatePayload);
                } catch (err) {
                    console.error(`Failed to update stock for product ${item.productId}:`, err);
                }
            }
        }

        const newOrder = {
            userId: user?.uid || null,
            userEmail: user?.email || null, // Firebase account email (separate from shipping form email)
            guestName: payload.guestName || payload.shippingAddress.firstName + ' ' + payload.shippingAddress.lastName,
            email: payload.email,
            shippingAddress: payload.shippingAddress,
            locale: payload.locale || 'en',
            items: enrichedItems,
            totalAmount,
            status: 'pending_payment',
            createdAt: new Date().toISOString(),
        };

        // Firestore crashes if ANY nested attribute is explicitly `undefined`
        const removeUndefinedDeep = (obj: any): any => {
            if (Array.isArray(obj)) {
                return obj.map(removeUndefinedDeep).filter(v => v !== undefined);
            } else if (obj !== null && typeof obj === 'object') {
                return Object.fromEntries(
                    Object.entries(obj)
                        .map(([k, v]) => [k, removeUndefinedDeep(v)])
                        .filter(([_, v]) => v !== undefined)
                );
            }
            return obj;
        };

        const cleanOrder = removeUndefinedDeep(newOrder);

        const docRef = await addDoc(collection(db, 'orders'), cleanOrder);

        return {
            id: docRef.id,
            totalAmount,
            idempotencyKey: docRef.id
        };
    },

    async list(): Promise<Order[]> {
        const user = firebaseAuth.currentUser;
        if (!user) throw new Error("Must be logged in to view orders");

        // Query by userId
        const byUserId = await getDocs(
            query(collection(db, 'orders'), where('userId', '==', user.uid))
        );

        // Query by Firebase account email (userEmail field - for logged-in users who typed different email)
        const byUserEmail = user.email ? await getDocs(
            query(collection(db, 'orders'), where('userEmail', '==', user.email))
        ) : { docs: [] as any[] };

        // Query by form email (for guest orders that used same email as account)
        const byEmail = user.email ? await getDocs(
            query(collection(db, 'orders'), where('email', '==', user.email))
        ) : { docs: [] as any[] };

        // Merge and deduplicate by document ID
        const seen = new Set<string>();
        const allOrders: Order[] = [];
        for (const d of [...byUserId.docs, ...byUserEmail.docs, ...byEmail.docs]) {
            if (!seen.has(d.id)) {
                seen.add(d.id);
                allOrders.push({ id: d.id, ...d.data() } as unknown as Order);
            }
        }

        // Sort newest first client-side (no composite index needed)
        allOrders.sort((a: any, b: any) => b.createdAt?.localeCompare?.(a.createdAt) ?? 0);
        return allOrders;
    },

    async getById(id: string): Promise<Order> {
        const docRef = await getDoc(doc(db, 'orders', id));
        if (!docRef.exists()) throw new Error("Order not found");
        return { id: docRef.id, ...docRef.data() } as unknown as Order;
    },
};

// ─── Payments ─────────────────────────────────────────────────────────────────

export const paymentsApi = {
    async createStripeIntent(orderId: string): Promise<{ clientSecret: string }> {
        // Without a custom backend, secure Stripe payments usually require a Cloud Function to mint the intent.
        // For a raw frontend rewrite, you'd integrate the Stripe Next.js proxy here, or stub it out if testing.
        throw new Error("Stripe Intents require a secure Cloud Function backend environment or edge proxy.");
    },
};

// ─── Customer ─────────────────────────────────────────────────────────────────

export const customerApi = {
    async getProfile(): Promise<User & { phone?: string }> {
        const user = firebaseAuth.currentUser;
        if (!user) throw new Error("Not logged in");

        const docRef = await getDoc(doc(db, 'users', user.uid));

        if (docRef.exists()) {
            return { id: user.uid, ...docRef.data() } as User & { phone?: string };
        } else {
            // Fallback to Auth state
            return {
                id: user.uid,
                email: user.email!,
                name: user.displayName || 'Customer',
                role: 'customer'
            }
        }
    },

    async updateProfile(data: { name?: string; phone?: string }): Promise<User> {
        const user = firebaseAuth.currentUser;
        if (!user) throw new Error("Not logged in");

        if (data.name) {
            await updateProfile(user, { displayName: data.name });
        }

        // Update custom `users` collection manually
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, { ...data, updatedAt: new Date().toISOString() });

        return this.getProfile();
    },
};
