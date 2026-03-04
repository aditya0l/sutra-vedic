'use client';

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { Product, CartItem } from '@/types';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

interface StoreSettings {
    taxRate: number;          // percentage, e.g. 20
    shippingFee: number;      // in €
    freeShippingThreshold: number; // orders above this get free shipping
}

const DEFAULT_SETTINGS: StoreSettings = { taxRate: 20, shippingFee: 0, freeShippingThreshold: 100 };

interface CartContextType {
    items: CartItem[];
    storeSettings: StoreSettings;
    addItem: (product: Product, quantity?: number, variantId?: string) => void;
    removeItem: (productId: string, variantId?: string) => void;
    updateQuantity: (productId: string, quantity: number, variantId?: string) => void;
    clearCart: () => void;
    getItemCount: () => number;
    getSubtotal: () => number;
    getTax: () => number;
    getShipping: () => number;
    getTotal: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [storeSettings, setStoreSettings] = useState<StoreSettings>(DEFAULT_SETTINGS);

    // Load cart from localStorage
    useEffect(() => {
        const savedCart = localStorage.getItem('sutravedic-cart');
        if (savedCart) {
            try { setItems(JSON.parse(savedCart)); } catch { localStorage.removeItem('sutravedic-cart'); }
        }
    }, []);

    // Persist cart to localStorage
    useEffect(() => {
        if (items.length > 0) {
            localStorage.setItem('sutravedic-cart', JSON.stringify(items));
        } else {
            localStorage.removeItem('sutravedic-cart');
        }
    }, [items]);

    // Load store settings from Firestore
    useEffect(() => {
        getDoc(doc(db, 'settings', 'storeSettings'))
            .then(snap => {
                if (snap.exists()) {
                    setStoreSettings({ ...DEFAULT_SETTINGS, ...snap.data() } as StoreSettings);
                }
            })
            .catch(() => { }); // graceful fallback to defaults
    }, []);

    const addItem = useCallback((product: Product, quantity = 1, variantId?: string) => {
        setItems(prev => {
            const existing = prev.find(item => item.product.id === product.id && item.variantId === variantId);
            if (existing) {
                return prev.map(item =>
                    item.product.id === product.id && item.variantId === variantId
                        ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock) }
                        : item
                );
            }
            return [...prev, { product, quantity: Math.min(quantity, product.stock), variantId }];
        });
    }, []);

    const removeItem = useCallback((productId: string, variantId?: string) => {
        setItems(prev => prev.filter(item => !(item.product.id === productId && item.variantId === variantId)));
    }, []);

    const updateQuantity = useCallback((productId: string, quantity: number, variantId?: string) => {
        if (quantity <= 0) { removeItem(productId, variantId); return; }
        setItems(prev =>
            prev.map(item =>
                item.product.id === productId && item.variantId === variantId
                    ? { ...item, quantity: Math.min(quantity, item.product.stock) }
                    : item
            )
        );
    }, [removeItem]);

    const clearCart = useCallback(() => setItems([]), []);

    const getItemCount = useCallback(() => items.reduce((t, i) => t + i.quantity, 0), [items]);

    const getSubtotal = useCallback(() => {
        return items.reduce((total, item) => {
            const variant = item.variantId && item.product.variants
                ? item.product.variants.find(v => v.id === item.variantId)
                : null;
            const price = variant ? variant.price : item.product.price;
            return total + price * item.quantity;
        }, 0);
    }, [items]);

    const getTax = useCallback(() => {
        return getSubtotal() * (storeSettings.taxRate / 100);
    }, [getSubtotal, storeSettings.taxRate]);

    const getShipping = useCallback(() => {
        const subtotal = getSubtotal();
        if (storeSettings.shippingFee === 0) return 0; // always free
        if (storeSettings.freeShippingThreshold > 0 && subtotal >= storeSettings.freeShippingThreshold) return 0;
        return storeSettings.shippingFee;
    }, [getSubtotal, storeSettings]);

    const getTotal = useCallback(() => {
        return getSubtotal() + getTax() + getShipping();
    }, [getSubtotal, getTax, getShipping]);

    return (
        <CartContext.Provider value={{
            items, storeSettings, addItem, removeItem, updateQuantity, clearCart,
            getItemCount, getSubtotal, getTax, getShipping, getTotal
        }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) throw new Error('useCart must be used within CartProvider');
    return context;
}
