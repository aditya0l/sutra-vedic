/**
 * Sutra Vedic — Backend API Client
 * Replaces all mock-data imports with real API calls.
 */

import { Product, Category, Review, Order, User } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('sutravedic-token') : null;

    const res = await fetch(`${API_URL}${path}`, {
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        ...options,
    });

    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'API request failed');
    return json.data as T;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface AuthResponse {
    user: User;
    accessToken: string;
    refreshToken: string;
}

export const auth = {
    async login(email: string, password: string): Promise<AuthResponse> {
        const json = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        }).then(r => r.json());
        if (!json.success) throw new Error(json.message);
        localStorage.setItem('sutravedic-token', json.data.accessToken);
        localStorage.setItem('sutravedic-refresh-token', json.data.refreshToken);
        return json.data;
    },

    async register(name: string, email: string, password: string): Promise<AuthResponse> {
        const json = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password }),
        }).then(r => r.json());
        if (!json.success) throw new Error(json.message);
        localStorage.setItem('sutravedic-token', json.data.accessToken);
        localStorage.setItem('sutravedic-refresh-token', json.data.refreshToken);
        return json.data;
    },

    async refresh(): Promise<{ accessToken: string; refreshToken: string }> {
        const refreshToken = localStorage.getItem('sutravedic-refresh-token');
        if (!refreshToken) throw new Error('No refresh token');
        const json = await fetch(`${API_URL}/auth/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken }),
        }).then(r => r.json());
        if (!json.success) throw new Error(json.message);
        localStorage.setItem('sutravedic-token', json.data.accessToken);
        localStorage.setItem('sutravedic-refresh-token', json.data.refreshToken);
        return json.data;
    },

    logout() {
        localStorage.removeItem('sutravedic-token');
        localStorage.removeItem('sutravedic-refresh-token');
    },

    isLoggedIn(): boolean {
        if (typeof window === 'undefined') return false;
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
        const qs = new URLSearchParams();
        if (params?.category) qs.set('category', params.category);
        if (params?.search) qs.set('search', params.search);
        if (params?.sort) qs.set('sort', params.sort);
        if (params?.isBestseller) qs.set('isBestseller', 'true');
        if (params?.isNew) qs.set('isNew', 'true');
        if (params?.page) qs.set('page', String(params.page));
        if (params?.limit) qs.set('limit', String(params.limit));

        const res = await fetch(`${API_URL}/products?${qs.toString()}`);
        const json = await res.json();
        return { data: json.data ?? [], meta: json.meta };
    },

    async getBySlug(slug: string): Promise<Product> {
        return apiFetch<Product>(`/products/${slug}`);
    },

    async getReviews(slug: string): Promise<Review[]> {
        return apiFetch<Review[]>(`/products/${slug}/reviews`);
    },
};

// ─── Categories ───────────────────────────────────────────────────────────────

export const categoriesApi = {
    async list(): Promise<Category[]> {
        const res = await fetch(`${API_URL}/products/categories`);
        const json = await res.json();
        return json.data ?? [];
    },
};

// ─── Orders ───────────────────────────────────────────────────────────────────

export interface CheckoutPayload {
    items: { productId: string; quantity: number }[];
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
        return apiFetch('/orders', {
            method: 'POST',
            body: JSON.stringify(payload),
        });
    },

    async list(): Promise<Order[]> {
        return apiFetch<Order[]>('/orders');
    },

    async getById(id: string): Promise<Order> {
        return apiFetch<Order>(`/orders/${id}`);
    },
};

// ─── Payments ─────────────────────────────────────────────────────────────────

export const paymentsApi = {
    async createStripeIntent(orderId: string): Promise<{ clientSecret: string }> {
        return apiFetch<{ clientSecret: string }>('/payments/stripe/intent', {
            method: 'POST',
            body: JSON.stringify({ orderId }),
        });
    },
};

// ─── Customer ─────────────────────────────────────────────────────────────────

export const customerApi = {
    async getProfile(): Promise<User & { phone?: string }> {
        return apiFetch('/customer/profile');
    },

    async updateProfile(data: { name?: string; phone?: string }): Promise<User> {
        return apiFetch('/customer/profile', {
            method: 'PATCH',
            body: JSON.stringify(data),
        });
    },
};
