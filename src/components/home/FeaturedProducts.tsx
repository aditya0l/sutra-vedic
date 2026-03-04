'use client';

import { useRef, useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useCart } from '@/lib/cart-context';
import { productsApi } from '@/lib/api';
import { getLocalizedValue, formatPrice } from '@/lib/utils';
import { ShoppingBag, Star, ArrowRight, Sparkles } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import { Product } from '@/types';

const EASE = [0.25, 0.1, 0.25, 1] as const;

export default function FeaturedProducts() {
    const t = useTranslations('featured');
    const locale = useLocale();
    const { addItem } = useCart();
    const ref = useRef<HTMLElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, amount: 0.05 });
    const isHeaderInView = useInView(headerRef, { once: true, amount: 0.5 });
    const [featured, setFeatured] = useState<Product[]>([]);

    useEffect(() => {
        productsApi.list({ limit: 3, sort: 'rating' })
            .then(res => setFeatured(res.data))
            .catch(() => setFeatured([]));
    }, []);

    return (
        <section ref={ref} className="section-padding bg-[#FEFAE0]">
            <div className="container-premium">

                {/* ===== Section Header ===== */}
                <div ref={headerRef} className="flex flex-col items-center text-center mb-24 lg:mb-32">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.92 }}
                        animate={isHeaderInView ? { opacity: 1, scale: 1 } : {}}
                        transition={{ duration: 0.5, ease: EASE }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#1B4332]/6 rounded-full text-[0.7rem] text-[#1B4332] font-bold uppercase tracking-[0.2em] mb-6"
                    >
                        <Sparkles className="w-3.5 h-3.5 text-[#C9A84C]" />
                        {t('badge')}
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 24 }}
                        animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.65, delay: 0.1, ease: EASE }}
                        className="text-4xl md:text-6xl font-serif font-bold text-[#0F2E22] mb-6"
                    >
                        {t('title')}
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 16 }}
                        animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
                        className="text-lg md:text-xl text-[#2D2D2D]/70 max-w-2xl leading-relaxed"
                    >
                        {t('subtitle')}
                    </motion.p>
                </div>

                {/* ===== Products Grid ===== */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-20">
                    {featured.map((product, i) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 32 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.8, delay: i * 0.15, ease: EASE }}
                            className="group"
                        >
                            <Link href={{ pathname: '/produit/[slug]', params: { slug: product.slug } }} className="block space-y-6">
                                {/* Image Zone */}
                                <div className="relative aspect-[4/5] bg-white rounded-[2.5rem] overflow-hidden shadow-[0_10px_40px_-15px_rgba(0,0,0,0.08)] group-hover:shadow-[0_20px_80px_-20px_rgba(0,0,0,0.12)] transition-all duration-700">
                                    <div className="absolute inset-0 flex items-center justify-center p-14">
                                        <div className="w-full h-full bg-gradient-to-br from-[#FEFAE0] to-[#E8D8A0]/20 rounded-3xl flex items-center justify-center group-hover:scale-105 transition-all duration-[1.2s] ease-out-expo overflow-hidden">
                                            {product.images?.[0] ? (
                                                <img
                                                    src={product.images[0]}
                                                    alt={getLocalizedValue(product.name, locale)}
                                                    className="w-full h-full object-contain transition-transform duration-700"
                                                />
                                            ) : (
                                                <span className="text-8xl opacity-40 group-hover:opacity-100 transition-opacity duration-700">
                                                    {product.slug?.includes('pain') ? '🩹' : product.slug?.includes('massage') ? '🧴' : '🍃'}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="absolute top-8 left-0 right-0 flex justify-center gap-2">
                                        {product.compareAtPrice && product.compareAtPrice > product.price && (
                                            <span className="px-4 py-1.5 bg-[#dc2626] text-white text-[0.65rem] font-bold tracking-widest rounded-full uppercase shadow-md">
                                                -{Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)}%
                                            </span>
                                        )}
                                        {product.isBestseller && (
                                            <span className="px-4 py-1.5 bg-transparent border border-[#C9A84C] text-[#C9A84C] text-[0.65rem] font-medium tracking-widest rounded-full uppercase bg-white/50 backdrop-blur-md">
                                                {t('bestseller')}
                                            </span>
                                        )}
                                        {product.isNew && (
                                            <span className="px-4 py-1.5 bg-transparent border border-[#0F2E22] text-[#0F2E22] text-[0.65rem] font-medium tracking-widest rounded-full uppercase bg-white/50 backdrop-blur-md">
                                                {t('new')}
                                            </span>
                                        )}
                                    </div>

                                    {/* Quick Add Overlay */}
                                    <div className="absolute inset-x-0 bottom-0 p-8 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out-expo">
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                addItem(product);
                                            }}
                                            className="px-[3rem] py-5 bg-[#0F2E22] text-white font-bold text-sm rounded-2xl shadow-xl flex items-center justify-center text-center gap-3 hover:bg-[#C9A84C] hover:text-[#0F2E22] transition-colors whitespace-nowrap"
                                        >
                                            <ShoppingBag className="w-4 h-4 shrink-0" />
                                            <span className="truncate">{t('addToCart')}</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Details */}
                                <div className="space-y-4 px-1 text-center pt-2">
                                    <div className="flex flex-col items-center gap-2">
                                        <p className="text-[0.65rem] font-medium uppercase tracking-[0.2em] text-[#C9A84C]">
                                            {typeof product.category === 'object'
                                                ? getLocalizedValue(product.category as { fr: string; en: string }, locale)
                                                : product.category}
                                        </p>
                                        <div className="flex items-center justify-center gap-1">
                                            {Array.from({ length: 5 }).map((_, idx) => (
                                                <Star key={idx} className={`w-3 h-3 ${idx < Math.floor(product.rating) ? 'text-[#C9A84C] fill-[#C9A84C]' : 'text-gray-200'} `} />
                                            ))}
                                            <span className="text-[0.7rem] ml-1 font-medium text-[#0F2E22]/70">({product.reviewCount}+)</span>
                                        </div>
                                    </div>

                                    <h3 className="font-serif text-xl lg:text-2xl font-normal text-[#0F2E22] leading-snug group-hover:text-[#C9A84C] transition-colors">
                                        {getLocalizedValue(product.name, locale)}
                                    </h3>

                                    <div className="pt-2 flex flex-col items-center gap-4">
                                        <div className="flex items-center gap-3">
                                            {product.compareAtPrice && product.compareAtPrice > product.price && (
                                                <span className="text-[0.9rem] text-gray-400 line-through font-medium">
                                                    {formatPrice(product.compareAtPrice)}
                                                </span>
                                            )}
                                            <span className="text-lg font-medium tracking-wide text-[#0F2E22]">{formatPrice(product.price)}</span>
                                        </div>
                                        <span className="inline-flex items-center gap-2 text-[0.65rem] border-b border-transparent group-hover:border-[#C9A84C] pb-0.5 font-medium text-[#C9A84C] transition-all uppercase tracking-[0.15em]">
                                            {locale === 'fr' ? 'Découvrir' : 'Discover'}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {/* View All */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.5, ease: EASE }}
                    className="text-center mt-24"
                >
                    <Link
                        href="/produits"
                        className="group inline-flex justify-center items-center text-center gap-2.5 px-[3rem] py-5 bg-[#0F2E22] hover:bg-[#1B4332] text-white font-semibold rounded-full transition-all duration-300 hover:shadow-xl hover:shadow-[#0F2E22]/15 hover:-translate-y-0.5 text-[0.95rem] tracking-wide"
                    >
                        {t('viewAll')}
                        <ArrowRight className="w-4 h-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
