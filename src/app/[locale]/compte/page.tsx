'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { User, Package, Heart, Settings, LogOut, ChevronRight, Mail, MapPin, Phone } from 'lucide-react';

export default function AccountPage() {
    const t = useTranslations('account');
    const ta = useTranslations('auth');
    const locale = useLocale();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [activeTab, setActiveTab] = useState('profile');
    const [loginForm, setLoginForm] = useState({ email: '', password: '' });

    if (!isLoggedIn) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center py-20 px-4">
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-[2rem] p-10 lg:p-12 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.06)] border border-cream-dark/20 text-center">
                        <div className="text-center mb-10">
                            <div className="w-20 h-20 bg-gradient-to-br from-[#FEFAE0] to-[#E8D8A0]/30 rounded-full flex items-center justify-center mx-auto mb-6 border border-cream-dark/10">
                                <User className="w-8 h-8 text-[#C9A84C]" />
                            </div>
                            <h1 className="text-3xl font-serif font-normal text-forest-dark tracking-wide">{ta('login')}</h1>
                        </div>
                        <form onSubmit={(e) => { e.preventDefault(); setIsLoggedIn(true); }} className="space-y-6 text-left">
                            <div>
                                <label className="block text-[0.8rem] font-medium tracking-wide uppercase text-charcoal-light mb-2">{ta('email')}</label>
                                <input
                                    type="email"
                                    value={loginForm.email}
                                    onChange={(e) => setLoginForm(f => ({ ...f, email: e.target.value }))}
                                    className="w-full px-5 py-4 bg-[#FEFAE0]/30 border border-cream-dark/30 rounded-xl text-[0.9375rem] focus:outline-none focus:ring-1 focus:ring-gold/50 transition-shadow"
                                    placeholder="vous@email.com"
                                />
                            </div>
                            <div>
                                <label className="block text-[0.8rem] font-medium tracking-wide uppercase text-charcoal-light mb-2">{ta('password')}</label>
                                <input
                                    type="password"
                                    value={loginForm.password}
                                    onChange={(e) => setLoginForm(f => ({ ...f, password: e.target.value }))}
                                    className="w-full px-5 py-4 bg-[#FEFAE0]/30 border border-cream-dark/30 rounded-xl text-[0.9375rem] focus:outline-none focus:ring-1 focus:ring-gold/50 transition-shadow"
                                    placeholder="••••••••"
                                />
                            </div>
                            <button type="submit" className="w-full py-5 bg-[#0F2E22] hover:bg-[#1B4332] text-white font-medium rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 tracking-[0.15em] uppercase text-[0.8125rem] mt-2">
                                {ta('loginButton')}
                            </button>
                            <p className="text-center text-[0.85rem] text-charcoal-light mt-6">
                                {ta('noAccount')}{' '}
                                <button type="button" className="text-gold font-medium hover:text-gold-light transition-colors underline underline-offset-4">{ta('signupButton')}</button>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        );
    }

    const menuItems = [
        { key: 'profile', icon: User, label: t('profile') },
        { key: 'orders', icon: Package, label: t('orders') },
        { key: 'wishlist', icon: Heart, label: t('wishlist') },
        { key: 'settings', icon: Settings, label: t('settings') },
    ];

    return (
        <div className="min-h-screen bg-white">
            <div className="container-premium py-24">
                <h1 className="text-4xl md:text-5xl font-serif font-normal text-forest-dark mb-16 tracking-wide text-center">{t('title')}</h1>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 text-center lg:text-left">
                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-[#FEFAE0]/40 rounded-[2rem] p-6 lg:p-4 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.06)] border border-cream-dark/20 lg:sticky lg:top-32">
                            <div className="flex flex-col lg:flex-row items-center gap-4 p-4 mb-6 border-b border-cream-dark/20 pb-8 lg:pb-6">
                                <div className="w-16 h-16 rounded-full bg-forest flex items-center justify-center text-white font-serif font-normal text-2xl shadow-sm">J</div>
                                <div>
                                    <p className="font-serif font-normal text-lg text-forest-dark tracking-wide">Jean Dupont</p>
                                    <p className="text-sm text-charcoal-light font-light mt-1">jean@example.com</p>
                                </div>
                            </div>
                            <nav className="space-y-1.5">
                                {menuItems.map(item => (
                                    <button
                                        key={item.key}
                                        onClick={() => setActiveTab(item.key)}
                                        className={`w-full flex items-center justify-center lg:justify-start gap-4 px-5 py-3.5 rounded-xl text-[0.9375rem] transition-colors ${activeTab === item.key ? 'bg-forest text-white' : 'text-charcoal-light hover:bg-[#FEFAE0]'
                                            }`}
                                    >
                                        <item.icon className="w-4 h-4 opacity-70" />
                                        <span className="font-medium tracking-wide">{item.label}</span>
                                    </button>
                                ))}
                                <div className="pt-4 mt-4 border-t border-cream-dark/20">
                                    <button
                                        onClick={() => setIsLoggedIn(false)}
                                        className="w-full flex items-center justify-center lg:justify-start gap-4 px-5 py-3.5 rounded-xl text-[0.9375rem] font-medium text-red-500 hover:bg-red-50 transition-colors tracking-wide"
                                    >
                                        <LogOut className="w-4 h-4 opacity-70" />
                                        {locale === 'fr' ? 'Déconnexion' : 'Logout'}
                                    </button>
                                </div>
                            </nav>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="lg:col-span-3">
                        <div className="bg-white rounded-[2rem] p-8 lg:p-14 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.06)] border border-cream-dark/20 min-h-[400px] text-left">
                            {activeTab === 'profile' && (
                                <div>
                                    <h2 className="font-serif font-normal text-3xl text-forest-dark mb-10 tracking-wide text-center lg:text-left">{t('profile')}</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-[0.8rem] font-medium tracking-wide uppercase text-charcoal-light mb-2">{locale === 'fr' ? 'Prénom' : 'First Name'}</label>
                                            <input defaultValue="Jean" className="w-full px-5 py-4 bg-[#FEFAE0]/30 border border-cream-dark/30 rounded-xl text-[0.9375rem] focus:outline-none focus:ring-1 focus:ring-gold/50 transition-shadow" />
                                        </div>
                                        <div>
                                            <label className="block text-[0.8rem] font-medium tracking-wide uppercase text-charcoal-light mb-2">{locale === 'fr' ? 'Nom' : 'Last Name'}</label>
                                            <input defaultValue="Dupont" className="w-full px-5 py-4 bg-[#FEFAE0]/30 border border-cream-dark/30 rounded-xl text-[0.9375rem] focus:outline-none focus:ring-1 focus:ring-gold/50 transition-shadow" />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-[0.8rem] font-medium tracking-wide uppercase text-charcoal-light mb-2">Email</label>
                                            <input defaultValue="jean@example.com" className="w-full px-5 py-4 bg-[#FEFAE0]/30 border border-cream-dark/30 rounded-xl text-[0.9375rem] focus:outline-none focus:ring-1 focus:ring-gold/50 transition-shadow" />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-[0.8rem] font-medium tracking-wide uppercase text-charcoal-light mb-2">{locale === 'fr' ? 'Téléphone' : 'Phone'}</label>
                                            <input defaultValue="+33 6 12 34 56 78" className="w-full px-5 py-4 bg-[#FEFAE0]/30 border border-cream-dark/30 rounded-xl text-[0.9375rem] focus:outline-none focus:ring-1 focus:ring-gold/50 transition-shadow" />
                                        </div>
                                    </div>
                                    <button className="mt-10 w-full sm:w-auto px-10 py-4 bg-forest text-white font-medium rounded-full hover:bg-forest-light transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 tracking-[0.15em] uppercase text-[0.8125rem]">
                                        {locale === 'fr' ? 'Enregistrer' : 'Save'}
                                    </button>
                                </div>
                            )}

                            {activeTab === 'orders' && (
                                <div>
                                    <h2 className="font-serif font-normal text-3xl text-forest-dark mb-10 tracking-wide text-center lg:text-left">{t('orderHistory')}</h2>
                                    <div className="space-y-6">
                                        {[
                                            { id: 'SV-2025-001', date: '15 Fév 2025', status: 'delivered', total: 89.97 },
                                            { id: 'SV-2025-002', date: '28 Jan 2025', status: 'shipped', total: 54.98 },
                                        ].map(order => (
                                            <div key={order.id} className="flex flex-col sm:flex-row items-center gap-6 p-6 md:p-8 bg-[#FEFAE0]/40 border border-cream-dark/20 rounded-2xl transition-shadow hover:shadow-md">
                                                <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center border border-cream-dark/20 shrink-0">
                                                    <Package className="w-6 h-6 text-gold" />
                                                </div>
                                                <div className="flex-1 text-center sm:text-left">
                                                    <p className="font-serif font-normal text-lg tracking-wide text-forest-dark mb-1">{order.id}</p>
                                                    <p className="text-[0.9375rem] text-charcoal-light font-light">{order.date}</p>
                                                </div>
                                                <span className={`px-4 py-1.5 rounded-full text-[0.65rem] font-medium tracking-widest uppercase items-center ${order.status === 'delivered' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-[#FEFAE0] text-[#0F2E22] border border-[#C9A84C]'
                                                    }`}>
                                                    {order.status === 'delivered' ? (locale === 'fr' ? 'Livré' : 'Delivered') : (locale === 'fr' ? 'Expédié' : 'Shipped')}
                                                </span>
                                                <p className="font-medium text-xl tracking-wide text-forest-dark mt-2 sm:mt-0">{formatPrice(order.total)}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'wishlist' && (
                                <div className="text-center lg:text-left">
                                    <h2 className="font-serif font-normal text-3xl text-forest-dark mb-10 tracking-wide">{t('wishlist')}</h2>
                                    <div className="py-12 border-2 border-dashed border-cream-dark/30 rounded-2xl flex flex-col items-center">
                                        <Heart className="w-12 h-12 text-cream-dark mb-4" />
                                        <p className="text-charcoal-light font-light text-lg">{locale === 'fr' ? 'Votre liste de favoris est vide.' : 'Your wishlist is empty.'}</p>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'settings' && (
                                <div>
                                    <h2 className="font-serif font-normal text-3xl text-forest-dark mb-10 tracking-wide text-center lg:text-left">{t('settings')}</h2>
                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-[0.8rem] font-medium tracking-wide uppercase text-charcoal-light mb-2">{t('changePassword')}</label>
                                            <input type="password" placeholder="••••••••" className="w-full px-5 py-4 bg-[#FEFAE0]/30 border border-cream-dark/30 rounded-xl text-[0.9375rem] focus:outline-none focus:ring-1 focus:ring-gold/50 transition-shadow mb-4" />
                                            <input type="password" placeholder={locale === 'fr' ? 'Nouveau mot de passe' : 'New password'} className="w-full px-5 py-4 bg-[#FEFAE0]/30 border border-cream-dark/30 rounded-xl text-[0.9375rem] focus:outline-none focus:ring-1 focus:ring-gold/50 transition-shadow" />
                                        </div>
                                        <button className="w-full sm:w-auto px-10 py-4 bg-forest text-white font-medium rounded-full hover:bg-forest-light transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 tracking-[0.15em] uppercase text-[0.8125rem]">
                                            {locale === 'fr' ? 'Mettre à jour' : 'Update'}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function formatPrice(price: number) {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(price);
}
