'use client';
import React, { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

const COLORS = { forest: '#0F2E22', gold: '#C9A84C' };

function StatCard({ label, value, icon, accent }: { label: string; value: string | number; icon: React.ReactNode; accent: string }) {
    return (
        <div style={{
            background: '#fff', borderRadius: 12, padding: '24px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9',
            borderTop: `3px solid ${accent}`,
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <div style={{ fontSize: 12, color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>{label}</div>
                    <div style={{ fontSize: 30, fontWeight: 700, color: '#0f172a', letterSpacing: '-0.01em' }}>{value}</div>
                </div>
                <div style={{ color: accent, opacity: 0.7 }}>{icon}</div>
            </div>
        </div>
    );
}

const IconOrders = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" /><rect x="9" y="3" width="6" height="4" rx="1" /><line x1="9" y1="12" x2="15" y2="12" /><line x1="9" y1="16" x2="13" y2="16" /></svg>
);
const IconClock = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
);
const IconBox = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></svg>
);
const IconRevenue = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" /></svg>
);

export default function DashboardTab({ token }: { token: string }) {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStats() {
            try {
                const [ordersSnap, productsSnap] = await Promise.all([
                    getDocs(collection(db, 'orders')),
                    getDocs(collection(db, 'products'))
                ]);

                let totalOrders = 0;
                let pendingOrders = 0;
                let confirmedRevenue = 0;

                ordersSnap.forEach(doc => {
                    const data = doc.data();
                    totalOrders++;
                    if (data.status === 'pending_payment') {
                        pendingOrders++;
                    } else if (data.status !== 'cancelled') {
                        confirmedRevenue += (data.totalAmount || 0);
                    }
                });

                setStats({
                    totalOrders,
                    pendingOrders,
                    confirmedRevenue,
                    totalProducts: productsSnap.size
                });
            } catch (err) {
                console.error("Failed to load stats", err);
            } finally {
                setLoading(false);
            }
        }
        fetchStats();
    }, [token]);

    return (
        <div style={{ padding: '36px' }}>
            <div style={{ marginBottom: 32 }}>
                <h1 style={{ fontSize: 22, fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>Dashboard</h1>
                <p style={{ color: '#64748b', fontSize: 14, margin: 0 }}>Overview of your store performance</p>
            </div>

            {loading ? (
                <div style={{ color: '#94a3b8', fontSize: 14 }}>Loading…</div>
            ) : stats ? (
                <>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
                        <StatCard label="Total Orders" value={stats.totalOrders} icon={<IconOrders />} accent={COLORS.forest} />
                        <StatCard label="Pending Payment" value={stats.pendingOrders} icon={<IconClock />} accent="#f59e0b" />
                        <StatCard label="Active Products" value={stats.totalProducts} icon={<IconBox />} accent="#3b82f6" />
                        <StatCard label="Revenue" value={`€${stats.confirmedRevenue.toFixed(2)}`} icon={<IconRevenue />} accent={COLORS.gold} />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                        <div style={{ background: '#fff', borderRadius: 12, padding: '24px', border: '1px solid #f1f5f9' }}>
                            <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', marginBottom: 12 }}>Pending Actions</div>
                            {stats.pendingOrders > 0 ? (
                                <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 8, padding: '12px 16px' }}>
                                    <div style={{ fontSize: 13, fontWeight: 600, color: '#92400e' }}>{stats.pendingOrders} order{stats.pendingOrders > 1 ? 's' : ''} awaiting bank transfer verification</div>
                                    <div style={{ fontSize: 12, color: '#b45309', marginTop: 4 }}>Go to Orders and click an order to confirm payment once you receive the transfer.</div>
                                </div>
                            ) : (
                                <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, padding: '12px 16px' }}>
                                    <div style={{ fontSize: 13, fontWeight: 600, color: '#166534' }}>All orders are up to date</div>
                                </div>
                            )}
                        </div>
                        <div style={{ background: '#fff', borderRadius: 12, padding: '24px', border: '1px solid #f1f5f9' }}>
                            <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', marginBottom: 12 }}>Bank Transfer Reminder</div>
                            <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 8, padding: '12px 16px' }}>
                                <div style={{ fontSize: 13, fontWeight: 600, color: '#1e40af' }}>Keep your bank details up to date</div>
                                <div style={{ fontSize: 12, color: '#3b82f6', marginTop: 4 }}>Update your IBAN and BIC in the Bank Info tab so customers see correct transfer details at checkout.</div>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <div style={{ color: '#ef4444', fontSize: 14 }}>Could not load stats from Firebase.</div>
            )}
        </div>
    );
}
