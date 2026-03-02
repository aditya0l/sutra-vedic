'use client';
import { useState } from 'react';
import AdminShell from './_components/AdminShell';
import LoginPage from './_components/LoginPage';

export default function AdminPage() {
    const [token, setToken] = useState<string | null>(() => {
        if (typeof window !== 'undefined') return localStorage.getItem('admin_token');
        return null;
    });

    if (!token) {
        return <LoginPage onLogin={(t) => { localStorage.setItem('admin_token', t); setToken(t); }} />;
    }

    return <AdminShell token={token} onLogout={() => { localStorage.removeItem('admin_token'); setToken(null); }} />;
}
