export interface Product {
    id: string;
    slug: string;
    name: { fr: string; en: string };
    description: { fr: string; en: string };
    shortDescription: { fr: string; en: string };
    price: number;
    compareAtPrice?: number;
    currency: string;
    images: string[];
    category: string;
    categorySlug: string;
    stock: number;
    sku: string;
    rating: number;
    reviewCount: number;
    isNew?: boolean;
    isBestseller?: boolean;
    benefits: { icon: string; title: { fr: string; en: string }; description: { fr: string; en: string } }[];
    ingredients: { name: { fr: string; en: string }; description: { fr: string; en: string }; image?: string }[];
    usage: { fr: string; en: string };
    certifications: string[];
    tags: string[];
    faq: { question: { fr: string; en: string }; answer: { fr: string; en: string } }[];
    variants?: {
        id: string;
        name: { fr: string; en: string };
        price: number;
        compareAtPrice?: number;
        sku: string;
        stock: number;
    }[];
}

export interface Category {
    id: string;
    slug: string;
    name: { fr: string; en: string };
    description: { fr: string; en: string };
    image: string;
    productCount: number;
}

export interface Review {
    id: string;
    userName: string;
    userAvatar?: string;
    rating: number;
    comment: { fr: string; en: string };
    date: string;
    productId?: string;
    verified: boolean;
}

export interface CartItem {
    product: Product;
    quantity: number;
    variantId?: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
    role: 'customer' | 'admin';
    avatar?: string;
}

export interface Order {
    id: string;
    userId: string;
    items: { product: Product; quantity: number; price: number; variantId?: string }[];
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
    shippingAddress: Address;
    createdAt: string;
    trackingNumber?: string;
}

export interface Address {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phone: string;
}
