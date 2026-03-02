'use client';
import React, { useEffect, useState, useCallback } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

// ─── SVG Icons ───────────────────────────────────────────────────────────────
const IconCheck = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
);
const IconTruck = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></svg>
);
const IconPackage = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="21 8 21 21 3 21 3 8" /><rect x="1" y="3" width="22" height="5" /><line x1="10" y1="12" x2="14" y2="12" /></svg>
);
const IconX = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
);
const IconChevron = ({ open }: { open: boolean }) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}><polyline points="6 9 12 15 18 9" /></svg>
);

// ─── Status config ─────────────────────────────────────────────────────────
const STATUS_CFG: Record<string, { label: string; color: string; bg: string; dot: string }> = {
    pending_payment: { label: 'Pending Payment', color: '#92400e', bg: '#fef3c7', dot: '#f59e0b' },
    processing: { label: 'Payment Confirmed', color: '#1e3a5f', bg: '#dbeafe', dot: '#3b82f6' },
    shipped: { label: 'Shipped', color: '#4c1d95', bg: '#ede9fe', dot: '#8b5cf6' },
    delivered: { label: 'Delivered', color: '#064e3b', bg: '#d1fae5', dot: '#10b981' },
    cancelled: { label: 'Cancelled', color: '#7f1d1d', bg: '#fee2e2', dot: '#ef4444' },
};

function StatusBadge({ status }: { status: string }) {
    const cfg = STATUS_CFG[status] || { label: status, color: '#374151', bg: '#f3f4f6', dot: '#9ca3af' };
    return (
        <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: cfg.bg, color: cfg.color,
            borderRadius: 20, padding: '4px 10px', fontSize: 11.5, fontWeight: 600,
            letterSpacing: '0.02em', whiteSpace: 'nowrap',
        }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: cfg.dot, flexShrink: 0 }} />
            {cfg.label}
        </span>
    );
}

function Btn({ onClick, disabled, variant = 'primary', children, fullWidth }: {
    onClick: () => void; disabled?: boolean; variant?: 'primary' | 'success' | 'purple' | 'danger' | 'ghost';
    children: React.ReactNode; fullWidth?: boolean;
}) {
    const colors = {
        primary: { bg: '#0F2E22', hover: '#1a4a35', text: '#fff' },
        success: { bg: '#059669', hover: '#047857', text: '#fff' },
        purple: { bg: '#7c3aed', hover: '#6d28d9', text: '#fff' },
        danger: { bg: '#dc2626', hover: '#b91c1c', text: '#fff' },
        ghost: { bg: 'transparent', hover: '#f3f4f6', text: '#374151' },
    }[variant];
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '8px 16px', background: disabled ? '#e5e7eb' : colors.bg,
                color: disabled ? '#9ca3af' : colors.text,
                border: variant === 'ghost' ? '1px solid #e5e7eb' : 'none',
                borderRadius: 8, fontSize: 13, fontWeight: 600,
                cursor: disabled ? 'not-allowed' : 'pointer',
                width: fullWidth ? '100%' : 'auto',
                justifyContent: fullWidth ? 'center' : 'flex-start',
                transition: 'background 0.15s',
            }}
        >
            {children}
        </button>
    );
}

export default function OrdersTab({ token }: { token: string }) {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');
    const [expanded, setExpanded] = useState<string | null>(null);
    // Per-order action state to avoid shared state bug
    const [actionState, setActionState] = useState<Record<string, { tracking: string; note: string; loading: boolean }>>({});

    const getAction = (id: string) => actionState[id] || { tracking: '', note: '', loading: false };
    const setAction = (id: string, patch: Partial<{ tracking: string; note: string; loading: boolean }>) =>
        setActionState(prev => ({ ...prev, [id]: { ...getAction(id), ...patch } }));

    const fetchOrders = useCallback(() => {
        setLoading(true);
        const url = `${API}/admin/orders${filter ? `?status=${filter}` : ''}`;
        fetch(url, { headers: { Authorization: `Bearer ${token}` } })
            .then(r => r.json())
            .then(d => setOrders(d.data || []))
            .catch(() => { })
            .finally(() => setLoading(false));
    }, [token, filter]);

    useEffect(() => { fetchOrders(); }, [fetchOrders]);

    async function updateStatus(orderId: string, status: string, extra?: Record<string, string>) {
        setAction(orderId, { loading: true });
        try {
            const res = await fetch(`${API}/admin/orders/${orderId}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ status, ...(extra || {}) }),
            });
            const data = await res.json();
            if (res.ok) {
                fetchOrders();
                setExpanded(null);
            } else {
                alert(data.message || 'Failed to update order status.');
            }
        } catch {
            alert('Network error. Check that the backend is running.');
        } finally {
            setAction(orderId, { loading: false });
        }
    }

    const filtered = filter ? orders.filter(o => o.status === filter) : orders;

    return (
        <div style={{ padding: '32px 36px' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
                <div>
                    <h1 style={{ fontSize: 22, fontWeight: 700, color: '#0f172a', margin: 0 }}>Orders</h1>
                    <p style={{ color: '#64748b', fontSize: 13, margin: '4px 0 0' }}>{orders.length} total orders</p>
                </div>
                <select
                    value={filter}
                    onChange={e => setFilter(e.target.value)}
                    style={{
                        padding: '8px 14px', border: '1px solid #e2e8f0', borderRadius: 8,
                        fontSize: 13, background: '#fff', color: '#374151',
                        outline: 'none', cursor: 'pointer', fontWeight: 500,
                    }}
                >
                    <option value="">All Statuses</option>
                    <option value="pending_payment">Pending Payment</option>
                    <option value="processing">Confirmed</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                </select>
            </div>

            {loading ? (
                <div style={{ color: '#94a3b8', padding: '40px 0', textAlign: 'center', fontSize: 14 }}>Loading orders…</div>
            ) : filtered.length === 0 ? (
                <div style={{ color: '#94a3b8', padding: '60px 0', textAlign: 'center', fontSize: 14 }}>No orders found</div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {filtered.map(order => {
                        const ref = order.id.slice(0, 8).toUpperCase();
                        const isOpen = expanded === order.id;
                        const act = getAction(order.id);

                        return (
                            <div key={order.id} style={{
                                background: '#fff', borderRadius: 12, overflow: 'hidden',
                                border: isOpen ? '1.5px solid #C9A84C' : '1px solid #e2e8f0',
                                boxShadow: isOpen ? '0 4px 16px rgba(201,168,76,0.12)' : '0 1px 3px rgba(0,0,0,0.04)',
                                transition: 'box-shadow 0.2s, border 0.15s',
                            }}>
                                {/* Row header */}
                                <div
                                    onClick={() => setExpanded(isOpen ? null : order.id)}
                                    style={{
                                        display: 'grid',
                                        gridTemplateColumns: '1fr auto auto auto',
                                        alignItems: 'center', gap: 20,
                                        padding: '16px 20px', cursor: 'pointer',
                                    }}
                                >
                                    <div>
                                        <div style={{ fontWeight: 600, fontSize: 14, color: '#0f172a', marginBottom: 2 }}>
                                            Order #{ref}
                                            {(order.guestName || order.user?.name) && (
                                                <span style={{ color: '#94a3b8', fontWeight: 400 }}>
                                                    {' '}— {order.guestName || order.user?.name}
                                                </span>
                                            )}
                                        </div>
                                        <div style={{ fontSize: 12, color: '#94a3b8' }}>
                                            {new Date(order.createdAt).toLocaleDateString('en-GB', {
                                                day: '2-digit', month: 'short', year: 'numeric',
                                                hour: '2-digit', minute: '2-digit',
                                            })}
                                        </div>
                                    </div>
                                    <div style={{ fontWeight: 700, fontSize: 15, color: '#0F2E22', letterSpacing: '0.01em' }}>
                                        €{order.total.toFixed(2)}
                                    </div>
                                    <StatusBadge status={order.status} />
                                    <span style={{ color: '#94a3b8' }}><IconChevron open={isOpen} /></span>
                                </div>

                                {/* Expanded panel */}
                                {isOpen && (
                                    <div style={{ borderTop: '1px solid #f1f5f9', background: '#f8fafc' }}>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
                                            {/* Items */}
                                            <div style={{ padding: '20px 24px', borderRight: '1px solid #f1f5f9' }}>
                                                <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Items</div>
                                                {order.items.map((item: any, i: number) => {
                                                    const snap = item.productSnapshot;
                                                    const name = typeof snap?.name === 'object' ? (snap.name.fr || snap.name.en) : snap?.name;
                                                    return (
                                                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, padding: '6px 0', borderBottom: '1px solid #f1f5f9' }}>
                                                            <span style={{ color: '#374151' }}>{name || '—'} <span style={{ color: '#94a3b8' }}>× {item.quantity}</span></span>
                                                            <span style={{ fontWeight: 600, color: '#0f172a' }}>€{(item.unitPrice * item.quantity).toFixed(2)}</span>
                                                        </div>
                                                    );
                                                })}
                                                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, marginTop: 10, fontSize: 14, color: '#0f172a' }}>
                                                    <span>Total</span>
                                                    <span>€{order.total.toFixed(2)}</span>
                                                </div>
                                            </div>

                                            {/* Customer + shipping */}
                                            <div style={{ padding: '20px 24px' }}>
                                                <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Customer & Shipping</div>
                                                <div style={{ fontSize: 13, lineHeight: 1.8, color: '#374151' }}>
                                                    <div style={{ fontWeight: 600, color: '#0f172a' }}>{order.user?.name || order.guestName || '—'}</div>
                                                    <div style={{ color: '#64748b' }}>{order.user?.email || order.guestEmail || '—'}</div>
                                                    {order.shippingAddress && (
                                                        <div style={{ marginTop: 8, color: '#475569', borderTop: '1px solid #f1f5f9', paddingTop: 8 }}>
                                                            {order.shippingAddress.address}<br />
                                                            {order.shippingAddress.city}, {order.shippingAddress.zipCode}, {order.shippingAddress.country}
                                                        </div>
                                                    )}
                                                    {order.trackingNumber && (
                                                        <div style={{ marginTop: 8, fontSize: 12, background: '#ede9fe', color: '#5b21b6', padding: '4px 8px', borderRadius: 6, display: 'inline-block' }}>
                                                            Tracking: {order.trackingNumber}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Actions bar */}
                                        {!['delivered', 'cancelled'].includes(order.status) && (
                                            <div style={{
                                                padding: '16px 24px',
                                                borderTop: '1px solid #f1f5f9',
                                                display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center',
                                                background: '#fff',
                                            }}>
                                                {order.status === 'pending_payment' && (
                                                    <Btn
                                                        variant="success"
                                                        disabled={act.loading}
                                                        onClick={() => updateStatus(order.id, 'processing')}
                                                    >
                                                        <IconCheck /> Confirm Payment
                                                    </Btn>
                                                )}

                                                {(order.status === 'processing' || order.status === 'pending_payment') && (
                                                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                                        <input
                                                            placeholder="Tracking number (optional)"
                                                            value={act.tracking}
                                                            onChange={e => setAction(order.id, { tracking: e.target.value })}
                                                            style={{
                                                                padding: '8px 12px', border: '1px solid #e2e8f0',
                                                                borderRadius: 8, fontSize: 13, width: 180, outline: 'none',
                                                            }}
                                                        />
                                                        <Btn
                                                            variant="purple"
                                                            disabled={act.loading}
                                                            onClick={() => updateStatus(order.id, 'shipped', act.tracking ? { trackingNumber: act.tracking } : {})}
                                                        >
                                                            <IconTruck /> Mark Shipped
                                                        </Btn>
                                                    </div>
                                                )}

                                                {order.status === 'shipped' && (
                                                    <Btn
                                                        variant="primary"
                                                        disabled={act.loading}
                                                        onClick={() => updateStatus(order.id, 'delivered')}
                                                    >
                                                        <IconPackage /> Mark Delivered
                                                    </Btn>
                                                )}

                                                <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginLeft: 'auto' }}>
                                                    <input
                                                        placeholder="Cancellation reason"
                                                        value={act.note}
                                                        onChange={e => setAction(order.id, { note: e.target.value })}
                                                        style={{
                                                            padding: '8px 12px', border: '1px solid #fca5a5',
                                                            borderRadius: 8, fontSize: 13, width: 200, outline: 'none',
                                                            background: '#fff8f8',
                                                        }}
                                                    />
                                                    <Btn
                                                        variant="danger"
                                                        disabled={act.loading}
                                                        onClick={() => {
                                                            if (confirm('Are you sure you want to cancel this order?')) {
                                                                updateStatus(order.id, 'cancelled', act.note ? { adminNote: act.note } : {});
                                                            }
                                                        }}
                                                    >
                                                        <IconX /> Cancel Order
                                                    </Btn>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
