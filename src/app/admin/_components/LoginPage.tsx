'use client';
import React, { useState } from 'react';

import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

export default function LoginPage({ onLogin }: { onLogin: (token: string) => void }) {
    const [email, setEmail] = useState('contact@sutravedic.fr');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const [isInitializing, setIsInitializing] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            if (isInitializing) {
                // Create the admin user
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const token = await userCredential.user.getIdToken();
                onLogin(token);
                return;
            }

            // Normal login
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const token = await userCredential.user.getIdToken();
            onLogin(token);
        } catch (err: any) {
            console.error("Login error:", err);

            // If it's the admin email and it failed because it doesn't exist (invalid-credential is used generically now)
            if (email.toLowerCase() === 'contact@sutravedic.fr' && !isInitializing) {
                if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential' || err.code === 'auth/invalid-login-credentials') {
                    setIsInitializing(true);
                    setError("Admin account not found. Please click 'Initialize Admin Account' below to create it with this password.");
                    setLoading(false);
                    return;
                }
            }

            const msg = err.code || err.message || 'Server unreachable. Make sure the backend is running.';
            setError(`Error: ${msg}`);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div style={{
            minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'linear-gradient(135deg, #0F2E22 0%, #1a4a35 100%)',
        }}>
            <div style={{
                background: '#fff', borderRadius: 16, padding: '48px 40px', width: '100%', maxWidth: 400,
                boxShadow: '0 25px 80px rgba(0,0,0,0.35)',
            }}>
                <div style={{ textAlign: 'center', marginBottom: 32 }}>
                    <div style={{ fontSize: 24, fontWeight: 700, color: '#0F2E22', letterSpacing: '0.03em' }}>Sutra Vedic</div>
                    <div style={{ fontSize: 12, color: '#C9A84C', letterSpacing: '0.15em', textTransform: 'uppercase', marginTop: 4 }}>Admin Panel</div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: 16 }}>
                        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Email</label>
                        <input
                            type="email" value={email} onChange={e => setEmail(e.target.value)}
                            required
                            style={{
                                width: '100%', padding: '11px 14px', border: '1.5px solid #e5e7eb',
                                borderRadius: 8, fontSize: 14, outline: 'none', boxSizing: 'border-box',
                            }}
                        />
                    </div>
                    <div style={{ marginBottom: 24 }}>
                        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Password</label>
                        <input
                            type="password" value={password} onChange={e => setPassword(e.target.value)}
                            required
                            style={{
                                width: '100%', padding: '11px 14px', border: '1.5px solid #e5e7eb',
                                borderRadius: 8, fontSize: 14, outline: 'none', boxSizing: 'border-box',
                            }}
                        />
                    </div>
                    {error && (
                        <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 8, padding: '10px 14px', marginBottom: 16, color: '#dc2626', fontSize: 13 }}>
                            {error}
                        </div>
                    )}
                    <button
                        type="submit" disabled={loading}
                        style={{
                            width: '100%', padding: '13px', background: loading ? '#9ca3af' : (isInitializing ? '#C9A84C' : '#0F2E22'),
                            color: isInitializing ? '#0F2E22' : '#fff', border: 'none', borderRadius: 8, fontSize: 15,
                            fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', letterSpacing: '0.03em',
                        }}
                    >
                        {loading ? 'Processing…' : (isInitializing ? 'Initialize Admin Account' : 'Sign In')}
                    </button>
                </form>

                <p style={{ textAlign: 'center', fontSize: 12, color: '#9ca3af', marginTop: 24 }}>
                    Admin Access Only
                </p>
            </div>
        </div>
    );
}
