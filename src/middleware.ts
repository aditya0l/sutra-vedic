import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextRequest, NextResponse } from 'next/server';

const intlMiddleware = createMiddleware(routing);

export default function middleware(req: NextRequest) {
    const pathname = req.nextUrl.pathname;

    // Skip next-intl for admin routes — handle them as plain Next.js pages
    if (pathname.startsWith('/admin')) {
        return NextResponse.next();
    }

    return intlMiddleware(req);
}

export const config = {
    matcher: [
        '/((?!api|_next|_vercel|.*\\..*).*)',
        '/(fr|en)/:path*'
    ]
};
