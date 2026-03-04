'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { auth, ordersApi, customerApi } from '@/lib/api';
import { auth as firebaseAuth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { User, Order } from '@/types';
import { User as UserIcon, Package, Heart, Settings, LogOut } from 'lucide-react';

function formatPrice(price: number) {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(price);
}

export default function AccountPage() {
    const t = useTranslations('account');
    const ta = useTranslations('auth');
    const locale = useLocale();

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [authChecking, setAuthChecking] = useState(true); // true while Firebase resolves session
    const [activeTab, setActiveTab] = useState('profile');
    const [loginForm, setLoginForm] = useState({ email: '', password: '' });
    const [registerForm, setRegisterForm] = useState({ name: '', email: '', password: '' });
    const [showRegister, setShowRegister] = useState(false);
    const [authError, setAuthError] = useState('');
    const [authLoading, setAuthLoading] = useState(false);

    const [user, setUser] = useState<User | null>(null);
    const [orders, setOrders] = useState<any[]>([]);
    const [profileForm, setProfileForm] = useState({ name: '', email: '' });
    const [profileSaved, setProfileSaved] = useState(false);
    const [refInputs, setRefInputs] = useState<Record<string, string>>({});
    const [submittingRef, setSubmittingRef] = useState<string | null>(null);

    // Subscribe to Firebase auth state - persists across page refreshes correctly
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(firebaseAuth, (firebaseUser) => {
            if (firebaseUser) {
                const mappedUser: User = {
                    id: firebaseUser.uid,
                    email: firebaseUser.email!,
                    name: firebaseUser.displayName || firebaseUser.email!.split('@')[0],
                    role: 'customer' as const,
                };
                setUser(mappedUser);
                setProfileForm({ name: mappedUser.name, email: mappedUser.email });
                setIsLoggedIn(true);
            } else {
                setUser(null);
                setIsLoggedIn(false);
            }
            setAuthChecking(false); // Firebase has resolved
        });
        return () => unsubscribe();
    }, []);

    // Fetch orders when switching to orders tab
    useEffect(() => {
        if (isLoggedIn && activeTab === 'orders') {
            ordersApi.list()
                .then(setOrders)
                .catch((err) => { console.error('Orders fetch error:', err); setOrders([]); });
        }
    }, [isLoggedIn, activeTab]);

    const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    const redirectUrl = searchParams?.get('redirect') || null;

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setAuthLoading(true);
        setAuthError('');
        try {
            const res = await auth.login(loginForm.email, loginForm.password);
            setUser(res.user);
            setProfileForm({ name: res.user.name, email: res.user.email });
            setIsLoggedIn(true);
            if (redirectUrl) window.location.href = redirectUrl;
        } catch (err: unknown) {
            setAuthError(err instanceof Error ? err.message : 'Login failed');
        } finally {
            setAuthLoading(false);
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setAuthLoading(true);
        setAuthError('');
        try {
            const res = await auth.register(registerForm.name, registerForm.email, registerForm.password);
            setUser(res.user);
            setProfileForm({ name: res.user.name, email: res.user.email });
            setIsLoggedIn(true);
            if (redirectUrl) window.location.href = redirectUrl;
        } catch (err: unknown) {
            setAuthError(err instanceof Error ? err.message : 'Registration failed');
        } finally {
            setAuthLoading(false);
        }
    };

    const handleLogout = () => {
        auth.logout();
        setIsLoggedIn(false);
        setUser(null);
    };

    const handleProfileSave = async () => {
        try {
            await customerApi.updateProfile({ name: profileForm.name });
            setProfileSaved(true);
            setTimeout(() => setProfileSaved(false), 2000);
        } catch {
            //silent
        }
    };

    const submitPaymentReference = async (orderId: string) => {
        const ref = refInputs[orderId];
        if (!ref?.trim()) return;

        setSubmittingRef(orderId);
        try {
            // Update Firestore directly for MVP
            const { doc, updateDoc } = await import('firebase/firestore');
            const { db } = await import('@/lib/firebase');
            await updateDoc(doc(db, 'orders', orderId), {
                paymentReference: ref,
                updatedAt: new Date().toISOString()
            });

            // Trigger Email
            const order = orders.find(o => o.id === orderId);
            if (order) {
                fetch('/api/email', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        action: 'PAYMENT_SUBMITTED',
                        order,
                        locale,
                        customerEmail: user?.email,
                        customerName: user?.name,
                        extra: { paymentReference: ref }
                    })
                }).catch(console.error);
            }

            // Refresh orders to show the ref
            const freshOrders = await ordersApi.list();
            setOrders(freshOrders);
            setRefInputs(prev => ({ ...prev, [orderId]: '' }));
        } catch (err) {
            console.error("Failed to submit ref:", err);
            alert("Failed to submit payment reference. Please try again.");
        } finally {
            setSubmittingRef(null);
        }
    };

    // Show nothing while Firebase is resolving session (prevents flash of login form on refresh)
    if (authChecking) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div style={{ width: 40, height: 40, border: '3px solid #e5e7eb', borderTop: '3px solid #0F2E22', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    if (!isLoggedIn) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center py-20 px-4">
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-[2rem] p-10 lg:p-12 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.06)] border border-cream-dark/20 text-center">
                        <div className="text-center mb-10">
                            <div className="w-20 h-20 bg-gradient-to-br from-[#FEFAE0] to-[#E8D8A0]/30 rounded-full flex items-center justify-center mx-auto mb-6 border border-cream-dark/10">
                                <UserIcon className="w-8 h-8 text-[#C9A84C]" />
                            </div>
                            <h1 className="text-3xl font-serif font-normal text-forest-dark tracking-wide">
                                {showRegister ? ta('signupButton') : ta('login')}
                            </h1>
                        </div>

                        {authError && (
                            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
                                {authError}
                            </div>
                        )}

                        {!showRegister ? (
                            <form onSubmit={handleLogin} className="space-y-6 text-left">
                                <div>
                                    <label className="block text-[0.8rem] font-medium tracking-wide uppercase text-charcoal-light mb-2">{ta('email')}</label>
                                    <input
                                        type="email"
                                        required
                                        value={loginForm.email}
                                        onChange={(e) => setLoginForm(f => ({ ...f, email: e.target.value }))}
                                        className="w-full px-5 py-4 bg-[#FEFAE0]/30 border border-cream-dark/30 rounded-xl text-[0.9375rem] focus:outline-none focus:ring-1 focus:ring-gold/50"
                                        placeholder="vous@email.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[0.8rem] font-medium tracking-wide uppercase text-charcoal-light mb-2">{ta('password')}</label>
                                    <input
                                        type="password"
                                        required
                                        value={loginForm.password}
                                        onChange={(e) => setLoginForm(f => ({ ...f, password: e.target.value }))}
                                        className="w-full px-5 py-4 bg-[#FEFAE0]/30 border border-cream-dark/30 rounded-xl text-[0.9375rem] focus:outline-none focus:ring-1 focus:ring-gold/50"
                                        placeholder="••••••••"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={authLoading}
                                    className="w-full py-5 bg-[#0F2E22] hover:bg-[#1B4332] text-white font-medium rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 tracking-[0.15em] uppercase text-[0.8125rem] mt-2 disabled:opacity-50"
                                >
                                    {authLoading ? '...' : ta('loginButton')}
                                </button>
                                <p className="text-center text-[0.85rem] text-charcoal-light mt-6">
                                    {ta('noAccount')}{' '}
                                    <button type="button" onClick={() => { setShowRegister(true); setAuthError(''); }} className="text-gold font-medium hover:text-gold-light transition-colors underline underline-offset-4">
                                        {ta('signupButton')}
                                    </button>
                                </p>
                            </form>
                        ) : (
                            <form onSubmit={handleRegister} className="space-y-6 text-left">
                                <div>
                                    <label className="block text-[0.8rem] font-medium tracking-wide uppercase text-charcoal-light mb-2">{locale === 'fr' ? 'Nom complet' : 'Full name'}</label>
                                    <input
                                        type="text"
                                        required
                                        value={registerForm.name}
                                        onChange={(e) => setRegisterForm(f => ({ ...f, name: e.target.value }))}
                                        className="w-full px-5 py-4 bg-[#FEFAE0]/30 border border-cream-dark/30 rounded-xl text-[0.9375rem] focus:outline-none focus:ring-1 focus:ring-gold/50"
                                        placeholder="Jean Dupont"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[0.8rem] font-medium tracking-wide uppercase text-charcoal-light mb-2">{ta('email')}</label>
                                    <input
                                        type="email"
                                        required
                                        value={registerForm.email}
                                        onChange={(e) => setRegisterForm(f => ({ ...f, email: e.target.value }))}
                                        className="w-full px-5 py-4 bg-[#FEFAE0]/30 border border-cream-dark/30 rounded-xl text-[0.9375rem] focus:outline-none focus:ring-1 focus:ring-gold/50"
                                        placeholder="vous@email.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[0.8rem] font-medium tracking-wide uppercase text-charcoal-light mb-2">{ta('password')}</label>
                                    <input
                                        type="password"
                                        required
                                        minLength={8}
                                        value={registerForm.password}
                                        onChange={(e) => setRegisterForm(f => ({ ...f, password: e.target.value }))}
                                        className="w-full px-5 py-4 bg-[#FEFAE0]/30 border border-cream-dark/30 rounded-xl text-[0.9375rem] focus:outline-none focus:ring-1 focus:ring-gold/50"
                                        placeholder="••••••••"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={authLoading}
                                    className="w-full py-5 bg-[#0F2E22] hover:bg-[#1B4332] text-white font-medium rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 tracking-[0.15em] uppercase text-[0.8125rem] mt-2 disabled:opacity-50"
                                >
                                    {authLoading ? '...' : ta('signupButton')}
                                </button>
                                <p className="text-center text-[0.85rem] text-charcoal-light mt-6">
                                    <button type="button" onClick={() => { setShowRegister(false); setAuthError(''); }} className="text-gold font-medium hover:text-gold-light transition-colors underline underline-offset-4">
                                        {locale === 'fr' ? '← Retour à la connexion' : '← Back to login'}
                                    </button>
                                </p>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    const menuItems = [
        { key: 'profile', icon: UserIcon, label: t('profile') },
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
                                <div className="w-16 h-16 rounded-full bg-forest flex items-center justify-center text-white font-serif font-normal text-2xl shadow-sm">
                                    {user?.name?.[0]?.toUpperCase() || 'U'}
                                </div>
                                <div>
                                    <p className="font-serif font-normal text-lg text-forest-dark tracking-wide">{user?.name}</p>
                                    <p className="text-sm text-charcoal-light font-light mt-1">{user?.email}</p>
                                </div>
                            </div>
                            <nav className="space-y-1.5">
                                {menuItems.map(item => (
                                    <button
                                        key={item.key}
                                        onClick={() => setActiveTab(item.key)}
                                        className={`w-full flex items-center justify-center lg:justify-start gap-4 px-5 py-3.5 rounded-xl text-[0.9375rem] transition-colors ${activeTab === item.key ? 'bg-forest text-white' : 'text-charcoal-light hover:bg-[#FEFAE0]'}`}
                                    >
                                        <item.icon className="w-4 h-4 opacity-70" />
                                        <span className="font-medium tracking-wide">{item.label}</span>
                                    </button>
                                ))}
                                <div className="pt-4 mt-4 border-t border-cream-dark/20">
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center justify-center lg:justify-start gap-4 px-5 py-3.5 rounded-xl text-[0.9375rem] font-medium text-red-500 hover:bg-red-50 transition-colors"
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
                                    <h2 className="font-serif font-normal text-3xl text-forest-dark mb-10 tracking-wide">{t('profile')}</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="md:col-span-2">
                                            <label className="block text-[0.8rem] font-medium tracking-wide uppercase text-charcoal-light mb-2">{locale === 'fr' ? 'Nom complet' : 'Full Name'}</label>
                                            <input
                                                value={profileForm.name}
                                                onChange={e => setProfileForm(f => ({ ...f, name: e.target.value }))}
                                                className="w-full px-5 py-4 bg-[#FEFAE0]/30 border border-cream-dark/30 rounded-xl text-[0.9375rem] focus:outline-none focus:ring-1 focus:ring-gold/50"
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-[0.8rem] font-medium tracking-wide uppercase text-charcoal-light mb-2">Email</label>
                                            <input value={profileForm.email} disabled className="w-full px-5 py-4 bg-[#FEFAE0]/10 border border-cream-dark/20 rounded-xl text-[0.9375rem] text-charcoal-light cursor-not-allowed" />
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleProfileSave}
                                        className="mt-10 w-full sm:w-auto px-10 py-4 bg-forest text-white font-medium rounded-full hover:bg-forest-light transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 tracking-[0.15em] uppercase text-[0.8125rem]"
                                    >
                                        {profileSaved ? '✓ Saved' : (locale === 'fr' ? 'Enregistrer' : 'Save')}
                                    </button>
                                </div>
                            )}

                            {activeTab === 'orders' && (
                                <div>
                                    <h2 className="font-serif font-normal text-3xl text-forest-dark mb-10 tracking-wide">{t('orderHistory')}</h2>
                                    {orders.length === 0 ? (
                                        <div className="py-12 border-2 border-dashed border-cream-dark/30 rounded-2xl flex flex-col items-center">
                                            <Package className="w-12 h-12 text-cream-dark mb-4" />
                                            <p className="text-charcoal-light font-light text-lg">{locale === 'fr' ? 'Aucune commande pour le moment.' : 'No orders yet.'}</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-6">
                                            {orders.map(order => (
                                                <div key={order.id} className="flex flex-col sm:flex-row items-center sm:items-start lg:items-center gap-6 p-6 md:p-8 bg-[#FEFAE0]/40 border border-cream-dark/20 rounded-2xl hover:shadow-md transition-shadow">
                                                    <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center border border-cream-dark/20 shrink-0">
                                                        <Package className="w-6 h-6 text-gold" />
                                                    </div>
                                                    <div className="flex-1 text-center sm:text-left w-full">
                                                        <p className="font-serif font-normal text-lg tracking-wide text-forest-dark mb-1">#{order.id.slice(0, 8).toUpperCase()}</p>
                                                        <p className="text-[0.9375rem] text-charcoal-light font-light">{new Date(order.createdAt).toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-GB')}</p>

                                                        {order.status === 'pending_payment' && (
                                                            <div className="mt-4 flex flex-col sm:flex-row gap-2 w-full sm:max-w-sm">
                                                                {order.paymentReference ? (
                                                                    <div className="bg-green-50 text-green-700 text-xs px-3 py-2 rounded-lg border border-green-200">
                                                                        {locale === 'fr' ? 'Référence soumise :' : 'Reference submitted:'} <strong>{order.paymentReference}</strong>
                                                                    </div>
                                                                ) : (
                                                                    <>
                                                                        <input
                                                                            type="text"
                                                                            placeholder={locale === 'fr' ? 'Référence de virement' : 'Bank transfer ref'}
                                                                            value={refInputs[order.id] || ''}
                                                                            onChange={(e) => setRefInputs(prev => ({ ...prev, [order.id]: e.target.value }))}
                                                                            className="flex-1 px-3 py-2 text-sm border border-cream-dark/30 rounded-lg outline-none focus:border-gold/60"
                                                                        />
                                                                        <button
                                                                            onClick={() => submitPaymentReference(order.id)}
                                                                            disabled={submittingRef === order.id || !refInputs[order.id]?.trim()}
                                                                            className="px-4 py-2 bg-[#0F2E22] text-white text-xs font-medium rounded-lg disabled:opacity-50 whitespace-nowrap"
                                                                        >
                                                                            {submittingRef === order.id ? '...' : (locale === 'fr' ? 'Soumettre' : 'Submit')}
                                                                        </button>
                                                                    </>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex flex-col items-center sm:items-end gap-2 shrink-0">
                                                        <span className={`px-4 py-1.5 rounded-full text-[0.65rem] font-medium tracking-widest uppercase ${order.status === 'delivered' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-[#FEFAE0] text-[#0F2E22] border border-[#C9A84C]'}`}>
                                                            {order.status}
                                                        </span>
                                                        <p className="font-medium text-xl tracking-wide text-forest-dark">{formatPrice((order as any).total || (order as any).totalAmount || 0)}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === 'wishlist' && (
                                <div>
                                    <h2 className="font-serif font-normal text-3xl text-forest-dark mb-10 tracking-wide">{t('wishlist')}</h2>
                                    <div className="py-12 border-2 border-dashed border-cream-dark/30 rounded-2xl flex flex-col items-center">
                                        <Heart className="w-12 h-12 text-cream-dark mb-4" />
                                        <p className="text-charcoal-light font-light text-lg">{locale === 'fr' ? 'Votre liste de favoris est vide.' : 'Your wishlist is empty.'}</p>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'settings' && (
                                <div>
                                    <h2 className="font-serif font-normal text-3xl text-forest-dark mb-10 tracking-wide">{t('settings')}</h2>
                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-[0.8rem] font-medium tracking-wide uppercase text-charcoal-light mb-2">{t('changePassword')}</label>
                                            <input type="password" placeholder="••••••••" className="w-full px-5 py-4 bg-[#FEFAE0]/30 border border-cream-dark/30 rounded-xl text-[0.9375rem] focus:outline-none focus:ring-1 focus:ring-gold/50 mb-4" />
                                            <input type="password" placeholder={locale === 'fr' ? 'Nouveau mot de passe' : 'New password'} className="w-full px-5 py-4 bg-[#FEFAE0]/30 border border-cream-dark/30 rounded-xl text-[0.9375rem] focus:outline-none focus:ring-1 focus:ring-gold/50" />
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
