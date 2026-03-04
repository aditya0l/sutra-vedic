'use client';
import React, { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface StoreSettings {
    taxRate: number;         // e.g. 20 means 20%
    shippingFee: number;     // e.g. 5.99 (€) - 0 = free always
    freeShippingThreshold: number; // e.g. 100 - order above this gets free shipping
}

const DEFAULT: StoreSettings = { taxRate: 20, shippingFee: 0, freeShippingThreshold: 100 };

function NumberField({ label, value, onChange, suffix, min = 0, step = 1, helpText }: {
    label: string; value: number; onChange: (v: number) => void;
    suffix?: string; min?: number; step?: number; helpText?: string;
}) {
    return (
        <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>{label}</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 0, border: '1px solid #e2e8f0', borderRadius: 8, overflow: 'hidden', background: '#fff' }}>
                <input
                    type="number" min={min} step={step} value={value}
                    onChange={e => onChange(parseFloat(e.target.value) || 0)}
                    style={{ flex: 1, padding: '10px 14px', border: 'none', fontSize: 14, outline: 'none' }}
                />
                {suffix && <span style={{ padding: '0 14px', background: '#f8fafc', borderLeft: '1px solid #e2e8f0', fontSize: 13, color: '#64748b', height: '100%', display: 'flex', alignItems: 'center' }}>{suffix}</span>}
            </div>
            {helpText && <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>{helpText}</p>}
        </div>
    );
}

export default function StoreSettingsTab({ token }: { token: string }) {
    const [settings, setSettings] = useState<StoreSettings>(DEFAULT);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null);

    useEffect(() => {
        getDoc(doc(db, 'settings', 'storeSettings'))
            .then(snap => {
                if (snap.exists()) {
                    setSettings({ ...DEFAULT, ...snap.data() } as StoreSettings);
                }
            })
            .catch(() => { })
            .finally(() => setLoading(false));
    }, [token]);

    const set = (key: keyof StoreSettings, val: number) =>
        setSettings(s => ({ ...s, [key]: val }));

    async function handleSave(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true); setMsg(null);
        try {
            await setDoc(doc(db, 'settings', 'storeSettings'), {
                ...settings,
                updatedAt: new Date().toISOString()
            }, { merge: true });
            setMsg({ text: 'Store settings saved successfully', ok: true });
        } catch (err) {
            console.error(err);
            setMsg({ text: 'Failed to save settings.', ok: false });
        } finally {
            setSaving(false);
        }
    }

    return (
        <div style={{ padding: 36, maxWidth: 600 }}>
            <div style={{ marginBottom: 32 }}>
                <h1 style={{ fontSize: 22, fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>Store Settings</h1>
                <p style={{ color: '#64748b', fontSize: 13, margin: 0 }}>
                    Configure tax, shipping fees, and discount rules applied at checkout.
                </p>
            </div>

            {loading ? <div style={{ color: '#94a3b8' }}>Loading…</div> : (
                <form onSubmit={handleSave}>
                    <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>

                        {/* Tax */}
                        <div style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Tax / TVA</div>
                        <NumberField
                            label="Tax Rate"
                            value={settings.taxRate}
                            onChange={v => set('taxRate', v)}
                            suffix="%"
                            step={0.5}
                            helpText="Applied to order subtotal at checkout (e.g. 20 for 20% TVA)"
                        />

                        {/* Shipping */}
                        <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: 16, fontSize: 12, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Shipping</div>
                        <NumberField
                            label="Shipping Fee"
                            value={settings.shippingFee}
                            onChange={v => set('shippingFee', v)}
                            suffix="€"
                            step={0.5}
                            helpText="Set to 0 for always-free shipping"
                        />
                        <NumberField
                            label="Free Shipping Threshold"
                            value={settings.freeShippingThreshold}
                            onChange={v => set('freeShippingThreshold', v)}
                            suffix="€"
                            step={5}
                            helpText="Orders above this amount get free shipping (set 0 to disable threshold)"
                        />

                        {/* Preview */}
                        <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: 16, background: '#f8fafc', borderRadius: 8, padding: 16 }}>
                            <div style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Preview (100€ order)</div>
                            {[
                                { label: 'Subtotal', value: '100.00 €' },
                                { label: `Tax (${settings.taxRate}%)`, value: `${(100 * settings.taxRate / 100).toFixed(2)} €` },
                                { label: 'Shipping', value: 100 >= settings.freeShippingThreshold && settings.freeShippingThreshold > 0 ? 'FREE' : `${settings.shippingFee.toFixed(2)} €` },
                                { label: 'Total', value: `${(100 + 100 * settings.taxRate / 100 + (100 >= settings.freeShippingThreshold && settings.freeShippingThreshold > 0 ? 0 : settings.shippingFee)).toFixed(2)} €`, bold: true },
                            ].map(row => (
                                <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', fontSize: 13, fontWeight: (row as any).bold ? 700 : 400 }}>
                                    <span style={{ color: '#64748b' }}>{row.label}</span>
                                    <span style={{ color: '#0f172a' }}>{row.value}</span>
                                </div>
                            ))}
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                            <button
                                type="submit" disabled={saving}
                                style={{ padding: '11px 28px', background: saving ? '#94a3b8' : '#0F2E22', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer' }}
                            >
                                {saving ? 'Saving…' : 'Save Settings'}
                            </button>
                            {msg && <span style={{ fontSize: 13, color: msg.ok ? '#059669' : '#dc2626', fontWeight: 500 }}>{msg.ok ? '✓ ' : '✗ '}{msg.text}</span>}
                        </div>
                    </div>
                </form>
            )}
        </div>
    );
}
