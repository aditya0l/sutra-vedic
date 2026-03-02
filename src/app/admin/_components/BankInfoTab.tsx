'use client';
import React, { useEffect, useState } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export default function BankInfoTab({ token }: { token: string }) {
    const [form, setForm] = useState({ accountHolder: '', bankName: '', iban: '', bic: '', instructions: '' });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null);

    useEffect(() => {
        fetch(`${API}/admin/bank-info`, { headers: { Authorization: `Bearer ${token}` } })
            .then(r => r.json())
            .then(d => { if (d.data) setForm({ accountHolder: d.data.accountHolder || '', bankName: d.data.bankName || '', iban: d.data.iban || '', bic: d.data.bic || '', instructions: d.data.instructions || '' }); })
            .catch(() => { })
            .finally(() => setLoading(false));
    }, [token]);

    async function handleSave(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true); setMsg(null);
        try {
            const res = await fetch(`${API}/admin/bank-info`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify(form),
            });
            setMsg(res.ok ? { text: 'Bank details saved successfully', ok: true } : { text: 'Failed to save. Please try again.', ok: false });
        } catch {
            setMsg({ text: 'Network error. Check the backend is running.', ok: false });
        } finally {
            setSaving(false);
        }
    }

    const Field = ({ label, name, type = 'text', placeholder, mono }: { label: string; name: keyof typeof form; type?: string; placeholder: string; mono?: boolean }) => (
        <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>{label}</label>
            <input
                type={type}
                value={form[name]}
                onChange={e => setForm(f => ({ ...f, [name]: e.target.value }))}
                placeholder={placeholder}
                required={name !== 'instructions'}
                style={{
                    width: '100%', padding: '10px 14px',
                    border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 13,
                    boxSizing: 'border-box', outline: 'none', background: '#fff',
                    fontFamily: mono ? "'Courier New', monospace" : 'inherit',
                    letterSpacing: mono ? '0.05em' : 'normal',
                }}
            />
        </div>
    );

    return (
        <div style={{ padding: '36px', maxWidth: 720 }}>
            <div style={{ marginBottom: 32 }}>
                <h1 style={{ fontSize: 22, fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>Bank Transfer Details</h1>
                <p style={{ color: '#64748b', fontSize: 13, margin: 0 }}>
                    These details are displayed to customers at checkout and included in order confirmation emails.
                </p>
            </div>

            {loading ? <div style={{ color: '#94a3b8', fontSize: 14 }}>Loading…</div> : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                    {/* Form */}
                    <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', padding: '24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <div style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>Account Information</div>
                            <Field label="Account Holder Name" name="accountHolder" placeholder="Sutra Vedic SAS" />
                            <Field label="Bank Name" name="bankName" placeholder="BNP Paribas" />
                            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: 16 }}>
                                <div style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Transfer Codes</div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                    <Field label="IBAN" name="iban" placeholder="FR76 XXXX XXXX XXXX XXXX XXXX XXX" mono />
                                    <Field label="BIC / SWIFT Code" name="bic" placeholder="BNPAFRPP" mono />
                                </div>
                            </div>
                            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: 16 }}>
                                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                                    Transfer Instructions <span style={{ fontWeight: 400, color: '#94a3b8' }}>(optional)</span>
                                </label>
                                <textarea
                                    rows={3}
                                    value={form.instructions}
                                    onChange={e => setForm(f => ({ ...f, instructions: e.target.value }))}
                                    placeholder="Please include your order reference number in the transfer description."
                                    style={{ width: '100%', padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 13, boxSizing: 'border-box', resize: 'vertical', outline: 'none' }}
                                />
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: 16, paddingTop: 4 }}>
                                <button
                                    type="submit" disabled={saving}
                                    style={{
                                        padding: '11px 28px', background: saving ? '#94a3b8' : '#0F2E22',
                                        color: '#fff', border: 'none', borderRadius: 8, fontSize: 13,
                                        fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer',
                                        letterSpacing: '0.02em',
                                    }}
                                >
                                    {saving ? 'Saving…' : 'Save Changes'}
                                </button>
                                {msg && (
                                    <span style={{ fontSize: 13, color: msg.ok ? '#059669' : '#dc2626', fontWeight: 500 }}>
                                        {msg.ok ? '✓ ' : '✗ '}{msg.text}
                                    </span>
                                )}
                            </div>
                        </div>
                    </form>

                    {/* Live preview */}
                    <div>
                        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', padding: '24px', position: 'sticky', top: 24 }}>
                            <div style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>Customer Preview</div>
                            <div style={{ background: '#fefae0', border: '1px solid #e8d8a0', borderRadius: 10, padding: '18px' }}>
                                <div style={{ fontSize: 12, fontWeight: 700, color: '#78716c', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                                    Bank Transfer Details
                                </div>
                                {[
                                    { label: 'Account Holder', value: form.accountHolder || '—' },
                                    { label: 'Bank', value: form.bankName || '—' },
                                    { label: 'IBAN', value: form.iban || '—', mono: true },
                                    { label: 'BIC / SWIFT', value: form.bic || '—', mono: true },
                                    { label: 'Amount', value: '€XX.XX', highlight: true },
                                    { label: 'Reference', value: 'SUTRAVEDIC-XXXXXXXX', mono: true },
                                ].map(row => (
                                    <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid rgba(216,196,153,0.3)', fontSize: 12 }}>
                                        <span style={{ color: '#78716c', width: 110, flexShrink: 0 }}>{row.label}</span>
                                        <span style={{
                                            fontWeight: 600, textAlign: 'right',
                                            fontFamily: (row as any).mono ? 'monospace' : 'inherit',
                                            color: (row as any).highlight ? '#C9A84C' : '#44403c',
                                            fontSize: (row as any).highlight ? 13 : 12,
                                        }}>{row.value}</span>
                                    </div>
                                ))}
                                {form.instructions && (
                                    <p style={{ fontSize: 11, color: '#78716c', fontStyle: 'italic', marginTop: 10, marginBottom: 0 }}>{form.instructions}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
