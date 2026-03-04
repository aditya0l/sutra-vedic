'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { db, storage } from '@/lib/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

const IconPlus = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
);
const IconEdit = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
);
const IconSlash = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="4.93" y1="4.93" x2="19.07" y2="19.07" /></svg>
);

const inp = (extra?: React.CSSProperties): React.CSSProperties => ({
    width: '100%', padding: '9px 12px',
    border: '1px solid #e2e8f0', borderRadius: 8,
    fontSize: 13, boxSizing: 'border-box', outline: 'none', background: '#fff',
    ...extra,
});

export default function ProductsTab({ token }: { token: string }) {
    const [products, setProducts] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState<any>(null);
    const [form, setForm] = useState({
        nameFr: '', nameEn: '', shortFr: '', shortEn: '',
        price: '', compareAtPrice: '', discountPct: '', sku: '', categoryId: '', imageUrl: '',
        stock: '', isNew: false, isBestseller: false, isActive: true,
    });
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null);

    const fetchAll = useCallback(async () => {
        setLoading(true);
        try {
            const [pSnap, cSnap] = await Promise.all([
                getDocs(collection(db, 'products')),
                getDocs(collection(db, 'categories'))
            ]);

            setProducts(pSnap.docs.map(d => ({ id: d.id, ...d.data() })));
            setCategories(cSnap.docs.map(d => ({ id: d.id, ...d.data() })));
        } catch (err) {
            console.error("Error fetching admin data:", err);
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => { fetchAll(); }, [fetchAll]);

    function blankForm() {
        return { nameFr: '', nameEn: '', shortFr: '', shortEn: '', price: '', compareAtPrice: '', discountPct: '', sku: '', categoryId: categories[0]?.id || '', imageUrl: '', stock: '', isNew: false, isBestseller: false, isActive: true };
    }

    function openCreate() { setEditing(null); setForm(blankForm()); setMsg(null); setShowForm(true); }

    function openEdit(p: any) {
        setEditing(p);
        setForm({
            nameFr: p.name?.fr || '', nameEn: p.name?.en || '',
            shortFr: p.shortDescription?.fr || '', shortEn: p.shortDescription?.en || '',
            price: String(p.price), compareAtPrice: String(p.compareAtPrice || ''),
            discountPct: p.compareAtPrice && p.compareAtPrice > p.price
                ? String(Math.round((1 - p.price / p.compareAtPrice) * 100))
                : '',
            sku: p.sku, categoryId: p.categoryId || categories[0]?.id || '',
            imageUrl: p.images?.[0] || '',
            stock: String(p.stock ?? 0), isNew: p.isNew ?? false, isBestseller: p.isBestseller ?? false, isActive: p.isActive ?? true,
        });
        setMsg(null);
        setShowForm(true);
    }

    async function handleSave() {
        setSaving(true); setMsg(null);
        const payload = {
            name: { fr: form.nameFr, en: form.nameEn },
            shortDescription: { fr: form.shortFr, en: form.shortEn },
            description: editing?.description || { fr: form.shortFr, en: form.shortEn },
            price: parseFloat(form.price),
            compareAtPrice: form.compareAtPrice ? parseFloat(form.compareAtPrice) : null,
            categoryId: form.categoryId,
            stock: parseInt(form.stock || '0'),
            images: form.imageUrl ? [form.imageUrl] : [],
            isNew: form.isNew ?? false,
            isBestseller: form.isBestseller ?? false,
            isActive: form.isActive ?? true,
            ...(!editing ? { sku: form.sku, slug: form.nameEn.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || form.sku } : {}),
            updatedAt: new Date().toISOString(),
        };

        try {
            if (editing) {
                await updateDoc(doc(db, 'products', editing.id), payload);
            } else {
                await addDoc(collection(db, 'products'), { ...payload, createdAt: new Date().toISOString() });
            }

            setMsg({ text: 'Product saved', ok: true });
            fetchAll();
            setTimeout(() => { setShowForm(false); setMsg(null); }, 800);
        } catch (err: any) {
            setMsg({ text: err.message || 'Error saving product', ok: false });
        } finally {
            setSaving(false);
        }
    }

    async function handleDeactivate(id: string) {
        if (!confirm('Deactivate this product? It will no longer appear in the store.')) return;
        try {
            // Usually we'd just update 'isActive: false' but if you want true DELETE:
            await deleteDoc(doc(db, 'products', id));
            fetchAll();
        } catch (err: any) {
            alert(err.message || 'Failed to deactivate product.');
        }
    }

    async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '')}`;
            const storageRef = ref(storage, `products/${filename}`);

            // Upload to Firebase Cloud Storage
            const snapshot = await uploadBytes(storageRef, file);
            const downloadUrl = await getDownloadURL(snapshot.ref);

            setForm(f => ({ ...f, imageUrl: downloadUrl }));
        } catch (err) {
            console.error("Firebase Storage Upload Error:", err);
            alert('Image upload failed');
        }
    }

    const Label = ({ children }: { children: React.ReactNode }) => (
        <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#64748b', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{children}</label>
    );

    return (
        <div style={{ padding: '36px' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
                <div>
                    <h1 style={{ fontSize: 22, fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>Products</h1>
                    <p style={{ color: '#64748b', fontSize: 13, margin: 0 }}>{products.length} products in your catalogue</p>
                </div>
                <button
                    onClick={openCreate}
                    style={{
                        display: 'inline-flex', alignItems: 'center', gap: 7,
                        padding: '10px 20px', background: '#0F2E22', color: '#fff',
                        border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer',
                    }}
                >
                    <IconPlus /> Add Product
                </button>
            </div>

            {/* Edit / Create form */}
            {showForm && (
                <div style={{
                    background: '#fff', borderRadius: 12, padding: '28px',
                    marginBottom: 24, border: '1px solid #e2e8f0',
                    boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
                        <h2 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', margin: 0 }}>
                            {editing ? 'Edit Product' : 'New Product'}
                        </h2>
                        <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#94a3b8', lineHeight: 1 }}>×</button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                        <div>
                            <Label>Name (French)</Label>
                            <input style={inp()} value={form.nameFr} onChange={e => setForm(f => ({ ...f, nameFr: e.target.value }))} />
                        </div>
                        <div>
                            <Label>Name (English)</Label>
                            <input style={inp()} value={form.nameEn} onChange={e => setForm(f => ({ ...f, nameEn: e.target.value }))} />
                        </div>
                        <div>
                            <Label>Short Description (FR)</Label>
                            <input style={inp()} value={form.shortFr} onChange={e => setForm(f => ({ ...f, shortFr: e.target.value }))} />
                        </div>
                        <div>
                            <Label>Short Description (EN)</Label>
                            <input style={inp()} value={form.shortEn} onChange={e => setForm(f => ({ ...f, shortEn: e.target.value }))} />
                        </div>
                        <div>
                            <Label>Price (€)</Label>
                            <input style={inp()} type="number" step="0.01" value={form.price} onChange={e => {
                                const price = e.target.value;
                                setForm(f => {
                                    // recalculate compareAtPrice from discountPct if set
                                    const pct = parseFloat(f.discountPct);
                                    const compareAt = price && pct > 0
                                        ? String((parseFloat(price) / (1 - pct / 100)).toFixed(2))
                                        : f.compareAtPrice;
                                    return { ...f, price, compareAtPrice: compareAt };
                                });
                            }} />
                        </div>
                        <div>
                            <Label>Discount % (auto-calculates Compare At Price)</Label>
                            <input style={inp()} type="number" min="0" max="99" step="1" placeholder="e.g. 20" value={form.discountPct} onChange={e => {
                                const pct = e.target.value;
                                setForm(f => {
                                    const compareAt = f.price && parseFloat(pct) > 0
                                        ? String((parseFloat(f.price) / (1 - parseFloat(pct) / 100)).toFixed(2))
                                        : f.compareAtPrice;
                                    return { ...f, discountPct: pct, compareAtPrice: compareAt };
                                });
                            }} />
                        </div>
                        <div>
                            <Label>Compare At Price (€) — original price shown crossed out</Label>
                            <input style={inp()} type="number" step="0.01" placeholder="e.g. 250.00" value={form.compareAtPrice} onChange={e => {
                                const compareAt = e.target.value;
                                setForm(f => {
                                    const pct = f.price && parseFloat(compareAt) > parseFloat(f.price)
                                        ? String(Math.round((1 - parseFloat(f.price) / parseFloat(compareAt)) * 100))
                                        : f.discountPct;
                                    return { ...f, compareAtPrice: compareAt, discountPct: pct };
                                });
                            }} />
                        </div>
                        <div>
                            <Label>Stock Quantity</Label>
                            <input style={inp()} type="number" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))} />
                        </div>
                        {!editing && (
                            <div>
                                <Label>SKU</Label>
                                <input style={inp({ fontFamily: 'monospace' })} value={form.sku} onChange={e => setForm(f => ({ ...f, sku: e.target.value }))} placeholder="e.g. PROD-001" />
                            </div>
                        )}
                        <div>
                            <Label>Category</Label>
                            <select style={inp()} value={form.categoryId} onChange={e => setForm(f => ({ ...f, categoryId: e.target.value }))}>
                                {categories.map(c => (
                                    <option key={c.id} value={c.id}>{typeof c.name === 'object' ? (c.name.en || c.name.fr) : c.name}</option>
                                ))}
                            </select>
                        </div>
                        <div style={{ display: 'flex', gap: 20, alignItems: 'center', paddingTop: 8 }}>
                            {(['isNew', 'isBestseller', 'isActive'] as const).map(key => (
                                <label key={key} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, cursor: 'pointer', color: '#374151' }}>
                                    <input
                                        type="checkbox"
                                        checked={form[key]}
                                        onChange={e => setForm(f => ({ ...f, [key]: e.target.checked }))}
                                        style={{ width: 15, height: 15, accentColor: '#0F2E22' }}
                                    />
                                    {key === 'isNew' ? 'New' : key === 'isBestseller' ? 'Bestseller' : 'Active'}
                                </label>
                            ))}
                        </div>
                        <div style={{ gridColumn: '1 / -1', marginTop: '12px' }}>
                            <Label>Product Image</Label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                {form.imageUrl && (
                                    <img
                                        src={form.imageUrl.startsWith('http') ? form.imageUrl : `${API.replace('/api', '')}${form.imageUrl}`}
                                        alt="Preview"
                                        style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 8, border: '1px solid #e2e8f0' }}
                                    />
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    style={{ fontSize: 13, color: '#64748b' }}
                                />
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 22, paddingTop: 20, borderTop: '1px solid #f1f5f9' }}>
                        <button
                            onClick={handleSave} disabled={saving}
                            style={{
                                padding: '10px 28px', background: saving ? '#94a3b8' : '#0F2E22',
                                color: '#fff', border: 'none', borderRadius: 8, fontSize: 13,
                                fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer',
                            }}
                        >
                            {saving ? 'Saving…' : editing ? 'Save Changes' : 'Create Product'}
                        </button>
                        <button
                            onClick={() => setShowForm(false)}
                            style={{ padding: '10px 20px', background: '#f8fafc', color: '#374151', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 13, cursor: 'pointer' }}
                        >
                            Cancel
                        </button>
                        {msg && <span style={{ fontSize: 13, color: msg.ok ? '#059669' : '#dc2626', fontWeight: 500 }}>{msg.text}</span>}
                    </div>
                </div>
            )}

            {/* Product table */}
            {loading ? (
                <div style={{ color: '#94a3b8', fontSize: 14 }}>Loading…</div>
            ) : (
                <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                                {['Product', 'SKU', 'Category', 'Price', 'Discount', 'Stock', 'Status', ''].map(h => (
                                    <th key={h} style={{
                                        padding: '11px 16px', textAlign: 'left',
                                        fontSize: 11, fontWeight: 700, color: '#94a3b8',
                                        textTransform: 'uppercase', letterSpacing: '0.08em',
                                    }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(p => {
                                const name = typeof p.name === 'object' ? (p.name.en || p.name.fr) : p.name;
                                const catName = (() => {
                                    const cat = categories.find(c => c.id === p.categoryId);
                                    if (!cat) return '—';
                                    return typeof cat.name === 'object' ? (cat.name.en || cat.name.fr) : cat.name;
                                })();
                                return (
                                    <tr key={p.id} style={{ borderBottom: '1px solid #f8fafc', transition: 'background 0.1s' }}>
                                        <td style={{ padding: '13px 16px', fontSize: 13.5, fontWeight: 600, color: '#0f172a' }}>{name}</td>
                                        <td style={{ padding: '13px 16px', fontSize: 12, color: '#64748b', fontFamily: 'monospace' }}>{p.sku}</td>
                                        <td style={{ padding: '13px 16px', fontSize: 13, color: '#64748b' }}>{catName}</td>
                                        <td style={{ padding: '13px 16px', fontSize: 13.5, fontWeight: 700, color: '#0f172a' }}>
                                            €{Number(p.price).toFixed(2)}
                                        </td>
                                        <td style={{ padding: '13px 16px', fontSize: 12, color: '#94a3b8' }}>
                                            {p.compareAtPrice ? (
                                                <span style={{ textDecoration: 'line-through' }}>€{Number(p.compareAtPrice).toFixed(2)}</span>
                                            ) : '—'}
                                        </td>
                                        <td style={{ padding: '13px 16px', fontSize: 13, fontWeight: 700, color: p.stock > 5 ? '#059669' : p.stock > 0 ? '#d97706' : '#dc2626' }}>
                                            {p.stock}
                                        </td>
                                        <td style={{ padding: '13px 16px' }}>
                                            <span style={{
                                                display: 'inline-flex', alignItems: 'center', gap: 5,
                                                background: p.isActive ? '#f0fdf4' : '#fef2f2',
                                                color: p.isActive ? '#166534' : '#991b1b',
                                                padding: '3px 9px', borderRadius: 20, fontSize: 11.5, fontWeight: 600,
                                            }}>
                                                <span style={{ width: 5, height: 5, borderRadius: '50%', background: p.isActive ? '#22c55e' : '#ef4444' }} />
                                                {p.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td style={{ padding: '13px 16px' }}>
                                            <div style={{ display: 'flex', gap: 6 }}>
                                                <button
                                                    onClick={() => openEdit(p)}
                                                    style={{
                                                        display: 'inline-flex', alignItems: 'center', gap: 4,
                                                        padding: '5px 11px', background: '#eff6ff', color: '#1d4ed8',
                                                        border: 'none', borderRadius: 6, fontSize: 12, cursor: 'pointer', fontWeight: 600,
                                                    }}
                                                >
                                                    <IconEdit /> Edit
                                                </button>
                                                {p.isActive && (
                                                    <button
                                                        onClick={() => handleDeactivate(p.id)}
                                                        style={{
                                                            display: 'inline-flex', alignItems: 'center', gap: 4,
                                                            padding: '5px 11px', background: '#fef2f2', color: '#dc2626',
                                                            border: 'none', borderRadius: 6, fontSize: 12, cursor: 'pointer', fontWeight: 600,
                                                        }}
                                                    >
                                                        <IconSlash /> Deactivate
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
