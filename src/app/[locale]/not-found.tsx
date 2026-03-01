import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Leaf } from 'lucide-react';

export default function NotFoundPage() {
    const t = useTranslations('notFound');

    return (
        <div className="min-h-screen bg-cream flex items-center justify-center">
            <div className="text-center max-w-md">
                <div className="relative mb-8">
                    <span className="text-[150px] font-serif font-bold text-cream-dark/30 leading-none">404</span>
                    <Leaf className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 text-forest animate-float" />
                </div>
                <h1 className="text-3xl font-serif font-bold text-forest-dark mb-3">{t('title')}</h1>
                <p className="text-charcoal-light mb-8">{t('message')}</p>
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 px-8 py-3.5 bg-forest text-white font-semibold rounded-full hover:bg-forest-light transition-all"
                >
                    {t('backHome')}
                </Link>
            </div>
        </div>
    );
}
