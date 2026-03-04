'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { MapPin, Mail, Phone } from 'lucide-react';

export default function Footer() {
    const t = useTranslations('footer');
    const locale = useLocale();

    const quickLinks = [
        { href: '/produits' as const, label: t('shop') },
        { href: '/a-propos' as const, label: t('about') },
        { href: '/contact' as const, label: t('contact') },
    ];

    const customerLinks = [
        { href: '/compte' as const, label: t('myAccount') },
        { href: '/compte/commandes' as const, label: t('orderHistory') },
        { href: '/compte/favoris' as const, label: t('wishlist') },
    ];

    const legalLinks = [
        { href: '/legal/mentions-legales' as const, label: t('legalNotice') },
        { href: '/politique-de-confidentialite' as const, label: t('privacy') },
        { href: '/legal/cgv' as const, label: t('salesTerms') },
        { href: '/legal/politique-retour' as const, label: t('returnPolicy') },
        { href: '/legal/protection-donnees' as const, label: t('dataProtection') },
        { href: '/legal/cgu' as const, label: t('termsOfUse') },
    ];

    return (
        <footer className="bg-[#0F2E22] text-white">
            <div className="container-premium py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
                    {/* Brand */}
                    <div className="lg:col-span-1">
                        <div className="flex items-center gap-3 mb-5">
                            <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white font-serif font-bold text-sm">
                                S
                            </div>
                            <div>
                                <span className="font-serif font-bold text-lg text-white block leading-tight">Sutra Vedic</span>
                                <span className="text-[9px] tracking-[0.2em] uppercase text-white/35">Ayurveda Naturel</span>
                            </div>
                        </div>
                        <p className="text-[0.8rem] text-white/40 leading-relaxed mb-6">
                            {t('description')}
                        </p>
                        {/* Social */}
                        <div className="flex gap-2">
                            {['F', 'I', 'T'].map((letter, i) => (
                                <a key={i} href="#" className="w-8 h-8 rounded-full bg-white/5 hover:bg-[#C9A84C] flex items-center justify-center transition-colors duration-200">
                                    <span className="text-[0.65rem] text-white/50 hover:text-[#0F2E22] font-bold">{letter}</span>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-white/70 mb-5">{t('quickLinks')}</h3>
                        <ul className="space-y-3">
                            {quickLinks.map(link => (
                                <li key={link.href}>
                                    <Link href={link.href} className="text-[0.8rem] text-white/40 hover:text-[#C9A84C] transition-colors">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Customer */}
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-white/70 mb-5">{t('customerService')}</h3>
                        <ul className="space-y-3">
                            {customerLinks.map(link => (
                                <li key={link.href}>
                                    <Link href={link.href} className="text-[0.8rem] text-white/40 hover:text-[#C9A84C] transition-colors">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-white/70 mb-5">{t('contactUs')}</h3>
                        <div className="space-y-3">
                            <p className="flex items-start gap-2.5 text-[0.8rem] text-white/40">
                                <MapPin className="w-3.5 h-3.5 text-white/25 mt-0.5 shrink-0" />
                                123 Rue de la Nature, 75001 Paris
                            </p>
                            <p className="flex items-center gap-2.5 text-[0.8rem] text-white/40">
                                <Mail className="w-3.5 h-3.5 text-white/25 shrink-0" />
                                contact@sutravedic.fr
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-white/[0.06]">
                <div className="container-premium py-6 flex flex-col items-center gap-6">
                    <div className="flex flex-wrap justify-center gap-x-8 gap-y-3">
                        {legalLinks.map(link => (
                            <Link key={link.href} href={link.href} className="text-[0.7rem] text-white/25 hover:text-[#C9A84C] transition-colors">
                                {link.label}
                            </Link>
                        ))}
                    </div>
                    <p className="text-[0.7rem] text-white/25">
                        © 2025 Sutra Vedic. {t('rights')}
                    </p>
                </div>
            </div>
        </footer>
    );
}
