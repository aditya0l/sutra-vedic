'use client';

import { useState, use, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link, useRouter } from '@/i18n/navigation';
import { useCart } from '@/lib/cart-context';
import { useWishlist } from '@/lib/wishlist-context';
import { productsApi } from '@/lib/api';
import { getLocalizedValue, formatPrice } from '@/lib/utils';
import {
    Star, ShoppingBag, Heart, Minus, Plus, ChevronDown,
    ChevronRight, ShieldCheck, Truck, RotateCcw, Award, Check
} from 'lucide-react';
import { Product, Review } from '@/types';

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const t = useTranslations('product');
    const locale = useLocale();
    const { addItem } = useCart();
    const { toggle: toggleWishlist, isInWishlist } = useWishlist();
    const router = useRouter();

    const [product, setProduct] = useState<Product | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('description');
    const [openFaq, setOpenFaq] = useState<number | null>(null);
    const [selectedVariant, setSelectedVariant] = useState<NonNullable<Product['variants']>[number] | null>(null);
    const [activeImage, setActiveImage] = useState<string | null>(null);
    const [addedToCart, setAddedToCart] = useState(false);

    useEffect(() => {
        if (product && product.variants && product.variants.length > 0) {
            setSelectedVariant(product.variants[0]);
        }
    }, [product]);

    useEffect(() => {
        setLoading(true);
        productsApi.getBySlug(slug)
            .then(async (p) => {
                setProduct(p);
                // Fetch reviews & related products in parallel
                const [revs, related] = await Promise.all([
                    productsApi.getReviews(slug).catch(() => []),
                    p.categorySlug
                        ? productsApi.list({ category: p.categorySlug, limit: 4 })
                            .then(r => r.data.filter(rp => rp.id !== p.id).slice(0, 4))
                            .catch(() => [])
                        : Promise.resolve([]),
                ]);
                setReviews(revs);
                setRelatedProducts(related);
            })
            .catch(() => setProduct(null))
            .finally(() => setLoading(false));
    }, [slug]);

    const handleAddToCart = () => {
        if (!product) return;
        addItem(product, quantity, selectedVariant?.id || undefined);
        setAddedToCart(true);
        setTimeout(() => setAddedToCart(false), 2000);
    };

    const handleBuyNow = () => {
        if (!product) return;
        addItem(product, quantity, selectedVariant?.id || undefined);
        router.push('/checkout');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-[#0F2E22]/10 border-t-[#C9A84C] rounded-full animate-spin" />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-cream">
                <div className="text-center">
                    <h1 className="text-3xl font-serif font-normal text-forest-dark mb-4 tracking-wide">
                        {locale === 'fr' ? 'Produit non trouvé' : 'Product not found'}
                    </h1>
                    <Link href="/produits" className="text-gold hover:text-gold-light transition-colors tracking-widest uppercase text-sm font-medium">
                        {locale === 'fr' ? 'Retour à la boutique' : 'Back to shop'}
                    </Link>
                </div>
            </div>
        );
    }

    const tabs = [
        { key: 'description', label: t('description') },
        { key: 'benefits', label: t('benefits') },
        { key: 'ingredients', label: t('ingredients') },
        { key: 'usage', label: t('usage') },
        { key: 'reviews', label: `${t('reviews')} (${reviews.length})` },
    ];

    const benefits = product && Array.isArray(product.benefits) ? product.benefits : [];
    const ingredients = product && Array.isArray(product.ingredients) ? product.ingredients : [];
    const faq = product && Array.isArray(product.faq) ? product.faq : [];

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-white"><div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin"></div></div>;
    if (!product) return <div className="min-h-screen flex items-center justify-center bg-white"><p className="text-forest-dark font-serif text-xl">{locale === 'fr' ? 'Produit non trouvé' : 'Product not found'}</p></div>;

    return (
        <div className="min-h-screen bg-white">
            {/* Breadcrumb */}
            <div className="bg-white border-b border-cream-dark/10">
                <div className="container-premium py-4 flex items-center justify-center gap-3 text-xs tracking-widest uppercase text-charcoal-light">
                    <Link href="/" className="hover:text-gold transition-colors">{locale === 'fr' ? 'Accueil' : 'Home'}</Link>
                    <ChevronRight className="w-3 h-3 text-cream-dark" />
                    <Link href="/produits" className="hover:text-gold transition-colors">{locale === 'fr' ? 'Boutique' : 'Shop'}</Link>
                    <ChevronRight className="w-3 h-3 text-cream-dark" />
                    <span className="text-forest-dark font-medium">{getLocalizedValue(product.name, locale)}</span>
                </div>
            </div>

            {/* Main Product Section */}
            <div className="container-premium py-24 lg:py-32">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-32">
                    {/* Product Image */}
                    <div className="space-y-8">
                        <div className="relative aspect-square bg-[#FEFAE0]/50 rounded-[3rem] overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.06)] border border-cream-dark/20 flex items-center justify-center">
                            <div className="w-full h-full p-20">
                                <div className="w-full h-full rounded-full bg-gradient-to-br from-[#FEFAE0] to-[#E8D8A0]/30 flex items-center justify-center overflow-hidden">
                                    {(activeImage || product.images?.[0]) ? (
                                        <img
                                            src={activeImage || product.images![0]}
                                            alt={getLocalizedValue(product.name, locale)}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-[10rem] opacity-60">🌿</span>
                                    )}
                                </div>
                            </div>
                            <div className="absolute top-10 left-10 flex flex-col gap-2.5">
                                {/* Discount badge — uses variant pricing if a variant is selected */}
                                {(() => {
                                    const activePrice = selectedVariant ? selectedVariant.price : product.price;
                                    const activeCat = selectedVariant ? (selectedVariant.compareAtPrice ?? null) : (product.compareAtPrice ?? null);
                                    return activeCat && activeCat > activePrice ? (
                                        <span className="px-4 py-1.5 bg-[#dc2626] text-white text-[0.65rem] font-bold tracking-[0.2em] rounded-full uppercase shadow-md text-center">
                                            -{Math.round(((activeCat - activePrice) / activeCat) * 100)}%
                                        </span>
                                    ) : null;
                                })()}
                                {product.isBestseller && <span className="px-4 py-1.5 bg-[#C9A84C] text-[#0F2E22] text-[0.65rem] font-bold tracking-[0.2em] rounded-full uppercase text-center">BEST-SELLER</span>}
                                {product.isNew && <span className="px-4 py-1.5 bg-[#0F2E22] text-white text-[0.65rem] font-bold tracking-[0.2em] rounded-full uppercase text-center">NEW</span>}
                            </div>
                        </div>

                        {/* Image Gallery */}
                        {product.images && product.images.length > 1 && (
                            <div className="grid grid-cols-4 gap-3">
                                {product.images.map((img, i) => (
                                    <div
                                        key={i}
                                        onClick={() => setActiveImage(img)}
                                        className={`aspect-square rounded-2xl overflow-hidden cursor-pointer border-2 transition-all ${(activeImage === img || (!activeImage && i === 0)) ? 'border-gold shadow-md' : 'border-cream-dark/10 hover:border-gold/50'} bg-white flex items-center justify-center`}
                                    >
                                        <img src={img} alt="" className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                        <p className="text-[0.7rem] font-medium uppercase tracking-[0.2em] text-[#C9A84C] mb-6">
                            {typeof product.category === 'object'
                                ? getLocalizedValue(product.category as { fr: string; en: string }, locale)
                                : product.category}
                        </p>
                        <h1 className="text-4xl md:text-5xl font-serif font-normal text-[#0F2E22] leading-tight mb-8 tracking-wide">
                            {getLocalizedValue(product.name, locale)}
                        </h1>

                        {/* Rating - only shown when there are real reviews */}
                        {reviews.length > 0 && (
                            <div className="flex items-center gap-6 mb-10 pb-8 border-b border-cream-dark/20 w-full justify-center lg:justify-start">
                                <div className="flex items-center gap-1.5">
                                    {Array.from({ length: 5 }).map((_, idx) => (
                                        <Star key={idx} className={`w-5 h-5 ${idx < Math.floor(product.rating) ? 'text-[#C9A84C] fill-[#C9A84C]' : 'text-gray-200'}`} />
                                    ))}
                                </div>
                                <span className="text-lg font-semibold text-[#0F2E22]">
                                    {product.rating} <span className="text-[#0F2E22]/50 ml-2 font-light">({reviews.length} {locale === 'fr' ? 'avis vérifiés' : 'verified reviews'})</span>
                                </span>
                            </div>
                        )}

                        {/* Price */}
                        <div className="flex flex-col mb-8 text-center lg:text-left">
                            {(() => {
                                const activePrice = selectedVariant ? selectedVariant.price : product.price;
                                const activeCompareAt = selectedVariant
                                    ? (selectedVariant.compareAtPrice ?? null)
                                    : (product.compareAtPrice ?? null);
                                const showSavings = activeCompareAt && activeCompareAt > activePrice;
                                return (
                                    <>
                                        <div className="flex items-baseline justify-center lg:justify-start gap-4">
                                            <span className="text-4xl font-normal text-[#0F2E22] tracking-wide">{formatPrice(activePrice)}</span>
                                            {showSavings && (
                                                <span className="text-xl text-[#2D2D2D]/40 line-through font-light">{formatPrice(activeCompareAt!)}</span>
                                            )}
                                        </div>
                                        {showSavings && (
                                            <span className="text-sm font-medium text-[#dc2626] mt-2 tracking-wide">
                                                {locale === 'fr' ? 'Vous économisez' : 'You save'} {formatPrice(activeCompareAt! - activePrice)}
                                            </span>
                                        )}
                                    </>
                                );
                            })()}
                        </div>

                        {/* Short Description */}
                        <p className="text-lg text-[#2D2D2D]/70 leading-relaxed font-light mb-12 max-w-xl mx-auto lg:mx-0">
                            {getLocalizedValue(product.shortDescription, locale)}
                        </p>

                        {/* Variant Selection */}
                        {product.variants && product.variants.length > 0 && (
                            <div className="mb-10 w-full">
                                <p className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[#2D2D2D]/40 mb-4 text-center lg:text-left">
                                    {locale === 'fr' ? 'Choisir la taille' : 'Choose Size'}
                                </p>
                                <div className="flex flex-wrap justify-center lg:justify-start gap-3">
                                    {product.variants.map((variant) => {
                                        const isSelected = selectedVariant?.id === variant.id;
                                        const isOutOfStock = variant.stock <= 0;

                                        return (
                                            <button
                                                key={variant.id}
                                                onClick={() => !isOutOfStock && setSelectedVariant(variant)}
                                                disabled={isOutOfStock}
                                                className={`relative px-8 py-3.5 rounded-xl border-2 transition-all font-bold text-[0.85rem] tracking-wider uppercase ${isOutOfStock
                                                    ? 'border-gray-200 bg-gray-50 text-gray-400 opacity-60 cursor-not-allowed line-through decoration-2'
                                                    : isSelected
                                                        ? 'border-[#C9A84C] bg-[#C9A84C]/5 text-[#0F2E22]'
                                                        : 'border-cream-dark/20 text-[#2D2D2D]/60 hover:border-[#C9A84C]/40 hover:text-[#0F2E22]'
                                                    }`}
                                            >
                                                {getLocalizedValue(variant.name, locale)}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Stock Status */}
                        <div className="flex items-center gap-2 mb-6">
                            {(() => {
                                const activeStock = selectedVariant ? selectedVariant.stock : product.stock;
                                return (
                                    <>
                                        <div className={`w-2.5 h-2.5 rounded-full ${activeStock > 10 ? 'bg-green-500' : activeStock > 0 ? 'bg-orange-500' : 'bg-red-500'}`} />
                                        <span className={`text-sm font-medium ${activeStock > 10 ? 'text-green-600' : activeStock > 0 ? 'text-orange-600' : 'text-red-600'}`}>
                                            {activeStock > 10 ? t('inStock') : activeStock > 0 ? `${t('lowStock')} (${activeStock})` : t('outOfStock')}
                                        </span>
                                    </>
                                );
                            })()}
                        </div>

                        {/* Quantity & Add to Cart */}
                        <div className="flex flex-col sm:flex-row gap-4 mb-6">
                            <div className="flex items-center border border-cream-dark/20 rounded-xl overflow-hidden bg-white">
                                {(() => {
                                    const activeStock = selectedVariant ? selectedVariant.stock : product.stock;
                                    return (
                                        <>
                                            <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-12 h-12 flex items-center justify-center hover:bg-cream transition-colors disabled:opacity-50" disabled={activeStock <= 0}>
                                                <Minus className="w-4 h-4" />
                                            </button>
                                            <span className="w-12 h-12 flex items-center justify-center font-semibold text-lg border-x border-cream-dark/20">{activeStock <= 0 ? 0 : quantity}</span>
                                            <button onClick={() => setQuantity(q => Math.min(activeStock, q + 1))} className="w-12 h-12 flex items-center justify-center hover:bg-cream transition-colors disabled:opacity-50" disabled={activeStock <= 0}>
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </>
                                    );
                                })()}
                            </div>

                            <button
                                onClick={handleAddToCart}
                                disabled={(selectedVariant ? selectedVariant.stock : product.stock) <= 0}
                                className={`px-[2.5rem] sm:px-[3rem] py-5 font-bold rounded-xl transition-all duration-300 flex items-center justify-center text-center gap-2 text-[0.95rem] tracking-wide ${addedToCart
                                    ? 'bg-green-600 text-white'
                                    : (selectedVariant ? selectedVariant.stock : product.stock) <= 0
                                        ? 'bg-red-50 text-red-800/80 border border-red-200'
                                        : 'bg-forest hover:bg-forest-light text-white hover:shadow-xl'
                                    } disabled:cursor-not-allowed`}
                            >
                                {addedToCart
                                    ? (<><Check className="w-5 h-5 shrink-0" /><span>{locale === 'fr' ? 'Ajouté !' : 'Added!'}</span></>)
                                    : (selectedVariant ? selectedVariant.stock : product.stock) <= 0
                                        ? (<span>{locale === 'fr' ? 'Rupture de Stock' : 'Out of Stock'}</span>)
                                        : (<><ShoppingBag className="w-5 h-5 shrink-0" /><span>{t('addToCart')}</span></>)
                                }
                            </button>
                            <button
                                onClick={() => product && toggleWishlist(product.id)}
                                className={`w-12 h-12 flex items-center justify-center rounded-xl border transition-colors bg-white ${product && isInWishlist(product.id)
                                    ? 'border-red-300 text-red-500 bg-red-50'
                                    : 'border-cream-dark/20 text-charcoal-light hover:bg-cream hover:border-gold'
                                    }`}
                                title={product && isInWishlist(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
                            >
                                <Heart className={`w-5 h-5 ${product && isInWishlist(product.id) ? 'fill-red-400 text-red-400' : ''}`} />
                            </button>
                        </div>

                        {/* Buy Now */}
                        <button
                            onClick={handleBuyNow}
                            disabled={(selectedVariant ? selectedVariant.stock : product.stock) <= 0}
                            className={`px-[2.5rem] sm:px-[3.5rem] py-5 font-bold rounded-xl transition-all duration-300 inline-flex items-center justify-center text-center gap-2 text-[0.95rem] tracking-wide mb-8 w-[calc(100%-2rem)] sm:w-auto mx-auto lg:mx-0 disabled:cursor-not-allowed ${(selectedVariant ? selectedVariant.stock : product.stock) <= 0 ? 'bg-gray-100 text-gray-400 border border-gray-200' : 'bg-gold hover:bg-gold-light text-forest-dark hover:shadow-xl'}`}
                        >
                            <span>{(selectedVariant ? selectedVariant.stock : product.stock) <= 0 ? (locale === 'fr' ? 'Interrompu' : 'Unavailable') : t('buyNow')}</span>
                        </button>

                        {/* Trust Badges */}
                        <div className="grid grid-cols-3 gap-4 p-4 bg-white rounded-2xl border border-cream-dark/10">
                            {[
                                { icon: Truck, label: locale === 'fr' ? 'Livraison Gratuite' : 'Free Shipping' },
                                { icon: RotateCcw, label: locale === 'fr' ? 'Retour 14 jours' : '14-Day Returns' },
                                { icon: ShieldCheck, label: locale === 'fr' ? 'Paiement Sécurisé' : 'Secure Payment' },
                            ].map(({ icon: Icon, label }) => (
                                <div key={label} className="flex flex-col items-center text-center gap-1.5">
                                    <Icon className="w-5 h-5 text-forest" />
                                    <span className="text-[11px] font-medium text-charcoal-light">{label}</span>
                                </div>
                            ))}
                        </div>

                        {/* Certifications */}
                        <div className="flex flex-wrap gap-2 mt-6">
                            {product.certifications.map(cert => (
                                <span key={cert} className="inline-flex items-center gap-1 px-3 py-1.5 bg-cream rounded-full text-xs font-medium text-forest">
                                    <Award className="w-3 h-3" /> {cert}
                                </span>
                            ))}
                        </div>

                        <p className="text-xs text-charcoal-light mt-6">{t('sku')}: {selectedVariant ? selectedVariant.sku : product.sku}</p>
                    </div>
                </div>
            </div >

            {/* Tabs Section */}
            < div className="mt-24" >
                <div className="flex overflow-x-auto justify-center gap-8 border-b border-cream-dark/20 mb-12 pb-4">
                    {tabs.map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`text-[0.85rem] font-medium tracking-widest uppercase whitespace-nowrap transition-all pb-4 border-b-2 -mb-[18px] ${activeTab === tab.key ? 'text-[#C9A84C] border-[#C9A84C]' : 'text-charcoal-light border-transparent hover:text-forest'}`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="bg-white rounded-3xl p-8 md:p-12 min-h-[300px] max-w-4xl mx-auto">
                    {activeTab === 'description' && (
                        <div className="prose prose-lg max-w-none">
                            <p className="text-charcoal-light leading-relaxed text-base">{getLocalizedValue(product.description, locale)}</p>
                        </div>
                    )}

                    {activeTab === 'benefits' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {benefits.map((benefit: { icon: string; title: { fr: string; en: string }; description: { fr: string; en: string } }, i: number) => (
                                <div key={i} className="flex gap-4 p-5 bg-cream/50 rounded-2xl hover:bg-cream transition-colors">
                                    <div className="w-12 h-12 rounded-xl bg-forest/10 flex items-center justify-center shrink-0 text-2xl">{benefit.icon}</div>
                                    <div>
                                        <h4 className="font-serif font-semibold text-forest-dark mb-1">{getLocalizedValue(benefit.title, locale)}</h4>
                                        <p className="text-sm text-charcoal-light">{getLocalizedValue(benefit.description, locale)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'ingredients' && (
                        <div className="space-y-8">
                            <p className="text-charcoal-light mb-6">{locale === 'fr' ? 'Chaque ingrédient est soigneusement sélectionné pour sa pureté et son efficacité.' : 'Each ingredient is carefully selected for its purity and effectiveness.'}</p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {ingredients.map((ing: { name: { fr: string; en: string }; description: { fr: string; en: string } }, i: number) => (
                                    <div key={i} className="text-center p-6 bg-gradient-to-br from-cream to-sage/10 rounded-2xl">
                                        <div className="w-20 h-20 rounded-full bg-white shadow-sm mx-auto mb-4 flex items-center justify-center"><span className="text-3xl">🌱</span></div>
                                        <h4 className="font-serif font-semibold text-forest-dark mb-2">{getLocalizedValue(ing.name, locale)}</h4>
                                        <p className="text-sm text-charcoal-light">{getLocalizedValue(ing.description, locale)}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'usage' && (
                        <div className="max-w-2xl">
                            <div className="p-6 bg-cream/50 rounded-2xl border-l-4 border-gold">
                                <h4 className="font-serif font-semibold text-forest-dark mb-3 flex items-center gap-2">📋 {t('usage')}</h4>
                                <p className="text-charcoal-light leading-relaxed">{getLocalizedValue(product.usage, locale)}</p>
                            </div>
                        </div>
                    )}

                    {activeTab === 'reviews' && (
                        <div>
                            {reviews.length === 0 ? (
                                <p className="text-center text-charcoal-light py-8">{locale === 'fr' ? 'Aucun avis pour le moment.' : 'No reviews yet.'}</p>
                            ) : (
                                <div className="space-y-6">
                                    {reviews.map(review => (
                                        <div key={review.id} className="p-6 bg-cream/30 rounded-2xl">
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="w-10 h-10 rounded-full bg-forest flex items-center justify-center text-white font-serif font-bold text-sm">
                                                    {review.userName.split(' ').map((n: string) => n[0]).join('')}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-sm">{review.userName}</p>
                                                    <div className="flex items-center gap-0.5">
                                                        {Array.from({ length: 5 }).map((_, idx) => (
                                                            <Star key={idx} className={`w-3 h-3 ${idx < review.rating ? 'text-gold fill-gold' : 'text-cream-dark'}`} />
                                                        ))}
                                                    </div>
                                                </div>
                                                {review.verified && (
                                                    <span className="ml-auto text-xs text-gold font-medium">✓ {locale === 'fr' ? 'Vérifié' : 'Verified'}</span>
                                                )}
                                            </div>
                                            <p className="text-sm text-charcoal-light">{getLocalizedValue(review.comment as { fr: string; en: string }, locale)}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* FAQ */}
                    {faq.length > 0 && (
                        <div className="mt-24 max-w-3xl mx-auto">
                            <h2 className="text-3xl md:text-4xl font-serif font-normal text-forest-dark mb-12 text-center tracking-wide">{t('faq')}</h2>
                            <div className="space-y-4">
                                {faq.map((item: { question: { fr: string; en: string }; answer: { fr: string; en: string } }, i: number) => (
                                    <div key={i} className="bg-cream/20 rounded-2xl overflow-hidden">
                                        <button
                                            onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                            className="w-full flex items-center justify-between p-6 text-left font-serif font-normal text-lg tracking-wide text-forest-dark hover:bg-cream/40 transition-colors"
                                        >
                                            {getLocalizedValue(item.question, locale)}
                                            <ChevronDown className={`w-5 h-5 text-gold transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`} />
                                        </button>
                                        {openFaq === i && (
                                            <div className="px-6 pb-6 text-[0.9375rem] font-light text-charcoal-light leading-relaxed border-t border-cream-dark/10 pt-4 mt-2 mx-2">
                                                {getLocalizedValue(item.answer, locale)}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Related Products */}
                    {relatedProducts.length > 0 && (
                        <div className="mt-32">
                            <h2 className="text-3xl md:text-4xl font-serif font-normal text-forest-dark mb-16 text-center tracking-wide">{t('relatedProducts')}</h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                                {relatedProducts.map(rp => (
                                    <Link key={rp.id} href={{ pathname: '/produit/[slug]', params: { slug: rp.slug } }} className="group block text-center">
                                        <div className="aspect-[4/5] bg-gradient-to-br from-cream to-sage/10 rounded-[2rem] flex items-center justify-center mb-6 overflow-hidden">
                                            {rp.images?.[0] ? (
                                                <img
                                                    src={rp.images[0]}
                                                    alt={getLocalizedValue(rp.name, locale)}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                                                />
                                            ) : (
                                                <span className="text-5xl opacity-80 group-hover:scale-110 group-hover:opacity-100 transition-all duration-700 ease-out">🌿</span>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <h3 className="font-serif font-normal text-lg tracking-wide text-forest-dark group-hover:text-gold transition-colors line-clamp-1">
                                                {getLocalizedValue(rp.name, locale)}
                                            </h3>
                                            <p className="text-[0.9375rem] font-medium text-forest-dark/80 tracking-widest">{formatPrice(rp.price)}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Sticky Add to Cart Bar */}
            <div className="sticky bottom-0 bg-white/90 backdrop-blur-xl border-t border-cream-dark/20 py-3 z-40 lg:hidden">
                <div className="container-premium flex items-center gap-4">
                    <div>
                        <p className="text-sm text-charcoal-light line-clamp-1">{product && getLocalizedValue(product.name, locale)}</p>
                        <p className="text-lg font-bold text-forest-dark">{product && formatPrice(selectedVariant ? selectedVariant.price : product.price)}</p>
                    </div>
                    <button
                        onClick={handleAddToCart}
                        className="ml-auto px-6 py-3 bg-forest text-white font-semibold rounded-xl flex items-center gap-2 hover:bg-forest-light transition-colors"
                    >
                        <ShoppingBag className="w-4 h-4" />
                        {t('addToCart')}
                    </button>
                </div>
            </div>
        </div>
    );
}
