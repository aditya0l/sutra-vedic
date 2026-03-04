'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { Link } from '@/i18n/navigation';
import { useCart } from '@/lib/cart-context';
import { productsApi } from '@/lib/api';
import { getLocalizedValue, formatPrice } from '@/lib/utils';
import { Star, ShoppingBag, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import AnimateIn from '@/components/ui/AnimateIn';
import { Product } from '@/types';

// Wrapper required: useSearchParams must be in a Suspense boundary in Next.js App Router
export default function ShopPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#FEFAE0] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-[#0F2E22]/10 border-t-[#C9A84C] rounded-full animate-spin" />
            </div>
        }>
            <ShopContent />
        </Suspense>
    );
}

function ShopContent() {
    const t = useTranslations('shop');
    const locale = useLocale();
    const { addItem } = useCart();
    const searchParams = useSearchParams();
    const categoryParam = searchParams.get('category') || undefined;

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [sort, setSort] = useState('');

    const fetchProducts = useCallback(() => {
        setLoading(true);
        productsApi.list({ category: categoryParam, sort: sort || undefined })
            .then(res => setProducts(res.data))
            .catch(() => setProducts([]))
            .finally(() => setLoading(false));
    }, [categoryParam, sort]);

    useEffect(() => { fetchProducts(); }, [fetchProducts]);

    return (
        <div className="min-h-screen bg-[#FEFAE0]">
            {/* Header */}
            <div className="pt-32 pb-20 border-b border-cream-dark/30">
                <div className="container-premium">
                    <AnimateIn direction="up" distance={20}>
                        <div className="max-w-3xl mx-auto text-center">
                            <span className="text-[0.65rem] font-medium tracking-[0.2em] text-[#C9A84C] uppercase mb-4 block">
                                Collection Originelle
                            </span>
                            <h1 className="text-5xl md:text-6xl font-serif font-normal text-[#0F2E22] mb-6 leading-[1.1] tracking-wide">
                                {t('title')}
                            </h1>
                            <p className="text-lg text-[#2D2D2D]/70 font-light leading-relaxed">
                                {t('subtitle')}
                            </p>
                        </div>
                    </AnimateIn>
                </div>
            </div>

            {/* Sort bar */}
            <div className="container-premium pt-10 pb-0 flex justify-end">
                <select
                    value={sort}
                    onChange={e => setSort(e.target.value)}
                    className="text-xs font-medium tracking-widest uppercase bg-white border border-cream-dark/20 rounded-lg px-4 py-2 text-charcoal focus:outline-none focus:ring-1 focus:ring-gold/50"
                >
                    <option value="">{locale === 'fr' ? 'Trier par' : 'Sort by'}</option>
                    <option value="rating">{locale === 'fr' ? 'Mieux notés' : 'Top Rated'}</option>
                    <option value="price_asc">{locale === 'fr' ? 'Prix croissant' : 'Price: Low to High'}</option>
                    <option value="price_desc">{locale === 'fr' ? 'Prix décroissant' : 'Price: High to Low'}</option>
                </select>
            </div>

            {/* Products Grid */}
            <div className="container-premium py-20">
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 lg:gap-24">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="animate-pulse">
                                <div className="aspect-[4/5] bg-cream rounded-[2rem] mb-6" />
                                <div className="h-4 bg-cream rounded w-2/3 mx-auto mb-2" />
                                <div className="h-6 bg-cream rounded w-1/2 mx-auto" />
                            </div>
                        ))}
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-24">
                        <p className="text-charcoal-light text-lg">
                            {locale === 'fr' ? 'Aucun produit trouvé.' : 'No products found.'}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 lg:gap-24 items-start">
                        {products.map((product, idx) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.1 * idx, ease: [0.25, 1, 0.5, 1] }}
                                className="group"
                            >
                                <Link
                                    href={{ pathname: '/produit/[slug]', params: { slug: product.slug } }}
                                    className="block space-y-6"
                                >
                                    {/* Image Container */}
                                    <div className="relative aspect-[4/5] bg-white rounded-[2rem] overflow-hidden shadow-[0_10px_40px_-15px_rgba(0,0,0,0.08)] group-hover:shadow-[0_20px_80px_-20px_rgba(0,0,0,0.12)] transition-all duration-700">
                                        <div className="absolute inset-0 flex items-center justify-center p-0">
                                            {product.images?.[0] ? (
                                                <img
                                                    src={product.images[0]}
                                                    alt={getLocalizedValue(product.name, locale)}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.2s] ease-out-expo"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-br from-[#FEFAE0] to-[#E8D8A0]/20 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform duration-[1.2s] ease-out-expo">
                                                    <span className="text-8xl filter grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700">
                                                        {product.slug.includes('pain') ? '🩹' : product.slug.includes('massage') ? '🧴' : '🍃'}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="absolute top-8 left-0 right-0 flex justify-center gap-2">
                                            {product.compareAtPrice && product.compareAtPrice > product.price && (
                                                <span className="px-4 py-1.5 bg-[#dc2626] text-white text-[0.65rem] font-bold tracking-widest rounded-full uppercase shadow-md">
                                                    -{Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)}%
                                                </span>
                                            )}
                                            {product.isBestseller && (
                                                <span className="px-4 py-1.5 bg-transparent border border-[#C9A84C] text-[#C9A84C] text-[0.65rem] font-medium tracking-widest rounded-full uppercase bg-white/50 backdrop-blur-md">
                                                    BEST SELLER
                                                </span>
                                            )}
                                            {product.isNew && (
                                                <span className="px-4 py-1.5 bg-transparent border border-[#0F2E22] text-[#0F2E22] text-[0.65rem] font-medium tracking-widest rounded-full uppercase bg-white/50 backdrop-blur-md">
                                                    NOUVEAU
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
                                                className="px-6 py-5 bg-[#0F2E22] text-white font-bold text-sm rounded-2xl shadow-xl flex items-center justify-center text-center gap-3 hover:bg-[#C9A84C] hover:text-[#0F2E22] transition-colors whitespace-nowrap"
                                            >
                                                <ShoppingBag className="w-4 h-4 shrink-0" />
                                                <span className="truncate">{locale === 'fr' ? 'Ajouter au Panier' : 'Add to Cart'}</span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="space-y-5 px-3 text-center pt-4">
                                        <div className="flex flex-col items-center gap-3">
                                            <p className="text-[0.65rem] font-medium uppercase tracking-[0.25em] text-[#C9A84C]">
                                                {typeof product.category === 'object'
                                                    ? getLocalizedValue(product.category as { fr: string; en: string }, locale)
                                                    : product.category}
                                            </p>
                                            <div className="flex items-center justify-center gap-1.5">
                                                {Array.from({ length: 5 }).map((_, i) => (
                                                    <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(product.rating) ? 'text-[#C9A84C] fill-[#C9A84C]' : 'text-gray-200'}`} />
                                                ))}
                                                <span className="text-[0.7rem] ml-1.5 font-light text-[#0F2E22]/60">({product.reviewCount})</span>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <h3 className="font-serif text-2xl md:text-[1.7rem] font-normal text-[#0F2E22] leading-[1.3] group-hover:text-[#C9A84C] transition-colors line-clamp-2 px-2">
                                                {getLocalizedValue(product.name, locale)}
                                            </h3>
                                            <p className="text-[#2D2D2D]/60 text-[0.9375rem] font-light leading-relaxed line-clamp-2 px-4">
                                                {getLocalizedValue(product.shortDescription, locale)}
                                            </p>
                                        </div>

                                        <div className="pt-4 flex flex-col items-center gap-4">
                                            <div className="flex items-center gap-3">
                                                {product.compareAtPrice && product.compareAtPrice > product.price && (
                                                    <span className="text-[0.9rem] text-gray-400 line-through font-medium">
                                                        {formatPrice(product.compareAtPrice)}
                                                    </span>
                                                )}
                                                <span className="text-lg font-medium tracking-wide text-[#0F2E22]">
                                                    {formatPrice(product.price)}
                                                </span>
                                            </div>
                                            <span className="inline-flex items-center gap-2 text-[0.65rem] border-b border-transparent group-hover:border-[#C9A84C] pb-0.5 font-medium text-[#C9A84C] transition-all uppercase tracking-[0.15em]">
                                                Détails <ArrowRight className="w-3 h-3" />
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Footer CTA */}
            <div className="py-32 bg-[#0F2E22] text-white">
                <div className="container-premium">
                    <div className="max-w-4xl mx-auto text-center space-y-12">
                        <AnimateIn direction="up">
                            <h2 className="text-4xl md:text-5xl font-serif font-normal tracking-wide leading-tight">
                                {locale === 'fr' ? 'Le secret millénaire pour une vitalité moderne.' : 'Ancient secrets for modern vitality.'}
                            </h2>
                            <p className="text-white/60 text-lg max-w-2xl mx-auto">
                                {locale === 'fr' ? "Chaque formulation est une promesse d'authenticité, de pureté et d'équilibre." : 'Every formulation is a promise of authenticity, purity, and balance.'}
                            </p>
                        </AnimateIn>
                    </div>
                </div>
            </div>
        </div>
    );
}
