import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
    locales: ['fr', 'en'],
    defaultLocale: 'fr',
    pathnames: {
        '/': '/',
        '/produits': {
            fr: '/produits',
            en: '/products'
        },
        '/produit/[slug]': {
            fr: '/produit/[slug]',
            en: '/product/[slug]'
        },
        '/panier': {
            fr: '/panier',
            en: '/cart'
        },
        '/checkout': {
            fr: '/checkout',
            en: '/checkout'
        },
        '/compte': {
            fr: '/compte',
            en: '/account'
        },
        '/compte/commandes': {
            fr: '/compte/commandes',
            en: '/account/orders'
        },
        '/compte/favoris': {
            fr: '/compte/favoris',
            en: '/account/wishlist'
        },
        '/a-propos': {
            fr: '/a-propos',
            en: '/about'
        },
        '/politique-de-confidentialite': {
            fr: '/politique-de-confidentialite',
            en: '/privacy-policy'
        },
        '/conditions-generales': {
            fr: '/conditions-generales',
            en: '/terms-and-conditions'
        },
        '/contact': {
            fr: '/contact',
            en: '/contact'
        },
        '/legal/mentions-legales': {
            fr: '/legal/mentions-legales',
            en: '/legal/legal-notice'
        },
        '/legal/cgv': {
            fr: '/legal/cgv',
            en: '/legal/terms-of-sale'
        },
        '/legal/politique-retour': {
            fr: '/legal/politique-retour',
            en: '/legal/return-policy'
        },
        '/legal/protection-donnees': {
            fr: '/legal/protection-donnees',
            en: '/legal/data-protection'
        },
        '/legal/cgu': {
            fr: '/legal/cgu',
            en: '/legal/terms-of-use'
        }
    }
});

export type Locale = (typeof routing.locales)[number];
export type Pathnames = keyof typeof routing.pathnames;
