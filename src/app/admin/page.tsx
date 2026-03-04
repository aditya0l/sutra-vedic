'use client';
import { useState, useEffect } from 'react';
import AdminShell from './_components/AdminShell';
import LoginPage from './_components/LoginPage';
import { auth as firebaseAuth } from '@/lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

const ADMIN_EMAIL = 'contact@sutravedic.fr';

export default function AdminPage() {
    const [checking, setChecking] = useState(true);
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        // Firebase persists auth state in IndexedDB natively — onAuthStateChanged
        // restores it after page refresh so firebaseAuth.currentUser is always valid.
        const unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
            if (user && user.email === ADMIN_EMAIL) {
                const t = await user.getIdToken();
                setToken(t);
            } else {
                setToken(null);
            }
            setChecking(false);
        });
        return () => unsubscribe();
    }, []);

    if (checking) return null; // Brief flash while Firebase resolves

    if (!token) {
        return <LoginPage onLogin={(t) => setToken(t)} />;
    }

    return <AdminShell token={token} onLogout={async () => {
        await signOut(firebaseAuth);
        setToken(null);
    }} />;
}
