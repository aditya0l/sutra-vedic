import { NextIntlClientProvider, useMessages } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
// WhatsApp Button removed
import CookieBanner from '@/components/layout/CookieBanner';
import { CartProvider } from '@/lib/cart-context';

type Props = {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const messages = await getMessages({ locale });
    const meta = (messages as Record<string, Record<string, string>>).metadata;

    return {
        title: meta?.title || 'Sutra Vedic',
        description: meta?.description || '',
        alternates: {
            languages: {
                'fr': '/fr',
                'en': '/en',
            },
        },
        openGraph: {
            title: meta?.title || 'Sutra Vedic',
            description: meta?.description || '',
            locale: locale === 'fr' ? 'fr_FR' : 'en_US',
            type: 'website',
            siteName: 'Sutra Vedic',
        },
    };
}

export default async function LocaleLayout({ children, params }: Props) {
    const { locale } = await params;

    if (!routing.locales.includes(locale as 'fr' | 'en')) {
        notFound();
    }

    setRequestLocale(locale);
    const messages = await getMessages();

    return (
        <html lang={locale} className="scroll-smooth">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,500;1,600;1,700&family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
            </head>
            <body className="min-h-screen flex flex-col">
                <NextIntlClientProvider messages={messages}>
                    <CartProvider>
                        <Header />
                        <main className="flex-1" style={{ paddingTop: '144px' }}>
                            {children}
                        </main>
                        <Footer />
                        <CookieBanner />
                    </CartProvider>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
