'use client';

import { useRef } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { ArrowRight, Leaf, Sparkles } from 'lucide-react';
import {
    motion,
    useScroll,
    useTransform,
    useSpring,
} from 'framer-motion';

const EASE = [0.25, 0.1, 0.25, 1] as const;

// Stagger config
const container = {
    hidden: {},
    show: {
        transition: {
            staggerChildren: 0.12,
            delayChildren: 0.1,
        },
    },
};

const itemUp = {
    hidden: { opacity: 0, y: 30 },
    show: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.7, ease: EASE },
    },
};

const itemScale = {
    hidden: { opacity: 0, scale: 0.92 },
    show: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.6, ease: EASE },
    },
};

const statItem = {
    hidden: { opacity: 0, y: 16 },
    show: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: EASE },
    },
};

export default function HeroSection() {
    const t = useTranslations('hero');
    const sectionRef = useRef<HTMLElement>(null);

    // Scroll-based parallax (background moves slower than scroll)
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ['start start', 'end start'],
    });

    const rawBgY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
    const bgY = useSpring(rawBgY, { stiffness: 80, damping: 20 });

    // Hero content fades out as user scrolls
    const contentOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);
    const contentY = useTransform(scrollYProgress, [0, 0.55], [0, -40]);

    return (
        <section
            ref={sectionRef}
            className="relative min-h-[100svh] flex items-center overflow-hidden"
            style={{ position: 'relative', marginTop: '-144px' }}
        >
            {/* ===== Parallax Background ===== */}
            <motion.div
                className="absolute -top-[50%] -bottom-[50%] inset-x-0 will-change-transform"
                style={{ y: bgY }}
            >
                <div className="absolute inset-0 bg-gradient-to-br from-[#0A1F17] via-[#0F2E22] to-[#1B4332]" />
                {/* Subtle texture overlay */}
                <div
                    className="absolute inset-0 opacity-[0.06]"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }}
                />
                {/* Gold blur orbs */}
                <div className="absolute top-20 right-[10%] w-[500px] h-[500px] bg-[#C9A84C]/6 rounded-full blur-[120px]" />
                <div className="absolute bottom-10 left-[5%] w-[400px] h-[400px] bg-[#40916C]/8 rounded-full blur-[100px]" />
            </motion.div>

            {/* ===== Content ===== */}
            <motion.div
                className="container-premium relative z-20 pt-48 pb-36"
                style={{ opacity: contentOpacity, y: contentY }}
            >
                <motion.div
                    className="max-w-4xl mx-auto flex flex-col items-center text-center"
                    variants={container}
                    initial="hidden"
                    animate="show"
                >
                    {/* Badge */}
                    <motion.div variants={itemUp}>
                        <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/8 backdrop-blur-md border border-white/12 text-white/90 text-[0.7rem] font-bold uppercase tracking-[0.2em] mb-12">
                            <Leaf className="w-3.5 h-3.5 text-[#C9A84C]" />
                            <span>{t('badge')}</span>
                            <Sparkles className="w-3.5 h-3.5 text-[#C9A84C]" />
                        </div>
                    </motion.div>

                    <motion.h1
                        variants={itemUp}
                        className="text-[clamp(3.5rem,8vw,6.5rem)] font-serif font-normal text-white leading-[1.1] tracking-wide mb-10"
                    >
                        {t('title')}{' '}
                        <br className="hidden sm:block" />
                        <span className="text-gradient-gold">{t('titleHighlight')}</span>
                    </motion.h1>

                    {/* Subtitle */}
                    <motion.p
                        variants={itemUp}
                        className="text-xl md:text-2xl text-white/60 leading-[1.6] mb-16 max-w-2xl font-light"
                    >
                        {t('subtitle')}
                    </motion.p>

                    {/* CTAs */}
                    <motion.div
                        variants={itemScale}
                        className="flex flex-col sm:flex-row justify-center items-center gap-6 mb-32"
                    >
                        <Link
                            href="/produits"
                            className="group inline-flex justify-center items-center text-center gap-3 px-[3rem] md:px-[4rem] py-5 md:py-6 bg-[#C9A84C] text-[#0F2E22] font-bold rounded-full transition-all duration-400 hover:bg-white hover:shadow-2xl hover:shadow-white/20 hover:-translate-y-1 text-[0.95rem] tracking-wide"
                        >
                            <span>{t('cta')}</span>
                            <ArrowRight className="w-4 h-4 shrink-0 transition-transform duration-300 group-hover:translate-x-2" />
                        </Link>
                        <Link
                            href="/a-propos"
                            className="inline-flex justify-center items-center text-center px-[3rem] md:px-[4rem] py-5 md:py-6 text-white font-bold rounded-full border border-white/30 backdrop-blur-sm hover:border-white hover:bg-white/10 transition-all duration-400 hover:-translate-y-1 text-[0.95rem] tracking-wide"
                        >
                            <span>{t('ctaSecondary')}</span>
                        </Link>
                    </motion.div>
                </motion.div>
            </motion.div>

            {/* ===== Info Band ===== */}
            <motion.div
                className="absolute bottom-0 left-0 right-0 z-30 bg-[#0F2E22]/95 backdrop-blur-xl border-t border-white/10 hidden md:block"
                style={{ opacity: contentOpacity }}
            >
                <div className="container-premium py-6">
                    <div className="flex justify-between items-center px-10">
                        {[
                            { value: '5000+', label: 'Clients Satisfaits' },
                            { value: '100%', label: 'Naturel & Védique' },
                            { value: 'Premium', label: 'Qualité Boutique' },
                        ].map(({ value, label }) => (
                            <div key={label} className="flex items-center gap-4">
                                <span className="text-[2.25rem] lg:text-[2.75rem] font-serif font-bold text-[#C9A84C] leading-none">
                                    {value}
                                </span>
                                <span className="text-[0.65rem] text-white/80 font-bold tracking-[0.2em] uppercase max-w-[100px] leading-relaxed">
                                    {label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* ===== Scroll Indicator ===== */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2">
                <span className="text-[0.6875rem] text-white/30 tracking-[0.15em] uppercase">Scroll</span>
                <div className="w-px h-12 bg-gradient-to-b from-white/30 to-transparent animate-scroll-bounce" />
            </div>
        </section>
    );
}
