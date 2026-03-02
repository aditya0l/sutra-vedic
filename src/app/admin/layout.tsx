import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Sutra Vedic — Admin',
    description: 'Admin Dashboard',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body style={{ margin: 0, padding: 0, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                {children}
            </body>
        </html>
    );
}
