'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link, usePathname, useRouter } from '@/i18n/navigation';
import { useCart } from '@/lib/cart-context';
import PromoBanner from '@/components/layout/PromoBanner';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import {
    ShoppingBag, User, Menu, X, Search, Heart
} from 'lucide-react';

const EASE = [0.25, 0.1, 0.25, 1] as const;

const locales = [
    { code: 'fr', label: 'Français' },
    { code: 'en', label: 'English' },
] as const;

export default function Header() {
    const t = useTranslations('nav');
    const locale = useLocale();
    const pathname = usePathname();
    const router = useRouter();
    const { getItemCount } = useCart();

    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [prevCount, setPrevCount] = useState(0);
    const [cartPulse, setCartPulse] = useState(false);

    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const itemCount = getItemCount();

    // Cart pulse on item add
    useEffect(() => {
        if (itemCount > prevCount && prevCount !== 0) {
            setCartPulse(true);
            setTimeout(() => setCartPulse(false), 600);
        }
        setPrevCount(itemCount);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [itemCount]);

    const switchLocale = (newLocale: string) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        router.replace(pathname as any, { locale: newLocale as 'fr' | 'en' });
    };

    const navLinks = [
        { href: '/' as const, label: t('home') },
        { href: '/produits' as const, label: t('shop') },
        { href: '/a-propos' as const, label: t('about') },
        { href: '/contact' as const, label: t('contact') },
    ];

    const textColor = 'text-[#1B4332]';
    const iconColor = 'text-[#4A4A4A]';
    const hoverBg = 'hover:bg-[#1B4332]/6';

    return (
        <>
            {/* ===== Header ===== */}
            <motion.header
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: EASE, delay: 0.2 }}
                className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-2xl shadow-[0_4px_30px_rgba(0,0,0,0.03)] transition-all duration-700"
            >
                {/* Collapsible Top Action Bar */}
                <div
                    className={`bg-[#0F2E22] transition-all duration-500 overflow-hidden ${isScrolled ? 'max-h-0 opacity-0' : 'max-h-[100px] opacity-100'}`}
                >
                    <div className="container-premium flex items-center justify-between py-2.5">
                        {/* Promo Text */}
                        <div className="flex-1 flex justify-center md:justify-start">
                            <PromoBanner />
                        </div>

                        {/* Actions (Language Toggle) */}
                        <div className="hidden md:flex items-center gap-4">
                            <div className="flex items-center gap-0.5 bg-white/10 rounded-full p-1 text-xs font-semibold tracking-wide text-[#E8D8A0]">
                                <button onClick={() => switchLocale('fr')} className={`px-3.5 py-1.5 rounded-full transition-colors ${locale === 'fr' ? 'bg-[#C9A84C] text-[#0F2E22] shadow-sm' : 'hover:bg-white/10'}`}>FR</button>
                                <button onClick={() => switchLocale('en')} className={`px-3.5 py-1.5 rounded-full transition-colors ${locale === 'en' ? 'bg-[#C9A84C] text-[#0F2E22] shadow-sm' : 'hover:bg-white/10'}`}>EN</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Scroll Progress Bar */}
                <motion.div
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#C9A84C] via-[#E8D8A0] to-[#C9A84C] origin-left z-50"
                    style={{ scaleX }}
                />

                {/* Main Nav Area */}
                <div className={`transition-all duration-500 ${isScrolled ? 'py-3' : 'py-5 lg:py-6'}`}>
                    <div className="container-premium flex items-center justify-between">

                        {/* Logo Area */}
                        <Link href="/" className="flex items-center gap-4 group relative">
                            <motion.div
                                className="w-11 h-11 rounded-[14px] bg-[#0F2E22] flex items-center justify-center text-[#C9A84C] font-serif font-bold text-lg shadow-xl group-hover:shadow-[#C9A84C]/20 transition-all duration-500 group-hover:scale-110"
                                whileHover={{ rotate: 5 }}
                            >
                                S
                            </motion.div>
                            <div className="flex flex-col">
                                <span className={`font-serif font-bold text-[1.25rem] tracking-tight transition-colors duration-500 ${textColor}`}>
                                    Sutra Vedic
                                </span>
                                <span className={`text-[10px] font-bold tracking-[0.3em] uppercase transition-colors duration-500 opacity-60 ${textColor}`}>
                                    Ayurveda
                                </span>
                            </div>
                        </Link>

                        {/* Desktop Nav */}
                        <nav className="hidden lg:flex items-center gap-16">
                            {navLinks.map((link) => {
                                const isActive = pathname === link.href;
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className={`relative text-[0.875rem] font-bold tracking-[0.05em] uppercase transition-all duration-500 hover:text-[#C9A84C] group ${isActive ? 'text-[#C9A84C]' : iconColor}`}
                                    >
                                        {link.label}
                                        <span className={`absolute -bottom-1.5 left-1/2 -translate-x-1/2 h-[2px] bg-[#C9A84C] transition-all duration-500 rounded-full ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`} />
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* Actions */}
                        <div className="flex items-center gap-6 lg:gap-8">

                            {/* Search */}
                            <button className={`p-2 transition-transform hover:scale-110 hover:text-[#C9A84C] ${iconColor}`}>
                                <Search className="w-[1.2rem] h-[1.2rem]" />
                            </button>

                            {/* Cart */}
                            <Link href="/panier" className={`relative p-2 transition-transform hover:scale-110 hover:text-[#C9A84C] ${iconColor}`}>
                                <motion.div
                                    animate={cartPulse ? { scale: [1, 1.25, 1] } : {}}
                                    transition={{ duration: 0.4 }}
                                >
                                    <ShoppingBag className={`w-[17px] h-[17px] ${iconColor}`} />
                                </motion.div>
                                <AnimatePresence>
                                    {itemCount > 0 && (
                                        <motion.span
                                            key={itemCount}
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            exit={{ scale: 0 }}
                                            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                                            className="absolute -top-0.5 -right-0.5 w-[18px] h-[18px] flex items-center justify-center bg-[#C9A84C] text-white text-[9px] font-bold rounded-full"
                                        >
                                            {itemCount}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </Link>

                            {/* Account */}
                            <Link href="/compte" className={`hidden md:flex w-9 h-9 items-center justify-center rounded-full ${hoverBg} transition-colors duration-200`}>
                                <User className={`w-[17px] h-[17px] ${iconColor}`} />
                            </Link>

                            {/* Mobile Toggle */}
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className={`lg:hidden flex w-9 h-9 items-center justify-center rounded-full ${hoverBg} transition-colors duration-200`}
                                aria-label="Menu"
                            >
                                <AnimatePresence mode="wait">
                                    {isMobileMenuOpen ? (
                                        <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                                            <X className={`w-5 h-5 ${iconColor}`} />
                                        </motion.div>
                                    ) : (
                                        <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                                            <Menu className={`w-5 h-5 ${iconColor}`} />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </button>
                        </div>
                    </div>
                </div>
            </motion.header>

            {/* ===== Mobile Menu Drawer ===== */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <div className="fixed inset-0 z-40 lg:hidden">
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                            onClick={() => setIsMobileMenuOpen(false)}
                        />

                        {/* Drawer */}
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ duration: 0.35, ease: EASE }}
                            className="absolute top-0 right-0 w-[320px] h-full bg-white shadow-2xl flex flex-col"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                                <span className="font-serif font-bold text-[1.25rem] text-[#0F2E22]">Menu</span>
                                <button
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                                >
                                    <X className="w-4.5 h-4.5 text-[#4A4A4A]" />
                                </button>
                            </div>

                            {/* Nav Links */}
                            <nav className="flex-1 px-4 py-6 space-y-0.5 overflow-y-auto">
                                {navLinks.map((link, i) => (
                                    <motion.div
                                        key={link.href}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.07, duration: 0.3, ease: EASE }}
                                    >
                                        <Link
                                            href={link.href}
                                            className="flex items-center px-4 py-3.5 rounded-xl text-[0.9375rem] font-medium text-[#2D2D2D] hover:bg-[#FEFAE0] hover:text-[#1B4332] transition-colors duration-150"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            {link.label}
                                        </Link>
                                    </motion.div>
                                ))}

                                <div className="h-px bg-gray-100 my-4" />

                                {[
                                    { href: '/compte', icon: User, label: t('account') },
                                    { href: '/compte/favoris', icon: Heart, label: 'Favoris' },
                                    { href: '/panier', icon: ShoppingBag, label: t('cart') },
                                ].map(({ href, icon: Icon, label }, i) => (
                                    <motion.div
                                        key={href}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: (navLinks.length + i) * 0.07, duration: 0.3, ease: EASE }}
                                    >
                                        <Link
                                            href={href as Parameters<typeof Link>[0]['href']}
                                            className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-[0.9375rem] font-medium text-[#2D2D2D] hover:bg-[#FEFAE0] hover:text-[#1B4332] transition-colors"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            <Icon className="w-4.5 h-4.5" /> {label}
                                        </Link>
                                    </motion.div>
                                ))}
                            </nav>

                            {/* Footer */}
                            <div className="px-6 pb-8 pt-4 border-t border-gray-100">
                                <div className="flex gap-3">
                                    <button onClick={() => switchLocale('fr')} className={`flex-1 py-2.5 rounded-full text-sm font-medium transition-colors ${locale === 'fr' ? 'bg-[#1B4332] text-white' : 'bg-gray-100 text-[#4A4A4A] hover:bg-gray-200'}`}>🇫🇷 FR</button>
                                    <button onClick={() => switchLocale('en')} className={`flex-1 py-2.5 rounded-full text-sm font-medium transition-colors ${locale === 'en' ? 'bg-[#1B4332] text-white' : 'bg-gray-100 text-[#4A4A4A] hover:bg-gray-200'}`}>🇬🇧 EN</button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
