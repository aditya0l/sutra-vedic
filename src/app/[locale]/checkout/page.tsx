'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useCart } from '@/lib/cart-context';
import { formatPrice, getLocalizedValue } from '@/lib/utils';
import { CreditCard, Lock, ShieldCheck, Check } from 'lucide-react';

export default function CheckoutPage() {
    const t = useTranslations('checkout');
    const locale = useLocale();
    const { items, getSubtotal, getTax, getTotal } = useCart();
    const [isProcessing, setIsProcessing] = useState(false);
    const [isComplete, setIsComplete] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);
        setTimeout(() => {
            setIsProcessing(false);
            setIsComplete(true);
        }, 2000);
    };

    if (isComplete) {
        return (
            <div className="min-h-screen bg-cream flex items-center justify-center">
                <div className="text-center max-w-md animate-scale-in">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Check className="w-10 h-10 text-green-600" />
                    </div>
                    <h1 className="text-3xl font-serif font-bold text-forest-dark mb-3">
                        {locale === 'fr' ? 'Commande Confirmée !' : 'Order Confirmed!'}
                    </h1>
                    <p className="text-charcoal-light mb-2">
                        {locale === 'fr' ? 'Merci pour votre commande. Un email de confirmation vous a été envoyé.' : 'Thank you for your order. A confirmation email has been sent.'}
                    </p>
                    <p className="text-sm text-charcoal-light">
                        {locale === 'fr' ? 'N° de commande :' : 'Order #:'} <span className="font-mono font-bold text-forest">SV-{Date.now().toString(36).toUpperCase()}</span>
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-cream">
            <div className="container-premium py-12">
                <h1 className="text-4xl font-serif font-bold text-forest-dark mb-10">{t('title')}</h1>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Shipping Form */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-2xl p-8 shadow-sm border border-cream-dark/10">
                            <h2 className="font-serif font-semibold text-xl text-forest-dark mb-6">{t('shippingInfo')}</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[
                                    { name: 'firstName', label: t('firstName'), type: 'text' },
                                    { name: 'lastName', label: t('lastName'), type: 'text' },
                                    { name: 'email', label: t('email'), type: 'email', full: true },
                                    { name: 'phone', label: t('phone'), type: 'tel' },
                                    { name: 'address', label: t('address'), type: 'text', full: true },
                                    { name: 'city', label: t('city'), type: 'text' },
                                    { name: 'state', label: t('state'), type: 'text' },
                                    { name: 'zipCode', label: t('zipCode'), type: 'text' },
                                    { name: 'country', label: t('country'), type: 'text' },
                                ].map(field => (
                                    <div key={field.name} className={field.full ? 'md:col-span-2' : ''}>
                                        <label className="block text-sm font-medium text-charcoal mb-1.5">{field.label}</label>
                                        <input
                                            type={field.type}
                                            required
                                            className="w-full px-4 py-3 bg-cream/50 border border-cream-dark/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold/50 transition-all"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Payment */}
                        <div className="bg-white rounded-2xl p-8 shadow-sm border border-cream-dark/10">
                            <h2 className="font-serif font-semibold text-xl text-forest-dark mb-6 flex items-center gap-2">
                                <CreditCard className="w-5 h-5 text-gold" />
                                {t('paymentMethod')}
                            </h2>
                            <div className="p-6 bg-cream/50 rounded-xl border border-cream-dark/20">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-charcoal mb-1.5">
                                            {locale === 'fr' ? 'Numéro de carte' : 'Card Number'}
                                        </label>
                                        <input type="text" placeholder="4242 4242 4242 4242" className="w-full px-4 py-3 bg-white border border-cream-dark/20 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-gold/30" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-charcoal mb-1.5">
                                                {locale === 'fr' ? 'Expiration' : 'Expiry'}
                                            </label>
                                            <input type="text" placeholder="MM/YY" className="w-full px-4 py-3 bg-white border border-cream-dark/20 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-gold/30" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-charcoal mb-1.5">CVC</label>
                                            <input type="text" placeholder="123" className="w-full px-4 py-3 bg-white border border-cream-dark/20 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-gold/30" />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 mt-4 text-xs text-charcoal-light">
                                    <Lock className="w-3.5 h-3.5 text-green-600" />
                                    {locale === 'fr' ? 'Paiement sécurisé par Stripe' : 'Secured by Stripe'}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-cream-dark/10 sticky top-28">
                            <h2 className="font-serif font-semibold text-xl text-forest-dark mb-6">{t('orderSummary')}</h2>

                            <div className="space-y-4 pb-4 border-b border-cream-dark/10 max-h-64 overflow-auto">
                                {items.map(item => (
                                    <div key={item.product.id} className="flex gap-3">
                                        <div className="w-14 h-14 rounded-lg bg-cream flex items-center justify-center shrink-0">
                                            <span className="text-2xl">🌿</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-forest-dark line-clamp-1">{getLocalizedValue(item.product.name, locale)}</p>
                                            <p className="text-xs text-charcoal-light">x{item.quantity}</p>
                                        </div>
                                        <p className="text-sm font-semibold shrink-0">{formatPrice(item.product.price * item.quantity)}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-2 py-4 border-b border-cream-dark/10 text-sm">
                                <div className="flex justify-between"><span className="text-charcoal-light">{locale === 'fr' ? 'Sous-total' : 'Subtotal'}</span><span>{formatPrice(getSubtotal())}</span></div>
                                <div className="flex justify-between"><span className="text-charcoal-light">{locale === 'fr' ? 'Livraison' : 'Shipping'}</span><span className="text-green-600">{locale === 'fr' ? 'Gratuite' : 'Free'}</span></div>
                                <div className="flex justify-between"><span className="text-charcoal-light">TVA (20%)</span><span>{formatPrice(getTax())}</span></div>
                            </div>

                            <div className="flex justify-between pt-4 mb-6">
                                <span className="font-serif font-semibold text-lg">Total</span>
                                <span className="font-bold text-2xl text-forest-dark">{formatPrice(getTotal())}</span>
                            </div>

                            <button
                                type="submit"
                                disabled={isProcessing || items.length === 0}
                                className="w-[calc(100%-2rem)] mx-auto sm:w-auto px-[3rem] md:px-[4rem] py-5 bg-[#C9A84C] hover:bg-[#D4B96A] text-[#0F2E22] font-bold rounded-xl transition-all flex items-center justify-center text-center gap-2 text-[0.95rem] tracking-wide disabled:opacity-50 hover:shadow-xl"
                            >
                                {isProcessing ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-[#0F2E22]/30 border-t-[#0F2E22] rounded-full animate-spin shrink-0" />
                                        <span>{t('processing')}</span>
                                    </>
                                ) : (
                                    <>
                                        <ShieldCheck className="w-4 h-4 shrink-0" />
                                        <span>{t('placeOrder')}</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
