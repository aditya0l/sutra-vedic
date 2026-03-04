'use client';
import { useState, useEffect } from 'react';
import AdminShell from './_components/AdminShell';
import LoginPage from './_components/LoginPage';

export default function AdminPage() {
    const [mounted, setMounted] = useState(false);
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        setToken(localStorage.getItem('admin_token'));
        setMounted(true);
    }, []);

    if (!mounted) return null; // Avoid hydration mismatch

    if (!token) {
        return <LoginPage onLogin={(t) => { localStorage.setItem('admin_token', t); setToken(t); }} />;
    }

    return <AdminShell token={token} onLogout={() => { localStorage.removeItem('admin_token'); setToken(null); }} />;
}
