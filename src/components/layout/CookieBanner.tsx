'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Cookie } from 'lucide-react';

export default function CookieBanner() {
    const t = useTranslations('cookie');
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('cookie-consent');
        if (!consent) {
            const timer = setTimeout(() => setIsVisible(true), 1500);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('cookie-consent', 'accepted');
        setIsVisible(false);
    };

    const handleDecline = () => {
        localStorage.setItem('cookie-consent', 'declined');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
            <div className="container-premium">
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-5 flex flex-col sm:flex-row items-center gap-4">
                    <Cookie className="w-6 h-6 text-[#C9A84C] shrink-0" />
                    <p className="text-sm text-[#4A4A4A] flex-1">
                        {t('message')}{' '}
                        <a href="/politique-de-confidentialite" className="text-[#C9A84C] hover:underline font-medium">{t('learnMore')}</a>
                    </p>
                    <div className="flex gap-2 shrink-0">
                        <button
                            onClick={handleDecline}
                            className="px-5 py-2 text-sm font-medium text-[#4A4A4A] hover:text-[#0F2E22] transition-colors rounded-full border border-gray-200 hover:border-gray-300"
                        >
                            {t('decline')}
                        </button>
                        <button
                            onClick={handleAccept}
                            className="px-5 py-2 text-sm font-semibold bg-[#1B4332] text-white rounded-full hover:bg-[#2D6A4F] transition-colors"
                        >
                            {t('accept')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
