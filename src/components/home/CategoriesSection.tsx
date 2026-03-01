'use client';

import { useRef } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { categories } from '@/lib/mock-data';
import { getLocalizedValue } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';
import { motion, useInView } from 'framer-motion';

const EASE = [0.25, 0.1, 0.25, 1] as const;

const categoryEmojis: Record<string, string> = {
    'huiles-ayurvediques': '🫙',
    'complements-plantes': '🌿',
    'immunite': '🛡️',
    'soins-peau': '✨',
    'soins-capillaires': '💇',
    'sante-digestive': '💚',
};

export default function CategoriesSection() {
    const t = useTranslations('categories');
    const locale = useLocale();
    const ref = useRef<HTMLElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, amount: 0.08 });
    const isHeaderInView = useInView(headerRef, { once: true, amount: 0.5 });

    return (
        <section ref={ref} className="section-padding bg-white">
            <div className="container-premium">

                {/* Header */}
                <div ref={headerRef} className="flex flex-col items-center text-center mb-24 lg:mb-32">
                    <motion.h2
                        initial={{ opacity: 0, y: 24 }}
                        animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.65, ease: EASE }}
                        className="text-4xl md:text-5xl font-serif font-normal text-[#0F2E22] mb-6"
                    >
                        {t('title')}
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 16 }}
                        animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.12, ease: EASE }}
                        className="text-lg text-[#2D2D2D]/70 max-w-2xl leading-relaxed font-light"
                    >
                        {t('subtitle')}
                    </motion.p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
                    {categories.map((category, i) => (
                        <motion.div
                            key={category.id}
                            initial={{ opacity: 0, y: 28 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.8, delay: i * 0.15, ease: EASE }}
                        >
                            <Link
                                href="/produits"
                                className="group relative overflow-hidden rounded-[2rem] bg-[#0F2E22] p-12 min-h-[340px] flex flex-col items-center text-center justify-between block hover:shadow-[0_30px_80px_-20px_rgba(15,46,34,0.35)] transition-all duration-700"
                            >
                                {/* BG glows */}
                                <div className="absolute inset-0 overflow-hidden">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl transform translate-x-12 -translate-y-12 group-hover:scale-150 transition-transform duration-[1.5s]" />
                                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#C9A84C]/5 rounded-full blur-2xl transform -translate-x-6 translate-y-6" />
                                </div>

                                <div className="relative z-10 flex flex-col items-center">
                                    <span className="text-4xl mb-6 block transition-transform duration-700 group-hover:scale-110">
                                        {categoryEmojis[category.slug] || '🌱'}
                                    </span>
                                    <h3
                                        className="font-serif font-normal text-2xl text-[#E8D8A0] mb-4 leading-snug tracking-wide"
                                    >
                                        {getLocalizedValue(category.name, locale)}
                                    </h3>
                                    <p className="text-white/60 text-[0.875rem] leading-relaxed font-light">
                                        {getLocalizedValue(category.description, locale)}
                                    </p>
                                </div>

                                <div className="relative z-10 flex flex-col items-center gap-4 mt-8">
                                    <span className="text-[#C9A84C] text-[0.65rem] font-medium uppercase tracking-[0.2em] relative inline-block after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-px after:bg-[#C9A84C] group-hover:after:w-full after:transition-all after:duration-500">
                                        {locale === 'fr' ? 'Explorer' : 'Explore'}
                                    </span>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
