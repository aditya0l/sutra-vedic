'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useCart } from '@/lib/cart-context';
import { getLocalizedValue, formatPrice } from '@/lib/utils';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';

export default function CartPage() {
    const t = useTranslations('cart');
    const locale = useLocale();
    const { items, updateQuantity, removeItem, getSubtotal, getTax, getShipping, getTotal, storeSettings } = useCart();

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center max-w-md">
                    <div className="w-24 h-24 bg-[#FEFAE0] rounded-full flex items-center justify-center mx-auto mb-8 border border-cream-dark/20 shadow-sm">
                        <ShoppingBag className="w-8 h-8 text-[#C9A84C]" />
                    </div>
                    <h1 className="text-4xl font-serif font-normal text-forest-dark mb-4 tracking-wide">{t('empty')}</h1>
                    <p className="text-charcoal-light mb-10 font-light">{t('emptyMessage')}</p>
                    <Link
                        href="/produits"
                        className="inline-flex items-center justify-center text-center gap-3 px-[3rem] md:px-[4rem] py-5 bg-forest hover:bg-forest-light text-white font-medium rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 tracking-wide text-[0.95rem]"
                    >
                        <span>{t('continueShopping')}</span>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <div className="container-premium py-24">
                <h1 className="text-4xl md:text-5xl font-serif font-normal text-forest-dark mb-16 tracking-wide text-center">
                    {t('title')}
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-6">
                        {items.map(item => {
                            const variant = item.variantId && item.product.variants
                                ? item.product.variants.find(v => v.id === item.variantId)
                                : null;
                            const price = variant ? variant.price : item.product.price;
                            return (
                                <div key={`${item.product.id}-${item.variantId}`} className="bg-white rounded-[2rem] p-6 md:p-8 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.06)] border border-cream-dark/20 flex flex-col sm:flex-row gap-6 items-center sm:items-start text-center sm:text-left transition-all hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)]">
                                    <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-[#FEFAE0] to-[#E8D8A0]/20 flex items-center justify-center shrink-0 border border-cream-dark/10 overflow-hidden">
                                        {item.product.images?.[0] ? (
                                            <img
                                                src={item.product.images[0]}
                                                alt={getLocalizedValue(item.product.name, locale)}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <span className="text-5xl opacity-80">🌿</span>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0 flex flex-col items-center sm:items-start w-full">
                                        <Link href={{ pathname: '/produit/[slug]', params: { slug: item.product.slug } }} className="font-serif font-normal text-xl text-forest-dark hover:text-gold transition-colors line-clamp-1 tracking-wide">
                                            {getLocalizedValue(item.product.name, locale)}
                                            {variant && (
                                                <span className="block text-sm text-[#2D2D2D]/40 font-light mt-1">
                                                    {getLocalizedValue(variant.name, locale)}
                                                </span>
                                            )}
                                        </Link>
                                        <p className="text-[0.75rem] uppercase tracking-widest text-[#C9A84C] mt-2 font-medium">
                                            {typeof item.product.category === 'object'
                                                ? getLocalizedValue(item.product.category as { fr: string; en: string }, locale)
                                                : item.product.category}
                                        </p>
                                        <div className="flex flex-col sm:flex-row items-center gap-6 mt-6 w-full justify-between sm:justify-start">
                                            <div className="flex items-center border border-cream-dark/20 rounded-xl overflow-hidden bg-white/50">
                                                <button onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.variantId)} className="w-10 h-10 flex items-center justify-center hover:bg-[#FEFAE0] transition-colors text-charcoal-light">
                                                    <Minus className="w-3 h-3" />
                                                </button>
                                                <span className="w-12 h-10 flex items-center justify-center text-[0.9375rem] font-medium border-x border-cream-dark/20 text-forest-dark bg-white">{item.quantity}</span>
                                                <button onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.variantId)} className="w-10 h-10 flex items-center justify-center hover:bg-[#FEFAE0] transition-colors text-charcoal-light">
                                                    <Plus className="w-3 h-3" />
                                                </button>
                                            </div>
                                            <button onClick={() => removeItem(item.product.id, item.variantId)} className="text-red-400 hover:text-red-500 transition-colors bg-red-50 p-2.5 rounded-full">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="text-center sm:text-right shrink-0 mt-4 sm:mt-0">
                                        <p className="font-medium text-xl tracking-wide text-forest-dark">{formatPrice(price * item.quantity)}</p>
                                        {item.quantity > 1 && <p className="text-xs text-charcoal-light mt-1.5">{formatPrice(price)} x {item.quantity}</p>}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-[#FEFAE0]/40 rounded-[2rem] p-8 md:p-10 border border-cream-dark/20 sticky top-32">
                            <h2 className="font-serif font-normal text-2xl text-forest-dark mb-8 tracking-wide text-center">
                                {locale === 'fr' ? 'Résumé' : 'Summary'}
                            </h2>
                            <div className="space-y-4 pb-6 border-b border-cream-dark/20">
                                <div className="flex justify-between text-[0.9375rem]">
                                    <span className="text-charcoal-light">{t('subtotal')}</span>
                                    <span className="font-medium text-forest-dark">{formatPrice(getSubtotal())}</span>
                                </div>
                                <div className="flex justify-between text-[0.9375rem]">
                                    <span className="text-charcoal-light">{t('shipping')}</span>
                                    {getShipping() === 0
                                        ? <span className="font-medium tracking-wide text-[#0F2E22] bg-[#C9A84C]/20 px-2.5 py-0.5 rounded-full text-xs uppercase">{t('shippingFree')}</span>
                                        : <span className="font-medium text-forest-dark">{formatPrice(getShipping())}</span>
                                    }
                                </div>
                                <div className="flex justify-between text-[0.9375rem]">
                                    <span className="text-charcoal-light">{t('tax')} ({storeSettings.taxRate}%)</span>
                                    <span className="font-medium text-forest-dark">{formatPrice(getTax())}</span>
                                </div>
                            </div>
                            <div className="flex justify-between pt-6 mb-10 items-center">
                                <span className="font-serif font-normal text-xl text-forest-dark">{t('total')}</span>
                                <span className="font-medium text-3xl text-forest-dark tracking-wide">{formatPrice(getTotal())}</span>
                            </div>
                            <Link
                                href="/checkout"
                                className="px-[3rem] md:px-[4rem] py-5 bg-gold hover:bg-gold-light text-forest-dark font-medium rounded-xl transition-all inline-flex items-center justify-center text-center w-full sm:w-auto mx-auto gap-3 tracking-wide text-[0.95rem] shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                            >
                                <span>{t('checkout')}</span>
                            </Link>
                            <Link
                                href="/produits"
                                className="w-full py-4 mt-4 text-center text-sm font-medium tracking-widest uppercase text-charcoal-light hover:text-gold transition-colors block"
                            >
                                {t('continueShopping')}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
