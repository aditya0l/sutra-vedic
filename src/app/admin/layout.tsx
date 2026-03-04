import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Sutra Vedic — Admin',
    description: 'Admin Dashboard',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div style={{ margin: 0, padding: 0, fontFamily: "system-ui, -apple-system, 'Inter', sans-serif" }}>
            {children}
        </div>
    );
}
