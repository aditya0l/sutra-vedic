'use client';

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { Product, CartItem } from '@/types';

interface CartContextType {
    items: CartItem[];
    addItem: (product: Product, quantity?: number) => void;
    removeItem: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    getItemCount: () => number;
    getSubtotal: () => number;
    getTax: () => number;
    getTotal: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);

    useEffect(() => {
        const savedCart = localStorage.getItem('sutravedic-cart');
        if (savedCart) {
            try {
                setItems(JSON.parse(savedCart));
            } catch {
                localStorage.removeItem('sutravedic-cart');
            }
        }
    }, []);

    useEffect(() => {
        if (items.length > 0) {
            localStorage.setItem('sutravedic-cart', JSON.stringify(items));
        } else {
            localStorage.removeItem('sutravedic-cart');
        }
    }, [items]);

    const addItem = useCallback((product: Product, quantity = 1) => {
        setItems(prev => {
            const existing = prev.find(item => item.product.id === product.id);
            if (existing) {
                return prev.map(item =>
                    item.product.id === product.id
                        ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock) }
                        : item
                );
            }
            return [...prev, { product, quantity: Math.min(quantity, product.stock) }];
        });
    }, []);

    const removeItem = useCallback((productId: string) => {
        setItems(prev => prev.filter(item => item.product.id !== productId));
    }, []);

    const updateQuantity = useCallback((productId: string, quantity: number) => {
        if (quantity <= 0) {
            removeItem(productId);
            return;
        }
        setItems(prev =>
            prev.map(item =>
                item.product.id === productId
                    ? { ...item, quantity: Math.min(quantity, item.product.stock) }
                    : item
            )
        );
    }, [removeItem]);

    const clearCart = useCallback(() => {
        setItems([]);
    }, []);

    const getItemCount = useCallback(() => {
        return items.reduce((total, item) => total + item.quantity, 0);
    }, [items]);

    const getSubtotal = useCallback(() => {
        return items.reduce((total, item) => total + item.product.price * item.quantity, 0);
    }, [items]);

    const getTax = useCallback(() => {
        return getSubtotal() * 0.20; // 20% TVA
    }, [getSubtotal]);

    const getTotal = useCallback(() => {
        return getSubtotal() + getTax();
    }, [getSubtotal, getTax]);

    return (
        <CartContext.Provider value={{
            items, addItem, removeItem, updateQuantity, clearCart,
            getItemCount, getSubtotal, getTax, getTotal
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
