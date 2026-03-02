'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useCart } from '@/lib/cart-context';
import { ordersApi, auth } from '@/lib/api';
import { getLocalizedValue, formatPrice } from '@/lib/utils';
import { CreditCard, Lock, ShieldCheck, Check, AlertCircle, Building2, Copy } from 'lucide-react';

import { useRouter } from 'next/navigation';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

interface BankInfo { accountHolder: string; bankName: string; iban: string; bic: string; instructions: string; }

function CheckoutContent() {
    const t = useTranslations('checkout');
    const locale = useLocale();
    const router = useRouter();
    const { items, getSubtotal, getTax, getTotal, clearCart } = useCart();
    const [isProcessing, setIsProcessing] = useState(false);
    const [isComplete, setIsComplete] = useState(false);
    const [orderId, setOrderId] = useState('');
    const [orderTotal, setOrderTotal] = useState(0);
    const [bankInfo, setBankInfo] = useState<BankInfo | null>(null);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState('');

    useEffect(() => {
        if (!auth.isLoggedIn()) {
            router.push('/compte?redirect=/checkout');
        }
    }, [router]);

    const [form, setForm] = useState({
        firstName: '', lastName: '',
        phone: '', address: '', city: '',
        state: '', zipCode: '', country: 'France',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((f: typeof form) => ({ ...f, [e.target.name]: e.target.value }));
    };

    function copyToClipboard(text: string, label: string) {
        navigator.clipboard.writeText(text).then(() => {
            setCopied(label);
            setTimeout(() => setCopied(''), 2000);
        });
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (items.length === 0) return;
        setIsProcessing(true);
        setError('');

        try {
            // Fetch bank info
            const bRes = await fetch(`${API}/bank-info`);
            const bData = await bRes.json();
            const bank: BankInfo = bData.data;

            // Create order
            const isLoggedIn = auth.isLoggedIn();
            if (!isLoggedIn) {
                router.push('/login?redirect=/checkout');
                return;
            }

            const shippingAddress = {
                firstName: form.firstName, lastName: form.lastName,
                address: form.address, city: form.city,
                state: form.state || form.city, zipCode: form.zipCode,
                country: 'FR', phone: form.phone,
            };

            const orderData = await ordersApi.create({
                items: items.map(i => ({ productId: i.product.id, quantity: i.quantity })),
                shippingAddress,
                locale: locale as 'fr' | 'en',
            });

            setBankInfo(bank);
            setOrderId(orderData.id);
            setOrderTotal(getTotal());
            clearCart();
            setIsComplete(true);
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Something went wrong.';
            setError(msg);
        } finally {
            setIsProcessing(false);
        }
    };

    const ref = orderId.slice(0, 8).toUpperCase();

    // ─── Success screen: bank transfer instructions ─────────────────────────────
    if (isComplete && bankInfo) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center px-4">
                <div className="max-w-lg w-full">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-[#0F2E22] rounded-full flex items-center justify-center mx-auto mb-6">
                            <Check className="w-8 h-8 text-[#C9A84C]" />
                        </div>
                        <h1 className="text-3xl font-serif text-[#0F2E22] mb-2">Order Confirmed!</h1>
                        <p className="text-gray-500 text-sm">Reference: <strong className="text-[#0F2E22]">SUTRAVEDIC-{ref}</strong></p>
                    </div>

                    {/* Bank transfer info card */}
                    <div className="bg-[#FEFAE0] border border-[#E8D8A0] rounded-2xl p-6 mb-6">
                        <div className="flex items-center gap-3 mb-5">
                            <Building2 className="w-5 h-5 text-[#C9A84C]" />
                            <h2 className="font-semibold text-[#0F2E22]">
                                {locale === 'fr' ? 'Instructions de virement' : 'Bank Transfer Instructions'}
                            </h2>
                        </div>
                        <p className="text-sm text-gray-600 mb-5">
                            {locale === 'fr'
                                ? 'Veuillez effectuer un virement avec les informations ci-dessous. Votre commande sera confirmée dès réception.'
                                : 'Please make a bank transfer using the details below. Your order will be confirmed upon receipt.'}
                        </p>

                        <div className="space-y-3">
                            {[
                                { label: locale === 'fr' ? 'Bénéficiaire' : 'Account Holder', value: bankInfo.accountHolder },
                                { label: locale === 'fr' ? 'Banque' : 'Bank', value: bankInfo.bankName },
                                { label: 'IBAN', value: bankInfo.iban, mono: true, copyKey: 'iban' },
                                { label: 'BIC / SWIFT', value: bankInfo.bic, mono: true, copyKey: 'bic' },
                                { label: locale === 'fr' ? 'Montant exact' : 'Exact Amount', value: `€${orderTotal.toFixed(2)}`, highlight: true, copyKey: 'amount' },
                                { label: locale === 'fr' ? 'Référence' : 'Reference', value: `SUTRAVEDIC-${ref}`, mono: true, copyKey: 'ref' },
                            ].map(row => (
                                <div key={row.label} className="flex items-center justify-between py-2 border-b border-[#E8D8A0] last:border-0">
                                    <span className="text-xs text-gray-500 w-32 shrink-0">{row.label}</span>
                                    <span className={`flex-1 font-semibold text-sm text-right ${row.mono ? 'font-mono' : ''} ${row.highlight ? 'text-[#C9A84C] text-base' : 'text-[#0F2E22]'}`}>
                                        {row.value}
                                    </span>
                                    {row.copyKey && (
                                        <button onClick={() => copyToClipboard(row.value, row.copyKey!)} className="ml-2 p-1 hover:text-[#C9A84C] transition-colors text-gray-400">
                                            {copied === row.copyKey ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>

                        {bankInfo.instructions && (
                            <p className="text-xs text-gray-500 italic mt-4 pt-4 border-t border-[#E8D8A0]">{bankInfo.instructions}</p>
                        )}
                    </div>

                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3">
                        <ShieldCheck className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                        <p className="text-sm text-blue-700">
                            {locale === 'fr'
                                ? "Un email de confirmation vous a été envoyé. Vous recevrez une notification dès que votre paiement sera vérifié (1–2 jours ouvrés)."
                                : "A confirmation email has been sent. You'll receive a notification once we verify your transfer (1–2 business days)."}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // ─── Checkout form ─────────────────────────────────────────────────────────
    return (
        <div className="min-h-screen bg-white">
            <div className="container-premium py-24">
                <h1 className="text-4xl md:text-5xl font-serif font-normal text-forest-dark mb-16 text-center tracking-wide">
                    {t('title')}
                </h1>

                {items.length === 0 ? (
                    <div className="text-center py-20 text-gray-400">Your cart is empty.</div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
                        {/* Left: Form */}
                        <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-6">
                            <div className="bg-white rounded-[2rem] p-8 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.06)] border border-cream-dark/20">
                                <h2 className="font-serif font-normal text-2xl text-forest-dark mb-6">{t('shippingInfo')}</h2>
                                <div className="grid grid-cols-2 gap-4">
                                    {(['firstName', 'lastName'] as const).map(f => (
                                        <div key={f}>
                                            <label className="block text-sm font-medium text-charcoal-light mb-1.5">{t(f)}</label>
                                            <input name={f} value={form[f]} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl border border-cream-dark/30 bg-[#FEFAE0]/30 focus:outline-none focus:border-gold/60 transition-colors text-[0.9375rem]" />
                                        </div>
                                    ))}
                                    {[
                                        { name: 'email', type: 'email', label: t('email'), full: true },
                                        { name: 'phone', type: 'tel', label: t('phone'), full: true },
                                        { name: 'address', type: 'text', label: t('address'), full: true },
                                        { name: 'city', type: 'text', label: t('city'), full: false },
                                        { name: 'zipCode', type: 'text', label: t('postalCode'), full: false },
                                    ].map(f => (
                                        <div key={f.name} className={f.full ? 'col-span-2' : ''}>
                                            <label className="block text-sm font-medium text-charcoal-light mb-1.5">{f.label}</label>
                                            <input name={f.name} type={f.type} value={(form as any)[f.name]} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl border border-cream-dark/30 bg-[#FEFAE0]/30 focus:outline-none focus:border-gold/60 transition-colors text-[0.9375rem]" />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Payment info */}
                            <div className="bg-white rounded-[2rem] p-8 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.06)] border border-cream-dark/20">
                                <h2 className="font-serif font-normal text-2xl text-forest-dark mb-4">{locale === 'fr' ? 'Paiement par virement' : 'Bank Transfer Payment'}</h2>
                                <div className="flex items-start gap-3 bg-[#FEFAE0] border border-[#E8D8A0] rounded-xl p-4">
                                    <Building2 className="w-5 h-5 text-[#C9A84C] shrink-0 mt-0.5" />
                                    <p className="text-sm text-charcoal-light leading-relaxed">
                                        {locale === 'fr'
                                            ? "Après validation de votre commande, vous recevrez nos coordonnées bancaires pour effectuer le virement. Votre commande sera expédiée une fois le paiement confirmé."
                                            : "After confirming your order, you'll receive our bank details for the transfer. Your order ships once payment is confirmed."}
                                    </p>
                                </div>
                                <div className="mt-4 flex items-center gap-2 text-xs text-charcoal-light">
                                    <Lock className="w-3 h-3" />
                                    <span>{locale === 'fr' ? 'Commande sécurisée par cryptage SSL' : 'Secured with SSL encryption'}</span>
                                </div>
                            </div>

                            {error && (
                                <div className="flex items-center gap-2 text-red-600 bg-red-50 rounded-xl p-4">
                                    <AlertCircle className="w-4 h-4 shrink-0" />
                                    <span className="text-sm">{error}</span>
                                </div>
                            )}

                            <button type="submit" disabled={isProcessing} className={`w-full py-5 rounded-xl font-medium text-[0.95rem] tracking-wide transition-all duration-300 shadow-lg flex items-center justify-center gap-3 ${isProcessing ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-[#0F2E22] text-white hover:bg-[#1a4a35] hover:shadow-xl hover:-translate-y-0.5'}`}>
                                <Lock className="w-4 h-4" />
                                {isProcessing ? (locale === 'fr' ? 'Traitement…' : 'Processing…') : (locale === 'fr' ? 'Confirmer la commande' : 'Place Order')}
                            </button>
                        </form>

                        {/* Right: Order summary */}
                        <div className="lg:col-span-2">
                            <div className="bg-[#FEFAE0]/40 rounded-[2rem] p-8 border border-cream-dark/20 sticky top-32">
                                <h2 className="font-serif font-normal text-2xl text-forest-dark mb-6 tracking-wide">
                                    {locale === 'fr' ? 'Résumé' : 'Summary'}
                                </h2>
                                <div className="space-y-4 mb-6">
                                    {items.map(item => (
                                        <div key={item.product.id} className="flex justify-between text-sm">
                                            <span className="text-charcoal-light">
                                                {getLocalizedValue(item.product.name, locale)} × {item.quantity}
                                            </span>
                                            <span className="font-medium text-forest-dark">{formatPrice(item.product.price * item.quantity)}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="space-y-3 pt-4 border-t border-cream-dark/20">
                                    <div className="flex justify-between text-sm"><span className="text-charcoal-light">{t('subtotal')}</span><span className="font-medium">{formatPrice(getSubtotal())}</span></div>
                                    <div className="flex justify-between text-sm"><span className="text-charcoal-light">{t('shipping')}</span><span className="text-xs font-medium uppercase tracking-widest text-[#0F2E22] bg-[#C9A84C]/20 px-2.5 py-0.5 rounded-full">{t('shippingFree')}</span></div>
                                    <div className="flex justify-between text-sm"><span className="text-charcoal-light">{t('tax')} (20%)</span><span className="font-medium">{formatPrice(getTax())}</span></div>
                                </div>
                                <div className="flex justify-between pt-4 mt-4 border-t border-cream-dark/20">
                                    <span className="font-serif text-xl text-forest-dark">{t('total')}</span>
                                    <span className="font-medium text-2xl text-forest-dark">{formatPrice(getTotal())}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function CheckoutPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-[#0F2E22]/10 border-t-[#C9A84C] rounded-full animate-spin" />
            </div>
        }>
            <CheckoutContent />
        </Suspense>
    );
}
