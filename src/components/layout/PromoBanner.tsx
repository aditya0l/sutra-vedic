'use client';

import { useTranslations } from 'next-intl';

export default function PromoBanner() {
    const t = useTranslations('promo');

    // Make sure we have a fallback if translation is missing since we didn't add the namespace right away
    // In actual implementation we expect "Free shipping on all orders over €50" or equivalent lux message.
    const message = t.has('message') ? t('message') : "Livraison offerte dès 50€ d'achat - Découvrez nos nouveautés";

    return (
        <span className="text-[#E8D8A0] text-[0.65rem] md:text-[0.7rem] uppercase tracking-[0.2em] font-bold">
            {message}
        </span>
    );
}
