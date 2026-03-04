'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface WishlistContextType {
    items: string[]; // product IDs
    toggle: (productId: string) => void;
    isInWishlist: (productId: string) => boolean;
    count: number;
}

const WishlistContext = createContext<WishlistContextType>({
    items: [],
    toggle: () => { },
    isInWishlist: () => false,
    count: 0,
});

export function WishlistProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<string[]>([]);

    useEffect(() => {
        try {
            const stored = localStorage.getItem('sutravedic-wishlist');
            if (stored) setItems(JSON.parse(stored));
        } catch { }
    }, []);

    const toggle = (productId: string) => {
        setItems(prev => {
            const next = prev.includes(productId)
                ? prev.filter(id => id !== productId)
                : [...prev, productId];
            localStorage.setItem('sutravedic-wishlist', JSON.stringify(next));
            return next;
        });
    };

    const isInWishlist = (productId: string) => items.includes(productId);

    return (
        <WishlistContext.Provider value={{ items, toggle, isInWishlist, count: items.length }}>
            {children}
        </WishlistContext.Provider>
    );
}

export const useWishlist = () => useContext(WishlistContext);
