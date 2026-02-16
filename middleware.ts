import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

const AUTH_SECRET = process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET;

export async function middleware(request: NextRequest) {
    let token = await getToken({
        req: request,
        secret: AUTH_SECRET,
        secureCookie: true,
    });

    if (!token) {
        token = await getToken({
            req: request,
            secret: AUTH_SECRET,
            secureCookie: false,
        });
    }

    const isAuthPage =
        request.nextUrl.pathname.startsWith('/login') ||
        request.nextUrl.pathname.startsWith('/register');

    if (isAuthPage) {
        if (token) {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }
        return NextResponse.next();
    }

    const isProtectedRoute =
        request.nextUrl.pathname.startsWith('/dashboard') ||
        request.nextUrl.pathname.startsWith('/workflows') ||
        request.nextUrl.pathname.startsWith('/run') ||
        request.nextUrl.pathname.startsWith('/history') ||
        request.nextUrl.pathname.startsWith('/settings');

    if (isProtectedRoute && !token) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/dashboard/:path*',
        '/workflows/:path*',
        '/run/:path*',
        '/history/:path*',
        '/settings/:path*',
        '/login',
        '/register',
    ],
};
