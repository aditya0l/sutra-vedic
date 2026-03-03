'use client';
import React from 'react';

const IconMenu = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
);

export default function AdminShell({ token, onLogout }: { token: string; onLogout: () => void }) {
    const [tab, setTab] = React.useState<'dashboard' | 'orders' | 'products' | 'bank-info'>('dashboard');
    const [DashboardTab] = React.useState(() => React.lazy(() => import('./DashboardTab')));
    const [OrdersTab] = React.useState(() => React.lazy(() => import('./OrdersTab')));
    const [ProductsTab] = React.useState(() => React.lazy(() => import('./ProductsTab')));
    const [BankInfoTab] = React.useState(() => React.lazy(() => import('./BankInfoTab')));

    const NAV = [
        {
            id: 'dashboard', label: 'Dashboard',
            icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>
        },
        {
            id: 'orders', label: 'Orders',
            icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" /><rect x="9" y="3" width="6" height="4" rx="1" /><line x1="9" y1="12" x2="15" y2="12" /><line x1="9" y1="16" x2="13" y2="16" /></svg>
        },
        {
            id: 'products', label: 'Products',
            icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></svg>
        },
        {
            id: 'bank-info', label: 'Bank Info',
            icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><line x1="1" y1="6" x2="23" y2="6" /><line x1="1" y1="12" x2="23" y2="12" /><path d="M1 6l3-3h16l3 3" /><rect x="1" y="12" width="22" height="8" /><line x1="6" y1="18" x2="8" y2="18" /><line x1="11" y1="18" x2="13" y2="18" /></svg>
        },
    ] as const;

    return (
        <div style={{ display: 'flex', minHeight: '100vh', fontFamily: "'Inter', -apple-system, system-ui, sans-serif" }}>
            {/* Sidebar */}
            <aside style={{
                width: 230, background: '#0F2E22', display: 'flex',
                flexDirection: 'column', flexShrink: 0, userSelect: 'none',
            }}>
                {/* Logo */}
                <div style={{ padding: '28px 24px 24px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                            width: 34, height: 34, background: '#C9A84C', borderRadius: 8,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 15, fontWeight: 800, color: '#0F2E22', letterSpacing: '-0.02em',
                        }}>SV</div>
                        <div>
                            <div style={{ color: '#fff', fontWeight: 700, fontSize: 14, letterSpacing: '0.01em' }}>Sutra Vedic</div>
                            <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.12em' }}>Admin Console</div>
                        </div>
                    </div>
                </div>

                {/* Nav */}
                <nav style={{ flex: 1, padding: '12px 0' }}>
                    <div style={{ padding: '8px 16px 6px', fontSize: 10, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 600 }}>Navigation</div>
                    {NAV.map(n => {
                        const active = tab === n.id;
                        return (
                            <button
                                key={n.id}
                                onClick={() => setTab(n.id)}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: 10,
                                    margin: '2px 0',
                                    background: active ? 'rgba(201,168,76,0.15)' : 'transparent',
                                    border: 'none', cursor: 'pointer', textAlign: 'left',
                                    color: active ? '#C9A84C' : 'rgba(255,255,255,0.5)',
                                    fontSize: 13.5, fontWeight: active ? 600 : 400,
                                    borderLeft: active ? '2px solid #C9A84C' : '2px solid transparent',
                                    borderRadius: '0 6px 6px 0',
                                    transition: 'all 0.15s',
                                    marginLeft: 8, width: 'calc(100% - 8px)',
                                }}
                            >
                                <span style={{ opacity: active ? 1 : 0.6 }}>{n.icon}</span>
                                <span>{n.label}</span>
                            </button>
                        );
                    })}
                </nav>

                {/* Logout */}
                <div style={{ padding: '12px 16px 20px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                    <button
                        onClick={onLogout}
                        style={{
                            display: 'flex', alignItems: 'center', gap: 8,
                            width: '100%', padding: '10px 14px',
                            background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)',
                            borderRadius: 8, color: 'rgba(248,113,113,0.9)', fontSize: 13,
                            cursor: 'pointer', fontWeight: 500, textAlign: 'left',
                        }}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main */}
            <main style={{ flex: 1, background: '#f8fafc', overflowY: 'auto', minWidth: 0 }}>
                <React.Suspense fallback={<div style={{ padding: 40, color: '#94a3b8', fontSize: 14 }}>Loading…</div>}>
                    {tab === 'dashboard' && <DashboardTab token={token} />}
                    {tab === 'orders' && <OrdersTab token={token} />}
                    {tab === 'products' && <ProductsTab token={token} />}
                    {tab === 'bank-info' && <BankInfoTab token={token} />}
                </React.Suspense>
            </main>
        </div>
    );
}
